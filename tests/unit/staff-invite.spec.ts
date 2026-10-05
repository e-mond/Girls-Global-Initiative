import { test, expect } from "@playwright/test";
import {
  createStaffUserSchema,
  updateStaffUserSchema,
} from "../../features/settings/schemas";

test.describe("staff invite / disable schemas", () => {
  test("create staff user requires name, email, role — no password", () => {
    const ok = createStaffUserSchema.safeParse({
      name: "Ama Mensah",
      email: "ama@example.com",
      role: "editor",
    });
    expect(ok.success).toBe(true);

    const withPassword = createStaffUserSchema.safeParse({
      name: "Ama Mensah",
      email: "ama@example.com",
      role: "editor",
      temporaryPassword: "should-be-ignored-or-stripped",
    });
    // Extra keys are stripped by Zod object; parse still succeeds without password field.
    expect(withPassword.success).toBe(true);
    if (withPassword.success) {
      expect(
        (withPassword.data as { temporaryPassword?: string }).temporaryPassword,
      ).toBeUndefined();
    }

    const missingEmail = createStaffUserSchema.safeParse({
      name: "Ama",
      role: "editor",
    });
    expect(missingEmail.success).toBe(false);
  });

  test("update schema accepts disable / re-enable and resend invite", () => {
    const id = "11111111-1111-4111-8111-111111111111";
    expect(
      updateStaffUserSchema.safeParse({ id, status: "disabled" }).success,
    ).toBe(true);
    expect(
      updateStaffUserSchema.safeParse({ id, status: "active" }).success,
    ).toBe(true);
    expect(
      updateStaffUserSchema.safeParse({ id, resendInvite: true }).success,
    ).toBe(true);
    expect(
      updateStaffUserSchema.safeParse({ id, status: "invited" }).success,
    ).toBe(false);
  });
});
