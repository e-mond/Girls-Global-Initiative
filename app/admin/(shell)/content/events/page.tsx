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
        {
          name: "title",
          label: "Title",
          required: true,
          placeholder: "e.g. Know Your Body — Enchi",
          description: "Event name shown on the public Events page.",
        },
        {
          name: "slug",
          label: "Slug",
          required: true,
          placeholder: "know-your-body-enchi",
          description: "URL path segment — lowercase words separated by hyphens.",
        },
        {
          name: "summary",
          label: "Summary",
          type: "textarea",
          required: true,
          placeholder: "Short description for the events list card.",
          description: "One short paragraph visitors see before opening the event.",
        },
        {
          name: "body",
          label: "Body",
          type: "textarea",
          markdown: true,
          placeholder:
            "## About this gathering\n\nAdd details, who it is for, and what to expect.",
          description:
            "Optional long description with Markdown (bold, italics, lists, links).",
        },
        {
          name: "location",
          label: "Location",
          placeholder: "Enchi, Western North Region",
          description: "Town, school or venue — do not invent places.",
        },
        {
          name: "startsOn",
          label: "Date (stands out on the public page)",
          placeholder: "15 December 2026",
          description: "Confirmed date used to place the event in Upcoming or Past.",
        },
        {
          name: "endsOn",
          label: "Time / schedule (stands out on the public page)",
          placeholder: "9:00 – 13:00",
          description: "Optional time window or schedule note.",
        },
        {
          name: "hostLabel",
          label: "Host (defaults to Girls Global Initiative if blank)",
          placeholder: "Girls Global Initiative",
        },
        {
          name: "programmeStatus",
          label: "Programme status",
          type: "select",
          description:
            "Use postponed or cancelled only when confirmed — never invent reasons.",
          options: [
            { value: "scheduled", label: "Scheduled (upcoming/past by date)" },
            { value: "postponed", label: "Postponed" },
            { value: "cancelled", label: "Cancelled" },
          ],
        },
        {
          name: "revisedStartsOn",
          label: "Revised date (when postponed)",
          placeholder: "20 December 2026",
          description: "New date when programme status is postponed.",
        },
        {
          name: "statusNote",
          label: "Public status note (cancellation / postponement explanation)",
          type: "textarea",
          placeholder: "Moved due to venue change. New date to be confirmed.",
          description: "Shown publicly with cancelled or postponed events.",
        },
        {
          name: "timezone",
          label: "Timezone (IANA, default Africa/Accra)",
          placeholder: "Africa/Accra",
          description: "Leave as Africa/Accra unless a confirmed exception applies.",
        },
        {
          name: "imageUrl",
          label: "Image",
          type: "image",
          description: "Optional event image (JPEG, PNG, WebP or GIF, max 5MB).",
        },
        {
          name: "sortOrder",
          label: "Sort order",
          type: "number",
          placeholder: "0",
          description: "Lower numbers appear first within a status group.",
        },
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
