import { test, expect } from "@playwright/test";

test.describe("content public pages", () => {
  test("our story shows vision mission and values", async ({ page }) => {
    await page.goto("/our-story");
    await expect(
      page.getByRole("heading", {
        name: /It started with a conversation/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The challenges girls named" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Vision" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Empowerment" })).toBeVisible();
  });

  test("programmes page lists initiatives", async ({ page }) => {
    await page.goto("/programmes");
    await expect(
      page.getByRole("heading", {
        name: /Programmes, initiatives and projects/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Educational Support Initiative/i }),
    ).toBeVisible();
  });

  test("impact page lists achievements without invented counts", async ({
    page,
  }) => {
    await page.goto("/impact");
    await expect(
      page.getByRole("heading", { name: /What we have begun/i }),
    ).toBeVisible();
    await expect(page.getByText(/Schools Reached/i)).toBeVisible();
    await expect(page.getByText(/figures pending/i).first()).toBeVisible();
  });

  test("advocate page is no longer a stub", async ({ page }) => {
    await page.goto("/get-involved/advocate");
    await expect(
      page.getByRole("heading", { name: /Stand with girls/i }),
    ).toBeVisible();
  });

  test("gallery page renders", async ({ page }) => {
    await page.goto("/gallery");
    await expect(
      page.getByRole("heading", { name: /Moments from the work/i }),
    ).toBeVisible();
  });

  test("news page renders", async ({ page }) => {
    await page.goto("/news");
    await expect(
      page.getByRole("heading", { name: /Updates from Girls Global Initiative/i }),
    ).toBeVisible();
  });

  test("events page renders", async ({ page }) => {
    await page.goto("/events");
    await expect(
      page.getByRole("heading", { name: /Gatherings, outreach and invitations/i }),
    ).toBeVisible();
  });
});
