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
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug", required: true },
        {
          name: "kind",
          label: "Kind",
          type: "select",
          required: true,
          options: [
            { value: "news", label: "News" },
            { value: "newsletter", label: "Newsletter" },
          ],
        },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "body", label: "Body", type: "textarea" },
        { name: "imageUrl", label: "Image", type: "image" },
        { name: "publishedOn", label: "Display date (text)" },
        {
          name: "publishedAt",
          label: "Go-live datetime (ISO, for Scheduled status)",
        },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{ kind: "news", summary: "", body: "", sortOrder: 0 }}
    />
  );
}
