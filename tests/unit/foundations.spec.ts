import { test, expect } from "@playwright/test";
import { cn } from "../../lib/utils";

test.describe("foundations utilities", () => {
  test("cn merges class names without duplicates conflicting", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-brand-navy", false && "hidden")).toBe("text-brand-navy");
  });
});

test.describe("public homepage shell", () => {
  test("renders reference hero and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Every girl/i }),
    ).toBeVisible();
    await expect(page.getByText("Youth-led")).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeVisible();
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Support a girl" }),
    ).toBeVisible();
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Contact us" }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", {
        name: "Communities",
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Advancing rights & dignity"),
    ).toBeVisible();
  });
});
