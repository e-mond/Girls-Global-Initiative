import { test, expect } from "@playwright/test";
import { SOCIAL_LINKS } from "../../content/social-links";
import { siteSettingsSchema } from "../../features/settings/schemas";

test.describe("canonical social links", () => {
  test("exposes exactly four platforms with canonical hrefs", () => {
    expect(SOCIAL_LINKS).toHaveLength(4);
    expect(SOCIAL_LINKS.map((link) => link.id)).toEqual([
      "instagram",
      "tiktok",
      "facebook",
      "linkedin",
    ]);
    expect(SOCIAL_LINKS.map((link) => link.href)).toEqual([
      "https://www.instagram.com/girlsglobalinitiative1",
      "https://www.tiktok.com/@girlsglobalinitiative1",
      "https://www.facebook.com/profile.php?id=61594608297599",
      "https://www.linkedin.com/in/girls-global-initiative-b7a860438/",
    ]);
    for (const link of SOCIAL_LINKS) {
      expect(link.href).not.toMatch(/[?&](stkn|_r|_t|mibextid|utm_)/i);
      expect(link.href).not.toContain("girls.global.initiative");
    }
  });
});

test.describe("site settings schema", () => {
  test("accepts empty optional social fields", () => {
    expect(siteSettingsSchema.safeParse({}).success).toBe(true);
  });
});

test.describe("public social surfaces", () => {
  test("footer exposes four canonical social icons", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    for (const link of SOCIAL_LINKS) {
      await expect(
        footer.getByRole("link", { name: link.accessibleName }),
      ).toHaveAttribute("href", link.href);
    }
    await expect(footer.getByLabel("Social media").getByRole("link")).toHaveCount(
      4,
    );
  });

  test("contact page uses the same four social links", async ({ page }) => {
    await page.goto("/contact");
    await expect(
      page.getByRole("heading", { name: /Reach us directly/i }),
    ).toBeVisible();
    const main = page.locator("#main-content");
    for (const link of SOCIAL_LINKS) {
      await expect(
        main.getByRole("link", { name: link.accessibleName }),
      ).toHaveAttribute("href", link.href);
    }
    await expect(main.getByLabel("Social media").getByRole("link")).toHaveCount(
      4,
    );
  });
});
