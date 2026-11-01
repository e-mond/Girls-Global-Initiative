import { expect, test } from "@playwright/test";
import { listPublishedContent } from "@/features/content/content-service";

test.describe("listPublishedContent limits", () => {
  test("returns at most the requested limit of published rows", async () => {
    const limited = await listPublishedContent("testimonials", { limit: 1 });
    expect(limited.length).toBeLessThanOrEqual(1);
    expect(limited.every((item) => item.status === "published")).toBe(true);
  });

  test("omitting limit still returns only published rows", async () => {
    const all = await listPublishedContent("testimonials");
    expect(all.every((item) => item.status === "published")).toBe(true);
  });
});
