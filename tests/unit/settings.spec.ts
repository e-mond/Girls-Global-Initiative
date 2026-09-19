import { test, expect } from "@playwright/test";
import { siteSettingsSchema } from "../../features/settings/schemas";

test.describe("site settings schema", () => {
  test("accepts empty optional social fields", () => {
    expect(siteSettingsSchema.safeParse({}).success).toBe(true);
  });
});
