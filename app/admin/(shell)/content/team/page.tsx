import { ContentEntityManager } from "@/components/admin/content-entity-manager";

export default function AdminTeamPage() {
  return (
    <ContentEntityManager
      entity="team_members"
      title="Team"
      description="Add, edit, publish or remove team members. Changes go live on the public Team page after you publish. Editors and administrators can manage this list."
      createLabel="Add team member"
      emptyMessage="No team members in the CMS yet. Add someone below, then Publish so they appear on the public Team page."
      fields={[
        {
          name: "name",
          label: "Name",
          required: true,
          placeholder: "Full name",
        },
        {
          name: "roleTitle",
          label: "Role / title",
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
          description:
            "Portrait photo (JPEG, PNG, WebP or GIF, max 5MB). You can replace this anytime.",
        },
        {
          name: "isFounder",
          label: "Founder spotlight",
          type: "boolean",
          description:
            "Mark Yes for the founder profile used on Our Story / Founder pages.",
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
          description: "Lower numbers appear first on the Team page.",
        },
      ]}
      createDefaults={{ bio: "", sortOrder: 0, isFounder: false }}
    />
  );
}
