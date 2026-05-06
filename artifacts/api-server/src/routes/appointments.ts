import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, servicesTable, blockedSlotsTable } from "@workspace/db";
import { eq, and, ne, or, isNull } from "drizzle-orm";
import {
  CreateAppointmentBody,
  UpdateAppointmentStatusBody,
  GetAppointmentParams,
  UpdateAppointmentStatusParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/appointments/stats", async (req, res) => {
  try {
    const all = await db.select().from(appointmentsTable);
    const stats = {
      total: all.length,
      pending: all.filter((a) => a.status === "pending").length,
      confirmed: all.filter((a) => a.status === "confirmed").length,
      completed: all.filter((a) => a.status === "completed").length,
      cancelled: all.filter((a) => a.status === "cancelled").length,
    };
    res.json(stats);
  } catch (err) {
    req.log.error({ err }, "Failed to get appointment stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const appointments = await db
      .select({
        id: appointmentsTable.id,
        name: appointmentsTable.name,
        phone: appointmentsTable.phone,
        email: appointmentsTable.email,
        serviceId: appointmentsTable.serviceId,
        serviceName: servicesTable.name,
        preferredDate: appointmentsTable.preferredDate,
        preferredTime: appointmentsTable.preferredTime,
        notes: appointmentsTable.notes,
        status: appointmentsTable.status,
        createdAt: appointmentsTable.createdAt,
      })
      .from(appointmentsTable)
      .leftJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
      .orderBy(appointmentsTable.createdAt);
    res.json(appointments);
  } catch (err) {
    req.log.error({ err }, "Failed to list appointments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/appointments", async (req, res) => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const body = parsed.data;

  // Parse date string in dd/MM/yyyy format
  let appointmentDate: Date;
  const dateParts = body.preferredDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dateParts) {
    appointmentDate = new Date(Number(dateParts[3]), Number(dateParts[2]) - 1, Number(dateParts[1]));
  } else {
    appointmentDate = new Date(body.preferredDate);
  }

  // Block Sundays (0 = Sunday)
  if (appointmentDate.getDay() === 0) {
    return res.status(422).json({ error: "Não realizamos atendimentos aos domingos. Por favor, escolha outro dia." });
  }

  try {
    const service = await db.select().from(servicesTable).where(eq(servicesTable.id, body.serviceId)).limit(1);
    if (!service.length) {
      return res.status(400).json({ error: "Service not found" });
    }

    // Block if the date or date+time is manually blocked by the owner
    const blocked = await db
      .select({ id: blockedSlotsTable.id })
      .from(blockedSlotsTable)
      .where(
        and(
          eq(blockedSlotsTable.date, body.preferredDate),
          or(
            isNull(blockedSlotsTable.time),
            eq(blockedSlotsTable.time, body.preferredTime)
          )
        )
      )
      .limit(1);

    if (blocked.length > 0) {
      return res.status(409).json({ error: "Este dia ou horário não está disponível para agendamento. Por favor, escolha outra data ou horário." });
    }

    // Block duplicate slot: same date + same time (excluding cancelled appointments)
    const existing = await db
      .select({ id: appointmentsTable.id })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.preferredDate, body.preferredDate),
          eq(appointmentsTable.preferredTime, body.preferredTime),
          ne(appointmentsTable.status, "cancelled")
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: "Este horário já está reservado. Por favor, escolha outro horário ou data." });
    }

    const [appt] = await db.insert(appointmentsTable).values({
      name: body.name,
      phone: body.phone,
      email: body.email,
      serviceId: body.serviceId,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      notes: body.notes ?? null,
      status: "pending",
    }).returning();

    res.status(201).json({
      ...appt,
      serviceName: service[0].name,
      createdAt: appt.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create appointment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/appointments/:id", async (req, res) => {
  const parsed = GetAppointmentParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid id" });
  }
  try {
    const [appt] = await db
      .select({
        id: appointmentsTable.id,
        name: appointmentsTable.name,
        phone: appointmentsTable.phone,
        email: appointmentsTable.email,
        serviceId: appointmentsTable.serviceId,
        serviceName: servicesTable.name,
        preferredDate: appointmentsTable.preferredDate,
        preferredTime: appointmentsTable.preferredTime,
        notes: appointmentsTable.notes,
        status: appointmentsTable.status,
        createdAt: appointmentsTable.createdAt,
      })
      .from(appointmentsTable)
      .leftJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
      .where(eq(appointmentsTable.id, parsed.data.id));

    if (!appt) return res.status(404).json({ error: "Not found" });
    res.json({ ...appt, createdAt: appt.createdAt instanceof Date ? appt.createdAt.toISOString() : appt.createdAt });
  } catch (err) {
    req.log.error({ err }, "Failed to get appointment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/appointments/:id", async (req, res) => {
  const paramParsed = UpdateAppointmentStatusParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = UpdateAppointmentStatusBody.safeParse(req.body);
  if (!paramParsed.success || !bodyParsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const [updated] = await db
      .update(appointmentsTable)
      .set({ status: bodyParsed.data.status })
      .where(eq(appointmentsTable.id, paramParsed.data.id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Not found" });

    const service = await db.select().from(servicesTable).where(eq(servicesTable.id, updated.serviceId)).limit(1);
    res.json({
      ...updated,
      serviceName: service[0]?.name ?? "",
      createdAt: updated.createdAt instanceof Date ? updated.createdAt.toISOString() : updated.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update appointment status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
