import { pgTable, text, serial, integer, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionNumber: integer("session_number").notNull(),
  sessionDate: date("session_date").notNull(),
  attendance: text("attendance").notNull(),
  topics: text("topics").notNull(),
  homework: text("homework").notNull(),
  gameAnalysis: text("game_analysis").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  coachId: integer("coach_id").references(() => users.id).notNull(),
  timeSlotId: integer("time_slot_id").references(() => timeSlots.id),
});

export const timeSlots = pgTable("time_slots", {
  id: serial("id").primaryKey(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), 
  isRecurring: boolean("is_recurring").default(true).notNull(),
  coachId: integer("coach_id").references(() => users.id).notNull(),
  isBooked: boolean("is_booked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  coach: one(users, {
    fields: [sessions.coachId],
    references: [users.id],
  }),
  timeSlot: one(timeSlots, {
    fields: [sessions.timeSlotId],
    references: [timeSlots.id],
  }),
}));

export const timeSlotRelations = relations(timeSlots, ({ one }) => ({
  coach: one(users, {
    fields: [timeSlots.coachId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);
export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;

export const insertTimeSlotSchema = createInsertSchema(timeSlots);
export const selectTimeSlotSchema = createSelectSchema(timeSlots);
export type InsertTimeSlot = typeof timeSlots.$inferInsert;
export type SelectTimeSlot = typeof timeSlots.$inferSelect;