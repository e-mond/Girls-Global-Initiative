import { test, expect } from "@playwright/test";
import { subscribeSchema } from "../../features/newsletter/schemas";

test.describe("newsletter schemas", () => {
  test("accepts a valid email", () => {
    expect(subscribeSchema.safeParse({ email: "friend@example.com" }).success).toBe(
      true,
    );
  });
});

test.describe("newsletter pages", () => {
  test("unsubscribe page renders", async ({ page }) => {
    await page.goto("/newsletter/unsubscribe");
    await expect(
      page.getByRole("heading", { name: /Unsubscribe/i }),
    ).toBeVisible();
  });
});
