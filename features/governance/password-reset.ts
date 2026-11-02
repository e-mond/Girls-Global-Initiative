import { randomBytes, createHash } from "crypto";
import { and, eq, gt, isNotNull } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/features/governance/credentials";
import {
  passwordResetEmail,
  staffInviteEmail,
} from "@/features/email/branded";
import { emailSiteOrigin } from "@/features/email/site-origin";
import { sendAcknowledgementEmail } from "@/features/submissions/email";

/** Invitation / first-time set-password links. */
export const STAFF_INVITE_TTL_MS = 72 * 60 * 60 * 1000;
/** Password reset links for already-active staff. */
export const STAFF_RESET_TTL_MS = 60 * 60 * 1000;

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export type InspectResetTokenResult =
  | { ok: true; kind: "invite" | "reset" }
  | {
      ok: false;
      reason: "missing" | "invalid" | "expired" | "disabled" | "unavailable";
      message: string;
    };

/**
 * Non-consuming check so the reset page can show expired/invalid state
 * before the person fills in a new password.
 */
export async function inspectStaffPasswordResetToken(
  token: string,
): Promise<InspectResetTokenResult> {
  const raw = token.trim();
  if (!raw) {
    return {
      ok: false,
      reason: "missing",
      message:
        "This link is missing its security token. Request a new invitation or password reset.",
    };
  }

  const db = getDb();
  if (!db) {
    return {
      ok: false,
      reason: "unavailable",
      message: "Password reset is unavailable right now. Try again later.",
    };
  }

  try {
    const tokenHash = hashPasswordResetToken(raw);
    const [row] = await db
      .select({
        status: users.status,
        passwordResetExpires: users.passwordResetExpires,
      })
      .from(users)
      .where(eq(users.passwordResetToken, tokenHash))
      .limit(1);

    if (!row) {
      return {
        ok: false,
        reason: "invalid",
        message:
          "This link is invalid or has already been used. Request a new invitation or password reset.",
      };
    }

    if (row.status === "disabled") {
      return {
        ok: false,
        reason: "disabled",
        message:
          "This staff account is disabled. Contact an administrator for help.",
      };
    }

    if (
      !row.passwordResetExpires ||
      row.passwordResetExpires.getTime() <= Date.now()
    ) {
      return {
        ok: false,
        reason: "expired",
        message:
          "This link has expired. Request a new invitation or password reset below.",
      };
    }

    return {
      ok: true,
      kind: row.status === "invited" ? "invite" : "reset",
    };
  } catch {
    return {
      ok: false,
      reason: "unavailable",
      message: "Password reset is unavailable right now. Try again later.",
    };
  }
}

/**
 * Starts a staff password reset / invite re-send.
 * Always resolves successfully to the caller (no email enumeration).
 * Awaits SMTP so Cloudflare Workers cannot drop the send after the response.
 * Disabled accounts cannot receive resets.
 */
export async function requestStaffPasswordReset(
  email: string,
): Promise<{ accepted: true }> {
  const normalised = email.trim().toLowerCase();
  const db = getDb();
  if (!db || !normalised) {
    return { accepted: true };
  }

  try {
    const [row] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        status: users.status,
        passwordResetToken: users.passwordResetToken,
        passwordResetExpires: users.passwordResetExpires,
      })
      .from(users)
      .where(eq(users.email, normalised))
      .limit(1);

    if (!row || row.status === "disabled") {
      return { accepted: true };
    }

    const isInvite = row.status === "invited";
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashPasswordResetToken(rawToken);
    const expires = new Date(
      Date.now() + (isInvite ? STAFF_INVITE_TTL_MS : STAFF_RESET_TTL_MS),
    );

    await db
      .update(users)
      .set({
        passwordResetToken: tokenHash,
        passwordResetExpires: expires,
        updatedAt: new Date(),
      })
      .where(eq(users.id, row.id));

    const resetUrl = `${emailSiteOrigin()}/admin/reset-password?token=${rawToken}`;
    const mail = isInvite
      ? staffInviteEmail({
          name: row.name,
          inviteUrl: `${resetUrl}&invite=1`,
          expiresInHours: 72,
        })
      : passwordResetEmail({ name: row.name, resetUrl, expiresInHours: 1 });

    const sent = await sendAcknowledgementEmail({
      to: row.email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });

    if (!sent.sent) {
      // Restore previous token so an older still-valid email keeps working.
      await db
        .update(users)
        .set({
          passwordResetToken: row.passwordResetToken,
          passwordResetExpires: row.passwordResetExpires,
          updatedAt: new Date(),
        })
        .where(eq(users.id, row.id));
      console.error(
        "[password-reset] SMTP failed after token issue; previous token restored",
        sent.reason,
      );
    }
  } catch (error) {
    // Soft-fail: never reveal infrastructure issues to the public form.
    console.error("[password-reset] request failed", error);
  }

  return { accepted: true };
}

export async function resetStaffPasswordWithToken(input: {
  token: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const token = input.token.trim();
  if (!token || input.password.length < 8) {
    return {
      ok: false,
      message: "Enter a valid reset link and a password of at least 8 characters.",
    };
  }

  const db = getDb();
  if (!db) {
    return {
      ok: false,
      message: "Password reset is unavailable right now. Try again later.",
    };
  }

  const tokenHash = hashPasswordResetToken(token);
  const now = new Date();

  try {
    const [row] = await db
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(
        and(
          eq(users.passwordResetToken, tokenHash),
          isNotNull(users.passwordResetExpires),
          gt(users.passwordResetExpires, now),
        ),
      )
      .limit(1);

    if (!row) {
      const inspect = await inspectStaffPasswordResetToken(token);
      if (!inspect.ok) {
        return { ok: false, message: inspect.message };
      }
      return {
        ok: false,
        message: "This reset link is invalid or has expired. Request a new one.",
      };
    }

    if (row.status === "disabled") {
      return {
        ok: false,
        message: "This staff account is disabled. Contact an administrator.",
      };
    }

    const passwordHash = await hashPassword(input.password);
    await db
      .update(users)
      .set({
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        status: "active",
        updatedAt: now,
      })
      .where(eq(users.id, row.id));

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Password reset is unavailable right now. Try again later.",
    };
  }
}
