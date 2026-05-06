import { Router } from "express";
import { db } from "@workspace/db";
import { blockedSlotsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/blocked-slots", async (req, res) => {
  try {
    const slots = await db
      .select()
      .from(blockedSlotsTable)
      .orderBy(blockedSlotsTable.date);
    res.json(
      slots.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list blocked slots");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blocked-slots", async (req, res) => {
  const { date, time, reason } = req.body as { date?: string; time?: string | null; reason?: string | null };
  if (!date || typeof date !== "string") {
    return res.status(400).json({ error: "Invalid input: date is required" });
  }
  try {
    const [slot] = await db
      .insert(blockedSlotsTable)
      .values({ date, time: time ?? null, reason: reason ?? null })
      .returning();
    res.status(201).json({ ...slot, createdAt: slot.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to create blocked slot");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/blocked-slots/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    await db.delete(blockedSlotsTable).where(eq(blockedSlotsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete blocked slot");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
