import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminTestimonialsPage() {
  return (
    <ContentEntityManager
      entity="testimonials"
      title="Testimonials"
      description="Quotes and attributions for public storytelling."
      fields={[
        {
          name: "quote",
          label: "Quote",
          type: "textarea",
          required: true,
          placeholder: "“The session helped me speak up at school.”",
          description: "Use the visitor’s words — do not invent quotations.",
        },
        {
          name: "attribution",
          label: "Attribution",
          required: true,
          placeholder: "First name or agreed public name",
        },
        {
          name: "roleLabel",
          label: "Role label",
          placeholder: "e.g. Student, Western Region",
        },
        {
          name: "sortOrder",
          label: "Sort order",
          type: "number",
          placeholder: "0",
        },
      ]}
      createDefaults={{ sortOrder: 0 }}
    />
  );
}
