import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminTeamPage() {
  return (
    <ContentEntityManager
      entity="team_members"
      title="Team"
      description="Team members and founder spotlight fields."
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "roleTitle", label: "Role", required: true },
        { name: "bio", label: "Bio", type: "textarea" },
        { name: "quote", label: "Founder quote", type: "textarea" },
        { name: "callout1Title", label: "Callout 1 title" },
        { name: "callout1Body", label: "Callout 1 body" },
        { name: "callout2Title", label: "Callout 2 title" },
        { name: "callout2Body", label: "Callout 2 body" },
        { name: "callout3Title", label: "Callout 3 title" },
        { name: "callout3Body", label: "Callout 3 body" },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      createDefaults={{ bio: "", sortOrder: 0, isFounder: false }}
    />
  );
}
