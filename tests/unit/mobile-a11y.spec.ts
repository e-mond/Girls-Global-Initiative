import { test, expect } from "@playwright/test";

test.describe("mobile accessibility smoke", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ viewport: { width: 390, height: 844 } });

  test("homepage primary actions stay usable on a phone viewport", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const menu = page.getByRole("button", { name: "Open menu" });
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Primary mobile" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Support" }).first(),
    ).toBeVisible();
  });

  test("key public pages render without horizontal overflow", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    for (const path of ["/", "/our-story", "/contact", "/get-involved"]) {
      await page.goto(path, { waitUntil: "load" });
      await expect(page.locator("#main-content")).toBeVisible();
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth + 2;
      });
      expect(overflow, `${path} should not overflow horizontally`).toBe(false);
    }
  });
});
