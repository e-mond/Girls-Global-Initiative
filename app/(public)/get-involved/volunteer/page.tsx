import { PageHeroCompact } from "@/components/layout/public-page-intro";
import { ContentSection } from "@/components/layout/content-section";
import { PublicSubmissionForm } from "@/components/forms/public-submission-form";

export default function VolunteerPage() {
  return (
    <>
      <PageHeroCompact
        eyebrow="Volunteer"
        title="Volunteer & mentor"
        description="Share your time and skills with girls who need a steady guide. Tell us a little about yourself. We’ll follow up."
      />

      <ContentSection tone="sky" narrow>
        <PublicSubmissionForm
          kind="volunteer"
          steps={3}
          successTitle="Application received"
          successBody="Thank you. We’ve saved your volunteer application and will be in touch. If email is configured, you’ll also receive an acknowledgement."
          fields={[
            { name: "fullName", label: "Full name", required: true, step: 1 },
            {
              name: "email",
              label: "Email",
              type: "email",
              required: true,
              step: 1,
            },
            { name: "phone", label: "Phone", type: "tel", step: 1 },
            { name: "city", label: "City / community", step: 1 },
            {
              name: "interestArea",
              label: "Interest area",
              required: true,
              step: 2,
            },
            {
              name: "skills",
              label: "Skills you can share",
              type: "textarea",
              required: true,
              step: 2,
            },
            {
              name: "availability",
              label: "Availability",
              type: "textarea",
              required: true,
              step: 2,
            },
            {
              name: "message",
              label: "Anything else we should know?",
              type: "textarea",
              step: 3,
            },
          ]}
        />
      </ContentSection>
    </>
  );
}
