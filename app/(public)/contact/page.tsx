import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { SocialLinks } from "@/components/layout/social-links";
import { PublicSubmissionForm } from "@/components/forms/public-submission-form";
import {
  CONTACT_EMAIL,
  CONTACT_PHONES,
  phoneTelHref,
} from "@/content/contact-details";

export default function ContactPage() {
  return (
    <PublicPageIntro
      eyebrow="Contact"
      title="Say hello"
      description="Send a message to Girls Global Initiative. We’ll get back to you as soon as we can."
    >
      <div className="mb-8 space-y-4 rounded-3xl border border-border-default bg-bg-surface p-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-brand-navy">
            Reach us directly
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-text-muted">
            {CONTACT_PHONES.map((phone) => (
              <li key={phone}>
                <a
                  href={phoneTelHref(phone)}
                  className="text-brand-navy hover:text-brand-sky"
                >
                  {phone}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-brand-navy hover:text-brand-sky"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-brand-navy">Follow GGI</p>
          <SocialLinks variant="onLight" className="mt-2" />
        </div>
      </div>

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
