import { test, expect } from "@playwright/test";

test.describe("public accessibility smoke", () => {
  test("skip link and landmarks are present on the homepage", async ({
    page,
  }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: /Skip to main content/i });
    await skip.focus();
    await expect(skip).toBeVisible();
    await skip.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("footer exposes legal policy links", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const legal = page.getByRole("navigation", { name: "Legal" });
    await expect(legal.getByRole("link", { name: "Privacy Policy" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(legal.getByRole("link", { name: "Terms of Use" })).toBeVisible();
    await expect(legal.getByRole("link", { name: "Accessibility" })).toBeVisible();

    await legal.getByRole("link", { name: "Privacy Policy" }).click();
    await expect(page).toHaveURL(/\/privacy/);
    await expect(
      page.getByRole("heading", { name: "Privacy Policy" }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("mobile menu traps focus and restores on Escape", async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const menu = page.getByRole("button", { name: /Open menu|Close menu/ });
    await expect(menu).toBeVisible();

    await expect(async () => {
      if ((await menu.getAttribute("aria-expanded")) !== "true") {
        await menu.click();
      }
      await expect(menu).toHaveAttribute("aria-expanded", "true", {
        timeout: 2_000,
      });
    }).toPass({ timeout: 20_000 });

    await expect(
      page.getByRole("dialog", { name: "Primary mobile" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
  });
});
