import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { sessions, timeSlots } from "@db/schema";
import { eq, and, gte } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Get all sessions (public)
  app.get("/api/sessions", async (_req, res) => {
    try {
      const allSessions = await db.query.sessions.findMany({
        orderBy: (sessions, { desc }) => [desc(sessions.sessionDate)],
      });
      res.json(allSessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Create new session (authenticated)
  app.post("/api/sessions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const [newSession] = await db
        .insert(sessions)
        .values({ ...req.body, coachId: req.user.id })
        .returning();
      res.json(newSession);
    } catch (error) {
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Update session (authenticated)
  app.put("/api/sessions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const id = parseInt(req.params.id);
    try {
      const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, id))
        .limit(1);

      if (!session || session.coachId !== req.user.id) {
        return res.status(403).send("Not authorized");
      }

      const [updatedSession] = await db
        .update(sessions)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(sessions.id, id))
        .returning();
      res.json(updatedSession);
    } catch (error) {
      res.status(500).json({ error: "Failed to update session" });
    }
  });

  // Delete session (authenticated)
  app.delete("/api/sessions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const id = parseInt(req.params.id);
    try {
      const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, id))
        .limit(1);

      if (!session || session.coachId !== req.user.id) {
        return res.status(403).send("Not authorized");
      }

      await db.delete(sessions).where(eq(sessions.id, id));
      res.json({ message: "Session deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete session" });
    }
  });

  // Time Slots API endpoints
  // Get available time slots
  app.get("/api/time-slots", async (req, res) => {
    try {
      const allTimeSlots = await db.query.timeSlots.findMany({
        where: and(
          eq(timeSlots.isBooked, false),
          gte(timeSlots.startTime, new Date())
        ),
        orderBy: (timeSlots, { asc }) => [asc(timeSlots.startTime)],
      });
      res.json(allTimeSlots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch time slots" });
    }
  });

  // Get coach's time slots (authenticated)
  app.get("/api/time-slots/coach", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const coachTimeSlots = await db.query.timeSlots.findMany({
        where: eq(timeSlots.coachId, req.user.id),
        orderBy: (timeSlots, { asc }) => [asc(timeSlots.startTime)],
      });
      res.json(coachTimeSlots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coach time slots" });
    }
  });

  // Create time slot (authenticated)
  app.post("/api/time-slots", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const [newTimeSlot] = await db
        .insert(timeSlots)
        .values({ ...req.body, coachId: req.user.id })
        .returning();
      res.json(newTimeSlot);
    } catch (error) {
      res.status(500).json({ error: "Failed to create time slot" });
    }
  });

  // Update time slot (authenticated)
  app.put("/api/time-slots/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const id = parseInt(req.params.id);
    try {
      const [timeSlot] = await db
        .select()
        .from(timeSlots)
        .where(eq(timeSlots.id, id))
        .limit(1);

      if (!timeSlot || timeSlot.coachId !== req.user.id) {
        return res.status(403).send("Not authorized");
      }

      const [updatedTimeSlot] = await db
        .update(timeSlots)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(timeSlots.id, id))
        .returning();
      res.json(updatedTimeSlot);
    } catch (error) {
      res.status(500).json({ error: "Failed to update time slot" });
    }
  });

  // Delete time slot (authenticated)
  app.delete("/api/time-slots/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const id = parseInt(req.params.id);
    try {
      const [timeSlot] = await db
        .select()
        .from(timeSlots)
        .where(eq(timeSlots.id, id))
        .limit(1);

      if (!timeSlot || timeSlot.coachId !== req.user.id) {
        return res.status(403).send("Not authorized");
      }

      await db.delete(timeSlots).where(eq(timeSlots.id, id));
      res.json({ message: "Time slot deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete time slot" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}