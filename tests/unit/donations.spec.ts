import { test, expect } from "@playwright/test";
import { initializeDonationSchema } from "../../features/donations/schemas";
import { mapPaystackGatewayStatus } from "../../features/donations/service";

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

test.describe("Paystack gateway status mapping", () => {
  test("maps success, failure, abandoned, and pending outcomes", () => {
    expect(mapPaystackGatewayStatus("success")).toBe("success");
    expect(mapPaystackGatewayStatus("failed")).toBe("failed");
    expect(mapPaystackGatewayStatus("reversed")).toBe("failed");
    expect(mapPaystackGatewayStatus("abandoned")).toBe("abandoned");
    expect(mapPaystackGatewayStatus("ongoing")).toBe("pending");
    expect(mapPaystackGatewayStatus("mystery")).toBe("unknown");
  });
});

test.describe("donate page", () => {
  test("renders dual payment method choice", async ({ page }) => {
    await page.goto("/get-involved/donate", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: /Donate and support a girl/i }),
    ).toBeVisible();
    await expect(page.getByText(/Support GGI/i).first()).toBeVisible();
    await expect(page.getByText(/Pay with Paystack/i).first()).toBeVisible();
    await expect(page.getByText(/Direct payment/i).first()).toBeVisible();
  });

  test("opens direct payment when method=direct", async ({ page }) => {
    await page.goto("/get-involved/donate?method=direct", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("heading", { name: /Direct payment details/i }),
    ).toBeVisible();
  });
});

test.describe("donation outcome pages", () => {
  test("failed page offers retry and MoMo fallback", async ({ page }) => {
    await page.goto("/get-involved/donate/failed?reference=ggi_test_fail", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("heading", { name: /Payment not completed/i }),
    ).toBeVisible();
    await expect(page.getByText(/ggi_test_fail/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Try Paystack again/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Pay with MoMo/i })).toBeVisible();
  });
});
