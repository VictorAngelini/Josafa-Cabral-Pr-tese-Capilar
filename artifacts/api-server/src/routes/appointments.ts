import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
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

  try {
    const service = await db.select().from(servicesTable).where(eq(servicesTable.id, body.serviceId)).limit(1);
    if (!service.length) {
      return res.status(400).json({ error: "Service not found" });
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
