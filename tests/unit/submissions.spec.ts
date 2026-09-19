import { test, expect } from "@playwright/test";
import { volunteerSchema } from "../../features/submissions/schemas";

test.describe("submission schemas", () => {
  test("accepts a valid volunteer payload", () => {
    const parsed = volunteerSchema.safeParse({
      fullName: "Ama Mensah",
      email: "ama@example.com",
      interestArea: "Mentorship",
      skills: "Listening and facilitation",
      availability: "Weekends",
    });
    expect(parsed.success).toBe(true);
  });
});

test.describe("public submission pages", () => {
  test("volunteer form renders multi-step shell", async ({ page }) => {
    await page.goto("/get-involved/volunteer");
    await expect(
      page.getByRole("heading", { name: /Volunteer & mentor/i }),
    ).toBeVisible();
    await expect(page.getByText(/Step 1 of 3/i)).toBeVisible();
  });
});
