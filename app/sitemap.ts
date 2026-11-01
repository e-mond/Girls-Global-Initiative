import type { MetadataRoute } from "next";
import {
  getPublicEvents,
  getPublicNews,
  getPublicPillars,
} from "@/features/content/public-content";
import { getSiteOrigin } from "@/lib/seo/site-origin";

/**
 * Stable content revision date for sitemap lastmod (YYYY-MM-DD).
 * Update when public marketing URLs or key page content ship.
 */
const SITEMAP_LASTMOD = "2026-11-01";

const STATIC_PATHS = [
  "/",
  "/our-story",
  "/what-we-do",
  "/programmes",
  "/impact",
  "/gallery",
  "/news",
  "/events",
  "/founder",
  "/team",
  "/communities",
  "/get-involved",
  "/get-involved/donate",
  "/get-involved/volunteer",
  "/get-involved/advocate",
  "/partner",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
] as const;

function absoluteUrl(origin: string, path: string) {
  if (path === "/") return `${origin}/`;
  return `${origin}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();

  // Guard against accidentally publishing localhost URLs to crawlers.
  if (
    process.env.NODE_ENV === "production" &&
    /localhost|127\.0\.0\.1/i.test(origin)
  ) {
    console.error(
      "[sitemap] Refusing localhost origin in production. Set NEXT_PUBLIC_SITE_URL.",
    );
  }

  const lastModified = new Date(`${SITEMAP_LASTMOD}T00:00:00.000Z`);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(origin, path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/get-involved") ? 0.8 : 0.7,
  }));

  const [pillars, events, news] = await Promise.all([
    getPublicPillars(),
    getPublicEvents(),
    getPublicNews(),
  ]);
  const pillarEntries: MetadataRoute.Sitemap = pillars.map((pillar) => ({
    url: absoluteUrl(origin, `/what-we-do/${pillar.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const eventEntries: MetadataRoute.Sitemap = events
    .filter((item) => !item.isPlaceholder)
    .map((item) => ({
      url: absoluteUrl(origin, `/events/${item.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }));
  const newsEntries: MetadataRoute.Sitemap = news
    .filter((item) => !item.isPlaceholder)
    .map((item) => ({
      url: absoluteUrl(origin, `/news/${item.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }));

  return [...staticEntries, ...pillarEntries, ...eventEntries, ...newsEntries];
}
