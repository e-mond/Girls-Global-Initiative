import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DbClient = ReturnType<typeof drizzle<typeof schema>>;

const globalStore = globalThis as typeof globalThis & {
  __ggiDb?: DbClient | null;
  __ggiDbUrl?: string;
};

/**
 * Returns a cached Drizzle client when DATABASE_URL is configured.
 * Returns null when unset so local/MSW development can boot without Neon.
 * Caching avoids re-binding the full schema on every Worker request.
 */
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  if (globalStore.__ggiDb && globalStore.__ggiDbUrl === databaseUrl) {
    return globalStore.__ggiDb;
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });
  globalStore.__ggiDb = db;
  globalStore.__ggiDbUrl = databaseUrl;
  return db;
}

export type { DbClient };
