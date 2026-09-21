import { test, expect } from "@playwright/test";

test.describe("public navigation IA", () => {
  test("primary nav exposes compact links and About dropdown", async ({
    page,
  }) => {
    await page.goto("/");
    const primary = page.getByRole("navigation", { name: "Primary", exact: true });

    await expect(primary.getByRole("link", { name: "Our story" })).toBeVisible();
    await expect(primary.getByRole("link", { name: "What we do" })).toBeVisible();
    await expect(primary.getByRole("link", { name: "Get involved" })).toBeVisible();
    await expect(primary.getByRole("link", { name: "Contact" })).toBeVisible();

    // Secondary destinations stay out of the top-level primary strip.
    await expect(primary.getByRole("link", { name: "Programmes" })).toHaveCount(0);
    await expect(primary.getByRole("link", { name: "Impact" })).toHaveCount(0);

    await primary.getByRole("button", { name: "About" }).click();
    const aboutMenu = page.getByRole("menu", { name: "About" });
    await expect(aboutMenu.getByRole("menuitem", { name: "Founder" })).toBeVisible();
    await expect(aboutMenu.getByRole("menuitem", { name: "Team" })).toBeVisible();
    await expect(
      aboutMenu.getByRole("menuitem", { name: "Communities" }),
    ).toBeVisible();
    await expect(aboutMenu.getByRole("menuitem", { name: "Gallery" })).toBeVisible();
  });

  test("header stays sticky while scrolling", async ({ page }) => {
    await page.goto("/our-story");
    const header = page.getByRole("banner");
    await expect(header).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(header).toBeVisible();
    const position = await header.evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("sticky");
  });

  test("footer still exposes programmes, impact, news and gallery", async ({
    page,
  }) => {
    await page.goto("/");
    const explore = page.getByRole("navigation", { name: "Explore" });
    await expect(explore.getByRole("link", { name: "Programmes" })).toBeVisible();
    await expect(explore.getByRole("link", { name: "Impact" })).toBeVisible();
    await expect(explore.getByRole("link", { name: "News" })).toBeVisible();
    await expect(explore.getByRole("link", { name: "Gallery" })).toBeVisible();
  });
});
