import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/features/governance/credentials";
import type { StaffRole } from "@/features/governance/rbac";

export type StaffUserRecord = {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export async function listStaffUsers(): Promise<StaffUserRecord[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db.select().from(users).orderBy(desc(users.createdAt));
  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lastLoginAt: row.lastLoginAt ? row.lastLoginAt.toISOString() : null,
  }));
}

export async function createStaffUser(input: {
  name: string;
  email: string;
  role: StaffRole;
  password: string;
}): Promise<StaffUserRecord | { error: string }> {
  const db = getDb();
  if (!db) {
    return { error: "Database is required to manage staff users." };
  }

  const email = input.email.trim().toLowerCase();
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) {
    return { error: "A staff user with this email already exists." };
  }

  const passwordHash = await hashPassword(input.password);
  const [row] = await db
    .insert(users)
    .values({
      name: input.name.trim(),
      email,
      role: input.role,
      passwordHash,
    })
    .returning();

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lastLoginAt: null,
  };
}

export async function updateStaffUser(input: {
  id: string;
  name?: string;
  role?: StaffRole;
  password?: string;
}): Promise<StaffUserRecord | { error: string }> {
  const db = getDb();
  if (!db) {
    return { error: "Database is required to manage staff users." };
  }

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.id, input.id))
    .limit(1);
  if (!existing) {
    return { error: "Staff user not found." };
  }

  const passwordHash = input.password
    ? await hashPassword(input.password)
    : undefined;

  const [row] = await db
    .update(users)
    .set({
      name: input.name?.trim() ?? existing.name,
      role: input.role ?? existing.role,
      ...(passwordHash ? { passwordHash } : {}),
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.id))
    .returning();

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lastLoginAt: row.lastLoginAt ? row.lastLoginAt.toISOString() : null,
  };
}
