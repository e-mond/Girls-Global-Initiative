"use client";

import { useCallback } from "react";
import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminNewsPage() {
  const onlyNewsAndNewsletters = useCallback(
    (item: { [key: string]: unknown }) =>
      String(item.kind ?? "news") !== "report",
    [],
  );

  return (
    <ContentEntityManager
      entity="news_posts"
      title="News & newsletter"
      description="Publish news stories and commemorative newsletter notes. Use Draft, Scheduled, Published or Archived — not event cancellation states. Scheduled items stay hidden until their published-at time."
      filterItems={onlyNewsAndNewsletters}
      statusActions={[
        { status: "draft", label: "Draft" },
        { status: "scheduled", label: "Schedule" },
        { status: "published", label: "Publish" },
        { status: "archived", label: "Archive" },
      ]}
      fields={[
        {
          name: "title",
          label: "Title",
          required: true,
          placeholder: "e.g. School tour reaches girls in Enchi",
          description: "Public headline shown on cards and the detail page.",
        },
        {
          name: "slug",
          label: "Slug",
          required: true,
          placeholder: "school-tour-enchi",
          description: "URL path segment — lowercase words separated by hyphens.",
        },
        {
          name: "kind",
          label: "Kind",
          type: "select",
          required: true,
          description: "News appears in Updates; Newsletter is labelled separately.",
          options: [
            { value: "news", label: "News" },
            { value: "newsletter", label: "Newsletter" },
          ],
        },
        {
          name: "summary",
          label: "Summary",
          type: "textarea",
          required: true,
          placeholder: "One or two sentences for cards and previews.",
          description: "Short teaser — keep under ~200 characters when possible.",
        },
        {
          name: "body",
          label: "Body",
          type: "textarea",
          markdown: true,
          placeholder:
            "## What happened\n\nWrite the full update. Use **bold**, *italics*, lists and links.",
          description:
            "Supports Markdown headings, bold, italics, lists and links. Public pages use GGI brand fonts.",
        },
        {
          name: "imageUrl",
          label: "Image",
          type: "image",
          description: "Optional cover image (JPEG, PNG, WebP or GIF, max 5MB).",
        },
        {
          name: "publishedOn",
          label: "Display date (text)",
          placeholder: "1 November 2026",
          description: "Human-readable date shown publicly. Leave blank if unused.",
        },
        {
          name: "publishedAt",
          label: "Go-live datetime (ISO, for Scheduled status)",
          placeholder: "2026-11-15T09:00:00.000Z",
          description:
            "Required for Scheduled items. Visitors only see the post after this time.",
        },
        {
          name: "sortOrder",
          label: "Sort order",
          type: "number",
          placeholder: "0",
          description: "Lower numbers appear first in lists.",
        },
      ]}
      createDefaults={{ kind: "news", summary: "", body: "", sortOrder: 0 }}
    />
  );
}
