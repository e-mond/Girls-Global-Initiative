import { expect, test } from "@playwright/test";
import { normalizePublicImageSrc } from "../../lib/media/public-image-src";

test.describe("normalizePublicImageSrc", () => {
  test("strips query and hash from local paths", () => {
    expect(
      normalizePublicImageSrc("/events/know-your-body-enchi.jpg?v=20261101p"),
    ).toBe("/events/know-your-body-enchi.jpg");
    expect(normalizePublicImageSrc("/news/x.jpg#frag")).toBe("/news/x.jpg");
  });

  test("keeps absolute remote URLs including query", () => {
    expect(
      normalizePublicImageSrc("https://cdn.example.com/a.jpg?v=1"),
    ).toBe("https://cdn.example.com/a.jpg?v=1");
  });

  test("returns null for empty values", () => {
    expect(normalizePublicImageSrc(null)).toBeNull();
    expect(normalizePublicImageSrc("   ")).toBeNull();
  });
});
