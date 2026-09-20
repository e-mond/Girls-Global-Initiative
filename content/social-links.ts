/**
 * Canonical public social profiles from content-reference.md.
 * Footer and Contact must import this module — do not duplicate URLs.
 */
export type SocialPlatformId =
  | "instagram"
  | "tiktok"
  | "facebook"
  | "linkedin";

export type SocialLink = {
  id: SocialPlatformId;
  label: string;
  href: string;
  accessibleName: string;
};

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/girlsglobalinitiative1",
    accessibleName: "Girls Global Initiative on Instagram",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@girlsglobalinitiative1",
    accessibleName: "Girls Global Initiative on TikTok",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61594608297599",
    accessibleName: "Girls Global Initiative on Facebook",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/girls-global-initiative-b7a860438/",
    accessibleName: "Girls Global Initiative on LinkedIn",
  },
] as const;

export const SOCIAL_HREFS = {
  facebook: SOCIAL_LINKS.find((link) => link.id === "facebook")!.href,
  instagram: SOCIAL_LINKS.find((link) => link.id === "instagram")!.href,
  tiktok: SOCIAL_LINKS.find((link) => link.id === "tiktok")!.href,
  linkedin: SOCIAL_LINKS.find((link) => link.id === "linkedin")!.href,
} as const;
