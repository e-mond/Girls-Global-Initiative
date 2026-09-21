import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminEventsPage() {
  return (
    <ContentEntityManager
      entity="events"
      title="Events"
      description="Publish events for the public Events page and homepage events section. Do not invent dates."
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug", required: true },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "body", label: "Body", type: "textarea" },
        { name: "location", label: "Location" },
        { name: "startsOn", label: "Starts on (text)" },
        { name: "endsOn", label: "Ends on (text)" },
        { name: "imageUrl", label: "Image URL" },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{ summary: "", body: "", sortOrder: 0 }}
    />
  );
}
