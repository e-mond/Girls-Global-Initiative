import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import type { StaffRole } from "@/features/governance/rbac";

export type StaffUser = {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
};

/**
 * Verifies staff credentials against Neon when configured.
 * Without DATABASE_URL (local/MSW), falls back to AUTH_DEV_* env only
 * outside production — documented bootstrap for Unit 3 offline work.
 */
export async function verifyStaffCredentials(
  email: string,
  password: string,
): Promise<StaffUser | null> {
  const normalised = email.trim().toLowerCase();
  const db = getDb();

  if (db) {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalised))
      .limit(1);

    if (!row) {
      return null;
    }

    const ok = await bcrypt.compare(password, row.passwordHash);
    if (!ok) {
      return null;
    }

    await db
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, row.id));

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
    };
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const devEmail = process.env.AUTH_DEV_EMAIL?.trim().toLowerCase();
  const devPassword = process.env.AUTH_DEV_PASSWORD;
  const devName = process.env.AUTH_DEV_NAME ?? "Local Editor";
  const devRole = (process.env.AUTH_DEV_ROLE ?? "administrator") as StaffRole;

  if (!devEmail || !devPassword) {
    return null;
  }

  if (normalised !== devEmail || password !== devPassword) {
    return null;
  }

  return {
    id: "00000000-0000-4000-8000-000000000001",
    email: devEmail,
    name: devName,
    role: devRole === "editor" ? "editor" : "administrator",
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
