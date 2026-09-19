/**
 * Seeds an Administrator staff user when DATABASE_URL is configured.
 * Usage: npx tsx scripts/seed-admin.ts
 *
 * Reads SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD / SEED_ADMIN_NAME from env,
 * falling back to AUTH_DEV_* values for local bootstrap.
 */
import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });
config(); // fallback .env

import { getDb } from "../db/client";
import { users } from "../db/schema";
import { hashPassword } from "../features/governance/credentials";

async function main() {
  const db = getDb();
  if (!db) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const email = (
    process.env.SEED_ADMIN_EMAIL ??
    process.env.AUTH_DEV_EMAIL ??
    "staff@ggi.local"
  )
    .trim()
    .toLowerCase();
  const password =
    process.env.SEED_ADMIN_PASSWORD ??
    process.env.AUTH_DEV_PASSWORD ??
    "ggi-local-dev-password";
  const name =
    process.env.SEED_ADMIN_NAME ??
    process.env.AUTH_DEV_NAME ??
    "Local Administrator";

  if (password.length < 8) {
    console.error("Admin password must be at least 8 characters.");
    process.exit(1);
  }

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  const passwordHash = await hashPassword(password);
  await db.insert(users).values({
    email,
    name,
    passwordHash,
    role: "administrator",
  });

  console.log(`Created administrator: ${email}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
