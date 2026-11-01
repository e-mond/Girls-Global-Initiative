import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminChallengeTagsPage() {
  return (
    <ContentEntityManager
      entity="challenge_tags"
      title="Challenge tags"
      description="Tags shown in the origin section."
      fields={[
        {
          name: "label",
          label: "Label",
          required: true,
          placeholder: "e.g. Early marriage",
        },
        {
          name: "icon",
          label: "Icon key",
          required: true,
          placeholder: "tag",
          description: "Approved icon key from the design system.",
        },
        {
          name: "sortOrder",
          label: "Sort order",
          type: "number",
          placeholder: "0",
        },
      ]}
      createDefaults={{ icon: "tag", sortOrder: 0 }}
    />
  );
}
