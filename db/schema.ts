import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Foundations schema skeleton.
 * Domain tables (pillars, submissions, donations, etc.) are added in later units.
 */
export const schemaMeta = pgTable("schema_meta", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
