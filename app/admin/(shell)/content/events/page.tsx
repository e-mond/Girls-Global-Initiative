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
        { name: "startsOn", label: "Date (stands out on the public page)" },
        { name: "endsOn", label: "Time / schedule (stands out on the public page)" },
        {
          name: "hostLabel",
          label: "Host (defaults to Girls Global Initiative if blank)",
        },
        { name: "imageUrl", label: "Image", type: "image" },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{
        summary: "",
        body: "",
        hostLabel: "Girls Global Initiative",
        sortOrder: 0,
      }}
    />
  );
}
