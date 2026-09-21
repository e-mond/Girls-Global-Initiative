import Image from "next/image";
import { PageHeroSplit } from "@/components/layout/public-page-intro";
import { ContentSection } from "@/components/layout/content-section";
import { SocialLinks } from "@/components/layout/social-links";
import { PublicSubmissionForm } from "@/components/forms/public-submission-form";
import {
  CONTACT_EMAIL,
  CONTACT_PHONES,
  phoneTelHref,
} from "@/content/contact-details";

export default function ContactPage() {
  return (
    <>
      <PageHeroSplit
        eyebrow="Contact"
        title="Let's connect."
        description="Send a message to Girls Global Initiative. We will get back to you as soon as we can."
        imageSrc="/home/community-2.jpg"
        imageAlt="Girls Global Initiative community engagement"
        imageShape="rounded"
      />

      <ContentSection tone="surface">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <aside className="space-y-6 overflow-hidden rounded-[1.75rem] bg-brand-navy text-text-on-inverse">
            <div className="relative h-44">
              <Image
                src="/home/hero-little-girl.jpg"
                alt=""
                fill
                className="object-cover object-top opacity-80"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent"
              />
            </div>
            <div className="space-y-6 px-6 pb-8 sm:px-8">
              <div>
                <h2 className="font-display text-xl font-bold">
                  Reach us directly
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-white/85">
                  {CONTACT_PHONES.map((phone) => (
                    <li key={phone}>
                      <a
                        href={phoneTelHref(phone)}
                        className="hover:text-brand-sky"
                      >
                        {phone}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="hover:text-brand-sky"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Follow GGI</p>
                <SocialLinks variant="onDark" className="mt-3" />
              </div>
              <p className="text-xs leading-relaxed text-white/60">
                GGI does not publish a public street address on this site.
              </p>
            </div>
          </aside>

          <div className="rounded-[1.75rem] border border-border-default bg-bg-base p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-brand-navy">
              Send a message
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Tell us how we can help: introductions, invitations and questions
              are all welcome.
            </p>
            <div className="mt-6">
              <PublicSubmissionForm
                kind="contact"
                successTitle="Message sent"
                successBody="Thank you for writing to us. Your message is with the team."
                fields={[
                  { name: "fullName", label: "Name", required: true },
                  {
                    name: "email",
                    label: "Email",
                    type: "email",
                    required: true,
                  },
                  { name: "subject", label: "Subject", required: true },
                  {
                    name: "message",
                    label: "Message",
                    type: "textarea",
                    required: true,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
