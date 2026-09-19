import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminAdvocacyPage() {
  return (
    <ContentEntityManager
      entity="advocacy_content"
      title="Advocacy"
      description="Advocacy toolkit content blocks."
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "body", label: "Body", type: "textarea", required: true },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{ body: "", sortOrder: 0 }}
    />
  );
}
