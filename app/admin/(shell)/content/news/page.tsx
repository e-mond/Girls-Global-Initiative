import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminNewsPage() {
  return (
    <ContentEntityManager
      entity="news_posts"
      title="News"
      description="Publish news stories for the public News page and homepage news section."
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug", required: true },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "body", label: "Body", type: "textarea" },
        { name: "imageUrl", label: "Image URL" },
        { name: "publishedOn", label: "Display date (text)" },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{ summary: "", body: "", sortOrder: 0 }}
    />
  );
}
