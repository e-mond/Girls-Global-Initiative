import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminEventsPage() {
  return (
    <ContentEntityManager
      entity="events"
      title="Events"
      description="Publish events for the public Events page. Use programme status for cancelled or postponed gatherings — never invent dates. Upcoming vs past is derived from the confirmed date in Africa/Accra unless cancelled or postponed."
      statusActions={[
        { status: "draft", label: "Unpublish" },
        { status: "scheduled", label: "Schedule" },
        { status: "published", label: "Publish" },
        { status: "archived", label: "Archive" },
      ]}
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
        {
          name: "programmeStatus",
          label: "Programme status",
          type: "select",
          options: [
            { value: "scheduled", label: "Scheduled (upcoming/past by date)" },
            { value: "postponed", label: "Postponed" },
            { value: "cancelled", label: "Cancelled" },
          ],
        },
        {
          name: "revisedStartsOn",
          label: "Revised date (when postponed)",
        },
        {
          name: "statusNote",
          label: "Public status note (cancellation / postponement explanation)",
          type: "textarea",
        },
        {
          name: "timezone",
          label: "Timezone (IANA, default Africa/Accra)",
        },
        { name: "imageUrl", label: "Image", type: "image" },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{
        summary: "",
        body: "",
        hostLabel: "Girls Global Initiative",
        programmeStatus: "scheduled",
        timezone: "Africa/Accra",
        sortOrder: 0,
      }}
    />
  );
}
