/**
 * Seeds an Administrator staff user when DATABASE_URL is configured.
 * Usage: npm run db:seed-admin
 *
 * Reads SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD / SEED_ADMIN_NAME from env,
 * falling back to AUTH_DEV_* values for local bootstrap.
 *
 * Set SEED_ADMIN_UPDATE_PASSWORD=1 to rotate the password for an existing
 * administrator (production-safe re-seed). Never commit real passwords.
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
  const updatePassword =
    process.env.SEED_ADMIN_UPDATE_PASSWORD === "1" ||
    process.env.SEED_ADMIN_UPDATE_PASSWORD === "true";

  if (password.length < 12) {
    console.error("Admin password must be at least 12 characters.");
    process.exit(1);
  }

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    if (!updatePassword) {
      console.log(`Admin already exists: ${email}`);
      console.log(
        "To rotate the password, re-run with SEED_ADMIN_UPDATE_PASSWORD=1.",
      );
      return;
    }

    const passwordHash = await hashPassword(password);
    await db
      .update(users)
      .set({
        passwordHash,
        name,
        role: "administrator",
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id));

    console.log(`Updated administrator password: ${email}`);
    return;
  }

  const passwordHash = await hashPassword(password);
  await db.insert(users).values({
    email,
    name,
    passwordHash,
    role: "administrator",
    status: "active",
  });

  console.log(`Created administrator: ${email}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
