import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { PublicSubmissionForm } from "@/components/forms/public-submission-form";

export default function PartnerPage() {
  return (
    <PublicPageIntro
      eyebrow="Partner"
      title="Invite GGI to your community"
      description="Schools, families and local leaders can request a conversation about bringing GGI support to girls who need it most."
    >
      <PublicSubmissionForm
        kind="partnership"
        successTitle="Request received"
        successBody="Thank you. We’ve received your partnership request and will review it soon."
        fields={[
          {
            name: "requesterName",
            label: "Your name",
            required: true,
          },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "roleTitle", label: "Your role", required: true },
          {
            name: "organisation",
            label: "Organisation / community",
            required: true,
          },
          { name: "location", label: "Location", required: true },
          {
            name: "message",
            label: "How can we partner?",
            type: "textarea",
            required: true,
          },
        ]}
      />
    </PublicPageIntro>
  );
}
