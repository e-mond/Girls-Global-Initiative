import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { ContentSection } from "@/components/layout/content-section";
import { PublicSubmissionForm } from "@/components/forms/public-submission-form";
import { PROJECTS } from "@/content/site-copy";

export default function PartnerPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Partner"
        title="Invite GGI to your community"
        description="Schools, families and local leaders can request a conversation about bringing GGI support — school tours, mentorship, health education and rural girl empowerment — to girls who need it most."
      />

      <ContentSection
        eyebrow="Ways to partner"
        title="Open a door where girls already gather."
        tone="surface"
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {PROJECTS.slice(0, 4).map((project) => (
            <li
              key={project.title}
              className="rounded-3xl border border-border-default bg-bg-base p-5"
            >
              <h2 className="font-display text-lg font-bold text-brand-navy">
                {project.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {project.summary}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-text-muted">
          Prefer to browse first? See{" "}
          <Link href="/programmes" className="font-semibold text-brand-sky hover:underline">
            programmes &amp; projects
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection title="Request a conversation" tone="base" narrow>
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
      </ContentSection>
    </>
  );
}
