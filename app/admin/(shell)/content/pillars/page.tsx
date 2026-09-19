import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminPillarsPage() {
  return (
    <ContentEntityManager
      entity="pillars"
      title="Pillars"
      description="Manage the four programme pillars shown on What we do."
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug", required: true },
        {
          name: "description",
          label: "Short description",
          type: "textarea",
          required: true,
        },
        { name: "detail", label: "Detail page copy", type: "textarea" },
        { name: "icon", label: "Icon key" },
        { name: "colour", label: "Colour tone" },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{ icon: "sparkles", colour: "navy", sortOrder: 0, detail: "" }}
    />
  );
}
