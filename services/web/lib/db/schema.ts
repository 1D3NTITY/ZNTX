import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

// Datensparsamkeit (DSGVO): nur was fürs Bearbeiten der Anfrage nötig ist —
// keine IP-Adresse, kein User-Agent, kein Tracking-Feld.
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  message: text("message").notNull(),
  turnstileVerified: boolean("turnstile_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
