"use client";

import { useCallback } from "react";
import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminNewsPage() {
  const onlyNews = useCallback(
    (item: { [key: string]: unknown }) =>
      String(item.kind ?? "news") !== "report",
    [],
  );

  return (
    <ContentEntityManager
      entity="news_posts"
      title="News"
      description="Publish news stories for the public News page and homepage news section. Programme reports live under Content → Reports."
      filterItems={onlyNews}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug", required: true },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "body", label: "Body", type: "textarea" },
        { name: "imageUrl", label: "Image", type: "image" },
        { name: "publishedOn", label: "Display date (text)" },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{ kind: "news", summary: "", body: "", sortOrder: 0 }}
    />
  );
}
