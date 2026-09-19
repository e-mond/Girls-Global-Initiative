import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminChallengeTagsPage() {
  return (
    <ContentEntityManager
      entity="challenge_tags"
      title="Challenge tags"
      description="Tags shown in the origin section."
      fields={[
        { name: "label", label: "Label", required: true },
        { name: "icon", label: "Icon key", required: true },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{ icon: "tag", sortOrder: 0 }}
    />
  );
}
