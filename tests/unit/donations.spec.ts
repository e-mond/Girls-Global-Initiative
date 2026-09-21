import { test, expect } from "@playwright/test";
import { initializeDonationSchema } from "../../features/donations/schemas";

test.describe("donation schemas", () => {
  test("requires email unless anonymous", () => {
    expect(
      initializeDonationSchema.safeParse({
        amountGhs: 50,
        frequency: "one_time",
        isAnonymous: false,
      }).success,
    ).toBe(false);

    expect(
      initializeDonationSchema.safeParse({
        amountGhs: 50,
        frequency: "one_time",
        isAnonymous: true,
      }).success,
    ).toBe(true);
  });
});

test.describe("donate page", () => {
  test("renders amount and transfer sections", async ({ page }) => {
    await page.goto("/get-involved/donate");
    await expect(
      page.getByRole("heading", { name: /Donate and support a girl/i }),
    ).toBeVisible();
    await expect(page.getByText(/Prefer a direct transfer/i)).toBeVisible();
  });
});
