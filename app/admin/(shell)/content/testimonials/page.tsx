import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminTestimonialsPage() {
  return (
    <ContentEntityManager
      entity="testimonials"
      title="Testimonials"
      description="Quotes and attributions for public storytelling."
      fields={[
        { name: "quote", label: "Quote", type: "textarea", required: true },
        { name: "attribution", label: "Attribution", required: true },
        { name: "roleLabel", label: "Role label" },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{ sortOrder: 0 }}
    />
  );
}
