import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminAdvocacyPage() {
  return (
    <ContentEntityManager
      entity="advocacy_content"
      title="Advocacy"
      description="Advocacy toolkit content blocks."
      fields={[
        {
          name: "title",
          label: "Title",
          required: true,
          placeholder: "Toolkit block title",
        },
        {
          name: "body",
          label: "Body",
          type: "textarea",
          required: true,
          markdown: true,
          placeholder: "Guidance visitors can act on. Use short paragraphs and lists.",
          description: "Markdown supported for emphasis, lists and links.",
        },
        {
          name: "sortOrder",
          label: "Sort order",
          type: "number",
          placeholder: "0",
        },
      ]}
      createDefaults={{ body: "", sortOrder: 0 }}
    />
  );
}
