import { test, expect } from "@playwright/test";
import { canAccessAdmin, canManageUsers } from "../../features/governance/rbac";

test.describe("admin rbac helpers", () => {
  test("allows editor and administrator into admin", () => {
    expect(canAccessAdmin("editor")).toBe(true);
    expect(canAccessAdmin("administrator")).toBe(true);
    expect(canAccessAdmin(null)).toBe(false);
  });

  test("restricts user management to administrators", () => {
    expect(canManageUsers("administrator")).toBe(true);
    expect(canManageUsers("editor")).toBe(false);
  });
});

test.describe("admin auth gate", () => {
  test("redirects unauthenticated visitors to staff login", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(
      page.getByRole("heading", { name: /Staff sign in/i }),
    ).toBeVisible();
  });
});
