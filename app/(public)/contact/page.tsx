import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { PublicSubmissionForm } from "@/components/forms/public-submission-form";

export default function ContactPage() {
  return (
    <PublicPageIntro
      eyebrow="Contact"
      title="Say hello"
      description="Send a message to Girls Global Initiative. We’ll get back to you as soon as we can."
    >
      <PublicSubmissionForm
        kind="contact"
        successTitle="Message sent"
        successBody="Thank you for writing to us. Your message is with the team."
        fields={[
          { name: "fullName", label: "Name", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "subject", label: "Subject", required: true },
          {
            name: "message",
            label: "Message",
            type: "textarea",
            required: true,
          },
        ]}
      />
    </PublicPageIntro>
  );
}
