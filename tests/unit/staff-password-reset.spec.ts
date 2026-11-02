import { test, expect } from "@playwright/test";
import {
  passwordResetEmail,
  staffInviteEmail,
} from "../../features/email/branded";
import {
  STAFF_INVITE_TTL_MS,
  STAFF_RESET_TTL_MS,
  hashPasswordResetToken,
  inspectStaffPasswordResetToken,
} from "../../features/governance/password-reset";

test.describe("staff password reset / invite tokens", () => {
  test("invite TTL is 72 hours and reset TTL is 1 hour", () => {
    expect(STAFF_INVITE_TTL_MS).toBe(72 * 60 * 60 * 1000);
    expect(STAFF_RESET_TTL_MS).toBe(60 * 60 * 1000);
  });

  test("token hash is stable SHA-256 hex", () => {
    const a = hashPasswordResetToken("abc");
    const b = hashPasswordResetToken("abc");
    const c = hashPasswordResetToken("abd");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  test("inspect rejects empty token without database", async () => {
    const result = await inspectStaffPasswordResetToken("   ");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("missing");
      expect(result.message.toLowerCase()).toContain("token");
    }
  });

  test("invite and reset email copy mention expiry windows", () => {
    const invite = staffInviteEmail({
      name: "Ama",
      inviteUrl: "https://example.com/invite",
      expiresInHours: 72,
    });
    expect(invite.text).toMatch(/72 hours/i);
    expect(invite.text).toMatch(/spam/i);

    const reset = passwordResetEmail({
      name: "Ama",
      resetUrl: "https://example.com/reset",
      expiresInHours: 1,
    });
    expect(reset.text).toMatch(/one hour/i);
    expect(reset.text).toMatch(/spam/i);
  });
});
