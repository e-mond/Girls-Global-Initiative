/**
 * Public CMS-backed content with identifiable mock fallbacks.
 * Fallback copy is clearly placeholder until staff publish real items.
 */

import { listPublishedContent } from "@/features/content/content-service";
import { communityStories } from "@/features/content/mock-home";

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
    imageSrc: "/home/community-1.jpg",
    publishedOn: null,
    isPlaceholder: true,
  },
  {
    id: "placeholder-news-2",
    title: "Community hygiene support moments",
    slug: "community-hygiene-support",
    summary:
      "Hygiene education and practical support remain part of GGI's community work. Publish a news item from Admin to replace this placeholder.",
    body: "",
    imageSrc: "/home/community-2.jpg",
    publishedOn: null,
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
    imageSrc: "/home/community-3.jpg",
    isPlaceholder: true,
  },
  {
    id: "placeholder-event-2",
    title: "School tours and girls' empowerment conversations",
    slug: "school-tours-outreach",
    summary:
      "GGI conducts educational school tours to engage young girls, promote the organisation's mission and provide resources that support wellbeing and development. Publish a dated event from Admin to replace this placeholder.",
    body: "",
    location: null,
    startsOn: null,
    endsOn: null,
    imageSrc: "/home/community-1.jpg",
    isPlaceholder: true,
  },
];

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
      typeof item.imageUrl === "string" && item.imageUrl.trim()
        ? item.imageUrl.trim()
        : fallback.imageSrc;
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

export async function getPublicNews(limit?: number): Promise<PublicNewsItem[]> {
  const published = await listPublishedContent("news_posts");
  if (published.length === 0) {
    return limit ? NEWS_PLACEHOLDERS.slice(0, limit) : NEWS_PLACEHOLDERS;
  }
  const items = published.map((item) => ({
    id: item.id,
    title: String(item.title ?? "News"),
    slug: String(item.slug ?? item.id),
    summary: String(item.summary ?? ""),
    body: String(item.body ?? ""),
    imageSrc:
      typeof item.imageUrl === "string" && item.imageUrl.trim()
        ? item.imageUrl.trim()
        : null,
    publishedOn:
      typeof item.publishedOn === "string" && item.publishedOn.trim()
        ? item.publishedOn
        : null,
    isPlaceholder: false,
  }));
  return limit ? items.slice(0, limit) : items;
}

export async function getPublicEvents(
  limit?: number,
): Promise<PublicEventItem[]> {
  const published = await listPublishedContent("events");
  if (published.length === 0) {
    return limit ? EVENT_PLACEHOLDERS.slice(0, limit) : EVENT_PLACEHOLDERS;
  }
  const items = published.map((item) => ({
    id: item.id,
    title: String(item.title ?? "Event"),
    slug: String(item.slug ?? item.id),
    summary: String(item.summary ?? ""),
    body: String(item.body ?? ""),
    location:
      typeof item.location === "string" && item.location.trim()
        ? item.location
        : null,
    startsOn:
      typeof item.startsOn === "string" && item.startsOn.trim()
        ? item.startsOn
        : null,
    endsOn:
      typeof item.endsOn === "string" && item.endsOn.trim()
        ? item.endsOn
        : null,
    imageSrc:
      typeof item.imageUrl === "string" && item.imageUrl.trim()
        ? item.imageUrl.trim()
        : null,
    isPlaceholder: false,
  }));
  return limit ? items.slice(0, limit) : items;
}
