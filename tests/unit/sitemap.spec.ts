import { test, expect } from "@playwright/test";
import { getSiteOrigin } from "../../lib/seo/site-origin";

test.describe("site origin helper", () => {
  test("prefers NEXT_PUBLIC_SITE_URL over AUTH_URL", () => {
    const env = process.env as Record<string, string | undefined>;
    const previousPublic = env.NEXT_PUBLIC_SITE_URL;
    const previousAuth = env.AUTH_URL;
    const previousNodeEnv = env.NODE_ENV;
    env.NEXT_PUBLIC_SITE_URL = "https://example.org/";
    env.AUTH_URL = "https://auth.example.org";
    env.NODE_ENV = "test";
    expect(getSiteOrigin()).toBe("https://example.org");
    env.NEXT_PUBLIC_SITE_URL = previousPublic;
    env.AUTH_URL = previousAuth;
    env.NODE_ENV = previousNodeEnv;
  });

  test("production builds do not publish localhost origins", () => {
    const env = process.env as Record<string, string | undefined>;
    const previousPublic = env.NEXT_PUBLIC_SITE_URL;
    const previousAuth = env.AUTH_URL;
    const previousNodeEnv = env.NODE_ENV;
    env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    env.AUTH_URL = "http://localhost:3000";
    env.NODE_ENV = "production";
    expect(getSiteOrigin()).toBe("https://girlsglobalinitiative.org");
    env.NEXT_PUBLIC_SITE_URL = previousPublic;
    env.AUTH_URL = previousAuth;
    env.NODE_ENV = previousNodeEnv;
  });
});

test.describe("sitemap route", () => {
  test("returns XML covering public marketing and policy URLs", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"] ?? "").toMatch(/xml/i);
    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("/privacy");
    expect(body).toContain("/terms");
    expect(body).toContain("/accessibility");
    expect(body).toContain("/what-we-do/rights-dignity");
    expect(body).toContain("2026-10-06");
  });
});
