import type { Metadata } from "next";
import { getSiteOrigin } from "@/lib/seo/site-origin";

const DEFAULT_OG_IMAGE = "/brand/ggi-logo.png";

export type PageMetadataInput = {
  title: string;
  description: string;
  /** Path beginning with `/`, e.g. `/our-story`. Use `/` for home. */
  path: string;
  robots?: Metadata["robots"];
  ogImage?: string;
};

/**
 * Shared public-page metadata: canonical, Open Graph, Twitter card.
 */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const origin = getSiteOrigin();
  const path = input.path === "/" ? "/" : input.path.replace(/\/$/, "");
  const url = path === "/" ? origin : `${origin}${path}`;
  const imagePath = input.ogImage ?? DEFAULT_OG_IMAGE;
  const imageUrl = imagePath.startsWith("http")
    ? imagePath
    : `${origin}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      type: "website",
      locale: "en_GB",
      siteName: "Girls Global Initiative",
      images: [{ url: imageUrl, alt: "Girls Global Initiative" }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [imageUrl],
    },
    robots: input.robots,
  };
}

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};
