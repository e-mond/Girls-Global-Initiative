import { and, count, desc, eq, ne } from "drizzle-orm";
import { randomBytes, createHash } from "crypto";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/features/governance/credentials";
import type { StaffRole } from "@/features/governance/rbac";
import { staffInviteEmail } from "@/features/email/branded";
import { emailSiteOrigin } from "@/features/email/site-origin";
import { sendAcknowledgementEmail } from "@/features/submissions/email";

export type StaffStatus = "active" | "invited" | "disabled";

export type StaffUserRecord = {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

const INVITE_TTL_MS = 72 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function mapRow(row: typeof users.$inferSelect): StaffUserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lastLoginAt: row.lastLoginAt ? row.lastLoginAt.toISOString() : null,
  };
}

async function issueInviteToken(
  userId: string,
  name: string,
  email: string,
): Promise<{ ok: true } | { error: string }> {
  const db = getDb();
  if (!db) {
    return { error: "Database is required to invite staff users." };
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + INVITE_TTL_MS);

  await db
    .update(users)
    .set({
      passwordResetToken: tokenHash,
      passwordResetExpires: expires,
      status: "invited",
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  const inviteUrl = `${emailSiteOrigin()}/admin/reset-password?token=${rawToken}&invite=1`;
  const mail = staffInviteEmail({ name, inviteUrl });
  const sent = await sendAcknowledgementEmail({
    to: email,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });

  if (!sent.sent) {
    return {
      error:
        sent.reason ??
        "Could not send the invitation email. Check SMTP settings.",
    };
  }

  return { ok: true };
}

export async function listStaffUsers(): Promise<StaffUserRecord[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db.select().from(users).orderBy(desc(users.createdAt));
  return rows.map(mapRow);
}

/** Invite a staff user — no temporary password; email contains set-password link. */
export async function inviteStaffUser(input: {
  name: string;
  email: string;
  role: StaffRole;
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

  // Unusable random hash until the invitee sets their own password.
  const passwordHash = await hashPassword(randomBytes(32).toString("hex"));
  const [row] = await db
    .insert(users)
    .values({
      name: input.name.trim(),
      email,
      role: input.role,
      passwordHash,
      status: "invited",
    })
    .returning();

  const invite = await issueInviteToken(row.id, row.name, row.email);
  if ("error" in invite) {
    return { error: invite.error ?? "Could not send the invitation email." };
  }

  const [fresh] = await db
    .select()
    .from(users)
    .where(eq(users.id, row.id))
    .limit(1);

  return mapRow(fresh);
}

export async function resendStaffInvite(
  id: string,
): Promise<StaffUserRecord | { error: string }> {
  const db = getDb();
  if (!db) {
    return { error: "Database is required to manage staff users." };
  }

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!existing) {
    return { error: "Staff user not found." };
  }
  if (existing.status === "disabled") {
    return { error: "Re-enable this account before resending an invitation." };
  }
  if (existing.status === "active" && existing.lastLoginAt) {
    return {
      error: "This user already signed in. Ask them to use forgot password.",
    };
  }

  const invite = await issueInviteToken(
    existing.id,
    existing.name,
    existing.email,
  );
  if ("error" in invite) {
    return { error: invite.error ?? "Could not send the invitation email." };
  }

  const [fresh] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return mapRow(fresh);
}

export async function updateStaffUser(input: {
  id: string;
  actorUserId: string;
  name?: string;
  role?: StaffRole;
  status?: Exclude<StaffStatus, "invited">;
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

  if (input.status === "disabled") {
    if (input.id === input.actorUserId) {
      return { error: "You cannot disable your own account." };
    }
    if (existing.role === "administrator" && existing.status === "active") {
      const [activeAdmins] = await db
        .select({ value: count() })
        .from(users)
        .where(
          and(
            eq(users.role, "administrator"),
            eq(users.status, "active"),
            ne(users.id, existing.id),
          ),
        );
      if ((activeAdmins?.value ?? 0) < 1) {
        return {
          error: "Cannot disable the last active administrator.",
        };
      }
    }
  }

  if (
    input.status === "active" &&
    existing.status === "invited"
  ) {
    return {
      error: "Invited users become active after they set a password via the invite link.",
    };
  }

  const nextRole = input.role ?? existing.role;
  if (
    existing.role === "administrator" &&
    existing.status === "active" &&
    nextRole === "editor"
  ) {
    const [activeAdmins] = await db
      .select({ value: count() })
      .from(users)
      .where(
        and(
          eq(users.role, "administrator"),
          eq(users.status, "active"),
          ne(users.id, existing.id),
        ),
      );
    if ((activeAdmins?.value ?? 0) < 1) {
      return { error: "Cannot demote the last active administrator." };
    }
  }

  const [row] = await db
    .update(users)
    .set({
      name: input.name?.trim() ?? existing.name,
      role: nextRole,
      status: input.status ?? existing.status,
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.id))
    .returning();

  return mapRow(row);
}
