import { randomBytes, createHash } from "crypto";
import { and, eq, gt, isNotNull } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/features/governance/credentials";
import { passwordResetEmail } from "@/features/email/branded";
import { emailSiteOrigin } from "@/features/email/site-origin";
import { sendAcknowledgementEmail } from "@/features/submissions/email";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Starts a staff password reset. Always resolves successfully to the caller
 * (no email enumeration). Sends SMTP mail when configured and a user exists.
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
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.email, normalised))
      .limit(1);

    if (!row) {
      return { accepted: true };
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await db
      .update(users)
      .set({
        passwordResetToken: tokenHash,
        passwordResetExpires: expires,
        updatedAt: new Date(),
      })
      .where(eq(users.id, row.id));

    const resetUrl = `${emailSiteOrigin()}/admin/reset-password?token=${rawToken}`;
    const mail = passwordResetEmail({ name: row.name, resetUrl });
    await sendAcknowledgementEmail({
      to: row.email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  } catch {
    // Soft-fail: never reveal infrastructure issues to the public form.
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

  const tokenHash = hashToken(token);
  const now = new Date();

  try {
    const [row] = await db
      .select({ id: users.id })
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
      return {
        ok: false,
        message: "This reset link is invalid or has expired. Request a new one.",
      };
    }

    const passwordHash = await hashPassword(input.password);
    await db
      .update(users)
      .set({
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
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
