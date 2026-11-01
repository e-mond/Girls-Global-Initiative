import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminPillarsPage() {
  return (
    <ContentEntityManager
      entity="pillars"
      title="Pillars"
      description="Manage the four programme pillars shown on What we do."
      fields={[
        {
          name: "title",
          label: "Title",
          required: true,
          placeholder: "e.g. Rights & dignity",
        },
        {
          name: "slug",
          label: "Slug",
          required: true,
          placeholder: "rights-dignity",
          description: "URL path for the pillar detail page.",
        },
        {
          name: "description",
          label: "Short description",
          type: "textarea",
          required: true,
          placeholder: "One short paragraph for the pillar card.",
        },
        {
          name: "detail",
          label: "Detail page copy",
          type: "textarea",
          markdown: true,
          placeholder: "Longer copy for the pillar detail page.",
          description: "Optional Markdown for the pillar detail page.",
        },
        {
          name: "icon",
          label: "Icon key",
          placeholder: "sparkles",
          description: "Approved icon key from the design system (e.g. sparkles, heart).",
        },
        {
          name: "colour",
          label: "Colour tone",
          placeholder: "navy",
          description: "Tone key: navy, sky or magenta.",
        },
        {
          name: "sortOrder",
          label: "Sort order",
          type: "number",
          placeholder: "1",
        },
      ]}
      createDefaults={{ icon: "sparkles", colour: "navy", sortOrder: 0, detail: "" }}
    />
  );
}
