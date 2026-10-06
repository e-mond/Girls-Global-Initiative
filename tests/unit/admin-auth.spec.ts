import { test, expect } from "@playwright/test";
import { canAccessAdmin, canManageUsers } from "../../features/governance/rbac";
import { safeAdminCallbackUrl } from "../../lib/auth/safe-callback-url";

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

test.describe("safe admin callback URLs", () => {
  test("allows relative /admin paths only", () => {
    expect(safeAdminCallbackUrl("/admin")).toBe("/admin");
    expect(safeAdminCallbackUrl("/admin/users")).toBe("/admin/users");
    expect(safeAdminCallbackUrl("https://evil.example/phish")).toBe("/admin");
    expect(safeAdminCallbackUrl("//evil.example")).toBe("/admin");
    expect(safeAdminCallbackUrl("/")).toBe("/admin");
    expect(safeAdminCallbackUrl(null)).toBe("/admin");
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

  test("returns 401 for unauthenticated admin API requests", async ({
    request,
  }) => {
    const response = await request.get("/api/admin/attention");
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body?.error?.message).toBeTruthy();
  });
});
