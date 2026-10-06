import type { MetadataRoute } from "next";
import { pillars } from "@/features/content/mock-home";
import { getSiteOrigin } from "@/lib/seo/site-origin";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "/" ? origin : `${origin}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const pillarEntries: MetadataRoute.Sitemap = pillars.map((pillar) => ({
    url: `${origin}/what-we-do/${pillar.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...pillarEntries];
}
