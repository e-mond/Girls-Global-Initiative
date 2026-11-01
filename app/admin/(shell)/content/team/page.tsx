import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminTeamPage() {
  return (
    <ContentEntityManager
      entity="team_members"
      title="Team"
      description="Team members and founder spotlight fields."
      fields={[
        {
          name: "name",
          label: "Name",
          required: true,
          placeholder: "Full name",
        },
        {
          name: "roleTitle",
          label: "Role",
          required: true,
          placeholder: "e.g. Founder & Executive Director",
        },
        {
          name: "bio",
          label: "Bio",
          type: "textarea",
          placeholder: "Short biography for the team page.",
          description: "Keep to a few sentences visitors can scan quickly.",
        },
        {
          name: "photoMediaId",
          label: "Photo",
          type: "image",
          description: "Portrait photo (JPEG, PNG, WebP or GIF, max 5MB).",
        },
        {
          name: "quote",
          label: "Founder quote",
          type: "textarea",
          placeholder: "Optional quote for the founder spotlight.",
        },
        {
          name: "callout1Title",
          label: "Callout 1 title",
          placeholder: "Optional highlight title",
        },
        {
          name: "callout1Body",
          label: "Callout 1 body",
          placeholder: "Optional highlight text",
        },
        {
          name: "callout2Title",
          label: "Callout 2 title",
          placeholder: "Optional highlight title",
        },
        {
          name: "callout2Body",
          label: "Callout 2 body",
          placeholder: "Optional highlight text",
        },
        {
          name: "callout3Title",
          label: "Callout 3 title",
          placeholder: "Optional highlight title",
        },
        {
          name: "callout3Body",
          label: "Callout 3 body",
          placeholder: "Optional highlight text",
        },
        {
          name: "sortOrder",
          label: "Sort order",
          type: "number",
          placeholder: "0",
          description: "Lower numbers appear first.",
        },
      ]}
      createDefaults={{ bio: "", sortOrder: 0, isFounder: false }}
    />
  );
}
