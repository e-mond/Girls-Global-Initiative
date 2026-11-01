/**
 * Public CMS-backed content with identifiable mock fallbacks.
 * Fallback copy is clearly placeholder until staff publish real items.
 */

import {
  getPublishedEventBySlug,
  getPublishedFounder,
  getPublishedNewsBySlug,
  listArchivedContent,
  listPublishedContent,
} from "@/features/content/content-service";
import { getMedia } from "@/features/content/media-service";
import {
  challengeTags as mockChallengeTags,
  communityStories,
  founderSpotlight as mockFounder,
  pillars as mockPillars,
  teamMembers as mockTeamMembers,
  type Pillar,
  type PillarSlug,
} from "@/features/content/mock-home";
import { ADVOCATE_COPY } from "@/content/site-copy";
import {
  resolveEventDisplayStatus,
  type EventDisplayStatus,
  type ProgrammeStatus,
  normalizeProgrammeStatus,
} from "@/lib/events/programme-status";
import { normalizePublicImageSrc } from "@/lib/media/public-image-src";

export type PublicGalleryItem = {
  id: string;
  title: string;
  caption: string;
  location: string | null;
  badge: string | null;
  imageSrc: string;
  isPlaceholder: boolean;
};

export type PublicNewsItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  imageSrc: string | null;
  publishedOn: string | null;
  kind: "news" | "newsletter" | "report";
  /** Never expose original source PDFs on public surfaces. */
  attachmentUrl: null;
  contentStatus: "published" | "scheduled" | "archived" | "draft";
  isPlaceholder: boolean;
};

export type PublicEventItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  location: string | null;
  startsOn: string | null;
  endsOn: string | null;
  imageSrc: string | null;
  hostLabel: string | null;
  programmeStatus: ProgrammeStatus;
  timezone: string;
  revisedStartsOn: string | null;
  statusNote: string | null;
  displayStatus: EventDisplayStatus;
  isPlaceholder: boolean;
};

export type PublicTeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  isFounder: boolean;
  photoPending: boolean;
  isPlaceholder: boolean;
};

export type PublicFounderSpotlight = {
  id: string;
  name: string;
  role: string;
  badge: string;
  quote: string;
  body: string;
  imageSrc: string;
  callouts: Array<{ title: string; body: string; icon: string }>;
  isPlaceholder: boolean;
};

export type PublicChallengeTag = {
  id: string;
  label: string;
  icon: string;
  isPlaceholder: boolean;
};

export type PublicTestimonial = {
  id: string;
  quote: string;
  attribution: string;
  roleLabel: string | null;
  isPlaceholder: boolean;
};

export type PublicAdvocacyItem = {
  id: string;
  title: string;
  body: string;
  isPlaceholder: boolean;
};

const NEWS_PLACEHOLDERS: PublicNewsItem[] = [
  {
    id: "placeholder-news-1",
    title: "School outreach conversations continue",
    slug: "school-outreach-conversations",
    summary:
      "GGI continues school tours and safe conversations with girls about rights, health and confidence. Full updates will appear here when published from the CMS.",
    body: "",
    imageSrc: "/home/community-1.jpg?v=20261026",
    publishedOn: null,
    kind: "news",
    attachmentUrl: null,
    contentStatus: "published",
    isPlaceholder: true,
  },
  {
    id: "placeholder-news-2",
    title: "Community hygiene support moments",
    slug: "community-hygiene-support",
    summary:
      "Hygiene education and practical support remain part of GGI's community work. Full updates will appear here when published.",
    body: "",
    imageSrc: "/home/community-2.jpg?v=20261026",
    publishedOn: null,
    kind: "news",
    attachmentUrl: null,
    contentStatus: "published",
    isPlaceholder: true,
  },
];

const EVENT_PLACEHOLDERS: PublicEventItem[] = [
  {
    id: "placeholder-event-1",
    title: "Invite GGI to your school or community",
    slug: "invite-ggi",
    summary:
      "Partner requests and community invitations are welcome. Published events from the CMS will list here with dates and locations when available.",
    body: "",
    location: null,
    startsOn: null,
    endsOn: null,
    imageSrc: "/home/community-3.jpg?v=20261026",
    hostLabel: "Girls Global Initiative",
    programmeStatus: "scheduled",
    timezone: "Africa/Accra",
    revisedStartsOn: null,
    statusNote: null,
    displayStatus: "upcoming",
    isPlaceholder: true,
  },
  {
    id: "placeholder-event-2",
    title: "School tours and girls' empowerment conversations",
    slug: "school-tours-outreach",
    summary:
      "GGI conducts educational school tours to engage young girls, promote the organisation's mission and provide resources that support wellbeing and development. Confirmed dates will appear here when published.",
    body: "",
    location: null,
    startsOn: null,
    endsOn: null,
    imageSrc: "/home/community-1.jpg?v=20261026",
    hostLabel: "Girls Global Initiative",
    programmeStatus: "scheduled",
    timezone: "Africa/Accra",
    revisedStartsOn: null,
    statusNote: null,
    displayStatus: "upcoming",
    isPlaceholder: true,
  },
];

const PILLAR_TONES = new Set(["navy", "magenta", "sky", "cream"]);

function asTone(colour: unknown): Pillar["tone"] {
  const value = String(colour ?? "navy");
  return PILLAR_TONES.has(value) ? (value as Pillar["tone"]) : "navy";
}

function mockImageForName(name: string): string | null {
  const needle = name.trim().toLowerCase();
  const match = mockTeamMembers.find(
    (member) => member.name.toLowerCase() === needle,
  );
  return match?.imageSrc ?? null;
}

async function resolvePhotoUrl(
  photoMediaId: unknown,
  name: string,
): Promise<{ url: string; pending: boolean }> {
  if (typeof photoMediaId === "string" && photoMediaId.trim()) {
    const media = await getMedia(photoMediaId.trim());
    if (media?.url) {
      return { url: media.url, pending: false };
    }
  }
  const byName = mockImageForName(name);
  if (byName) return { url: byName, pending: false };
  return { url: "/home/community-1.jpg", pending: true };
}

export async function getPublicGalleryItems(): Promise<PublicGalleryItem[]> {
  const published = await listPublishedContent("gallery_items");
  if (published.length === 0) {
    return communityStories.map((story) => ({
      id: story.id,
      title: story.title,
      caption: story.caption,
      location: null,
      badge: story.badge,
      imageSrc: story.imageSrc,
      isPlaceholder: true,
    }));
  }

  return published.map((item, index) => {
    const fallback = communityStories[index % communityStories.length];
    const imageUrl =
      normalizePublicImageSrc(
        typeof item.imageUrl === "string" ? item.imageUrl : null,
      ) ?? normalizePublicImageSrc(fallback.imageSrc)!;
    return {
      id: item.id,
      title: String(item.title ?? "Gallery moment"),
      caption: String(item.caption ?? ""),
      location:
        typeof item.location === "string" && item.location.trim()
          ? item.location
          : null,
      badge:
        typeof item.badge === "string" && item.badge.trim()
          ? item.badge
          : null,
      imageSrc: imageUrl,
      isPlaceholder: false,
    };
  });
}

function mapNewsItem(item: Awaited<
  ReturnType<typeof listPublishedContent>
>[number]): PublicNewsItem {
  const kindRaw = String(item.kind ?? "news").toLowerCase();
  const kind =
    kindRaw === "report"
      ? "report"
      : kindRaw === "newsletter"
        ? "newsletter"
        : "news";
  return {
    id: item.id,
    title: String(
      item.title ??
        (kind === "report"
          ? "Report"
          : kind === "newsletter"
            ? "Newsletter"
            : "News"),
    ),
    slug: String(item.slug ?? item.id),
    summary: String(item.summary ?? ""),
    body: String(item.body ?? ""),
    imageSrc: normalizePublicImageSrc(
      typeof item.imageUrl === "string" ? item.imageUrl : null,
    ),
    publishedOn:
      typeof item.publishedOn === "string" && item.publishedOn.trim()
        ? item.publishedOn
        : null,
    kind,
    attachmentUrl: null,
    contentStatus:
      item.status === "archived" ||
      item.status === "scheduled" ||
      item.status === "published" ||
      item.status === "draft"
        ? item.status
        : "published",
    isPlaceholder: false,
  };
}

function mapEventItem(item: Awaited<
  ReturnType<typeof listPublishedContent>
>[number]): PublicEventItem {
  const startsOn =
    typeof item.startsOn === "string" && item.startsOn.trim()
      ? item.startsOn
      : null;
  const revisedStartsOn =
    typeof item.revisedStartsOn === "string" && item.revisedStartsOn.trim()
      ? item.revisedStartsOn.trim()
      : null;
  const timezone =
    typeof item.timezone === "string" && item.timezone.trim()
      ? item.timezone.trim()
      : "Africa/Accra";
  const programmeStatus = normalizeProgrammeStatus(item.programmeStatus);
  return {
    id: item.id,
    title: String(item.title ?? "Event"),
    slug: String(item.slug ?? item.id),
    summary: String(item.summary ?? ""),
    body: String(item.body ?? ""),
    location:
      typeof item.location === "string" && item.location.trim()
        ? item.location
        : null,
    startsOn,
    endsOn:
      typeof item.endsOn === "string" && item.endsOn.trim()
        ? item.endsOn
        : null,
    imageSrc: normalizePublicImageSrc(
      typeof item.imageUrl === "string" ? item.imageUrl : null,
    ),
    hostLabel:
      typeof item.hostLabel === "string" && item.hostLabel.trim()
        ? item.hostLabel.trim()
        : null,
    programmeStatus,
    timezone,
    revisedStartsOn,
    statusNote:
      typeof item.statusNote === "string" && item.statusNote.trim()
        ? item.statusNote.trim()
        : null,
    displayStatus: resolveEventDisplayStatus({
      programmeStatus,
      startsOn,
      revisedStartsOn,
      timezone,
    }),
    isPlaceholder: false,
  };
}

export async function getPublicNews(limit?: number): Promise<PublicNewsItem[]> {
  const published = await listPublishedContent("news_posts");
  const newsOnly = published
    .map(mapNewsItem)
    .filter(
      (item) => item.kind === "news" && item.contentStatus !== "archived",
    );
  if (newsOnly.length === 0) {
    return limit ? NEWS_PLACEHOLDERS.slice(0, limit) : NEWS_PLACEHOLDERS;
  }
  return limit ? newsOnly.slice(0, limit) : newsOnly;
}

/** Published commemorative / campaign newsletter posts. */
export async function getPublicNewsletters(
  limit?: number,
): Promise<PublicNewsItem[]> {
  const published = await listPublishedContent("news_posts");
  const newsletters = published
    .map(mapNewsItem)
    .filter(
      (item) =>
        item.kind === "newsletter" && item.contentStatus !== "archived",
    );
  return limit ? newsletters.slice(0, limit) : newsletters;
}

/** Archived news (and newsletter) posts for the public archive section. */
export async function getArchivedNews(
  limit?: number,
): Promise<PublicNewsItem[]> {
  const archived = await listArchivedContent("news_posts");
  const items = archived
    .map(mapNewsItem)
    .filter((item) => item.kind === "news" || item.kind === "newsletter");
  return limit ? items.slice(0, limit) : items;
}

/** News + newsletter posts for static params and shared listings. */
export async function getPublicNewsFeed(
  limit?: number,
): Promise<PublicNewsItem[]> {
  const published = await listPublishedContent("news_posts");
  const feed = published
    .map(mapNewsItem)
    .filter(
      (item) =>
        (item.kind === "news" || item.kind === "newsletter") &&
        item.contentStatus !== "archived",
    );
  if (feed.length === 0) {
    return limit ? NEWS_PLACEHOLDERS.slice(0, limit) : NEWS_PLACEHOLDERS;
  }
  return limit ? feed.slice(0, limit) : feed;
}

/** Published programme/activity reports. */
export async function getPublicReports(
  limit?: number,
): Promise<PublicNewsItem[]> {
  const published = await listPublishedContent("news_posts");
  const reports = published
    .map(mapNewsItem)
    .filter((item) => item.kind === "report");
  return limit ? reports.slice(0, limit) : reports;
}

/** Single published news or report by slug. */
export async function getPublicNewsBySlug(
  slug: string,
): Promise<PublicNewsItem | null> {
  const item = await getPublishedNewsBySlug(slug);
  if (!item) return null;
  return mapNewsItem(item);
}

export async function getPublicReportBySlug(
  slug: string,
): Promise<PublicNewsItem | null> {
  const item = await getPublicNewsBySlug(slug);
  if (!item || item.kind !== "report") return null;
  return item;
}

export async function getPublicEvents(
  limit?: number,
): Promise<PublicEventItem[]> {
  const published = await listPublishedContent("events", { limit });
  if (published.length === 0) {
    return limit ? EVENT_PLACEHOLDERS.slice(0, limit) : EVENT_PLACEHOLDERS;
  }
  return published.map(mapEventItem);
}

export async function getPublicEventBySlug(
  slug: string,
): Promise<PublicEventItem | null> {
  const item = await getPublishedEventBySlug(slug);
  if (!item) return null;
  return mapEventItem(item);
}

export async function getPublicTeamMembers(): Promise<PublicTeamMember[]> {
  const published = await listPublishedContent("team_members");
  if (published.length === 0) {
    return mockTeamMembers.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: "",
      imageSrc: member.imageSrc,
      isFounder: member.isFounder,
      photoPending: member.photoPending,
      isPlaceholder: true,
    }));
  }

  return Promise.all(
    published.map(async (item) => {
      const name = String(item.name ?? "Team member");
      const photo = await resolvePhotoUrl(item.photoMediaId, name);
      return {
        id: item.id,
        name,
        role: String(item.roleTitle ?? ""),
        bio: String(item.bio ?? ""),
        imageSrc: photo.url,
        isFounder: Boolean(item.isFounder),
        photoPending: photo.pending,
        isPlaceholder: false,
      };
    }),
  );
}

export async function getPublicFounderSpotlight(): Promise<PublicFounderSpotlight> {
  const founder = await getPublishedFounder();

  if (!founder) {
    return {
      id: "mock-founder",
      name: mockFounder.name,
      role: mockFounder.role,
      badge: mockFounder.badge,
      quote: mockFounder.quote,
      body: mockFounder.body,
      imageSrc: mockFounder.imageSrc,
      callouts: mockFounder.callouts.map((item) => ({ ...item })),
      isPlaceholder: true,
    };
  }

  const name = String(founder.name ?? mockFounder.name);
  const photo = await resolvePhotoUrl(founder.photoMediaId, name);
  const callouts = [
    {
      title: String(founder.callout1Title ?? "").trim(),
      body: String(founder.callout1Body ?? "").trim(),
      icon: "megaphone",
    },
    {
      title: String(founder.callout2Title ?? "").trim(),
      body: String(founder.callout2Body ?? "").trim(),
      icon: "graduation",
    },
    {
      title: String(founder.callout3Title ?? "").trim(),
      body: String(founder.callout3Body ?? "").trim(),
      icon: "users",
    },
  ].filter((item) => item.title || item.body);

  return {
    id: founder.id,
    name,
    role: String(founder.roleTitle ?? mockFounder.role),
    badge: "Leadership with lived understanding",
    quote: String(founder.quote ?? "").trim() || mockFounder.quote,
    body: String(founder.bio ?? "").trim() || mockFounder.body,
    imageSrc: photo.url,
    callouts: callouts.length
      ? callouts
      : mockFounder.callouts.map((item) => ({ ...item })),
    isPlaceholder: false,
  };
}

export async function getPublicPillars(): Promise<Pillar[]> {
  const published = await listPublishedContent("pillars");
  if (published.length === 0) {
    return mockPillars;
  }

  return published.map((item) => {
    const slug = String(item.slug ?? "rights-dignity") as PillarSlug;
    const title = String(item.title ?? "Pillar");
    return {
      slug,
      title,
      shortTitle: title,
      description: String(item.description ?? ""),
      detail: String(item.detail ?? ""),
      tone: asTone(item.colour),
    };
  });
}

export async function getPublicPillar(
  slug: string,
): Promise<Pillar | undefined> {
  const pillars = await getPublicPillars();
  return pillars.find((pillar) => pillar.slug === slug);
}

export async function getPublicChallengeTags(): Promise<PublicChallengeTag[]> {
  const published = await listPublishedContent("challenge_tags");
  if (published.length === 0) {
    return mockChallengeTags.map((tag, index) => ({
      id: `mock-tag-${index}`,
      label: tag.label,
      icon: tag.icon,
      isPlaceholder: true,
    }));
  }

  return published.map((item) => ({
    id: item.id,
    label: String(item.label ?? "Tag"),
    icon: String(item.icon ?? "tag"),
    isPlaceholder: false,
  }));
}

export async function getPublicTestimonials(
  limit?: number,
): Promise<PublicTestimonial[]> {
  const published = await listPublishedContent("testimonials", { limit });
  if (published.length === 0) {
    return [];
  }
  return published.map((item) => ({
    id: item.id,
    quote: String(item.quote ?? ""),
    attribution: String(item.attribution ?? ""),
    roleLabel:
      typeof item.roleLabel === "string" && item.roleLabel.trim()
        ? item.roleLabel
        : null,
    isPlaceholder: false,
  }));
}

export async function getPublicAdvocacyItems(): Promise<PublicAdvocacyItem[]> {
  const published = await listPublishedContent("advocacy_content");
  if (published.length === 0) {
    return ADVOCATE_COPY.actions.map((action, index) => ({
      id: `mock-advocacy-${index}`,
      title: action.title,
      body: action.body,
      isPlaceholder: true,
    }));
  }

  return published.map((item) => ({
    id: item.id,
    title: String(item.title ?? "Advocacy"),
    body: String(item.body ?? ""),
    isPlaceholder: false,
  }));
}
