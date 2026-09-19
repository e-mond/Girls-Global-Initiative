import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Returns a Drizzle client when DATABASE_URL is configured.
 * Returns null when unset so local/MSW development can boot without Neon.
 */
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export type DbClient = NonNullable<ReturnType<typeof getDb>>;
