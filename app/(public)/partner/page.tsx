import Link from "next/link";
import { Handshake, School, Users } from "lucide-react";
import {
  IconFeatureGrid,
  ProcessBand,
} from "@/components/layout/editorial";
import { ContentSection, CtaBand } from "@/components/layout/content-section";
import { PageHeroSplit } from "@/components/layout/public-page-intro";
import { PublicSubmissionForm } from "@/components/forms/public-submission-form";
import { PROJECTS } from "@/content/site-copy";

export default function PartnerPage() {
  return (
    <>
      <PageHeroSplit
        breadcrumb="Partner"
        badge="Partner"
        meta="Schools · Families · Communities"
        title="Invite GGI to your community"
        description="Schools, families and local leaders can request a conversation about bringing GGI support — school tours, mentorship, health education and rural girl empowerment — to girls who need it most."
        imageSrc="/home/community-3.jpg"
        imageAlt="Community partnership with Girls Global Initiative"
        imageCaption="Open a door"
        imageTags="Conversation · Trust · Care"
        ctas={[
          { href: "/programmes", label: "Browse programmes", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="Ways to partner"
        title="Open a door where girls already gather."
        tone="cream"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <ul className="grid gap-4 sm:grid-cols-2">
            {PROJECTS.slice(0, 4).map((project) => (
              <li
                key={project.title}
                className="rounded-3xl border border-border-default bg-bg-surface p-5"
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
          <aside className="rounded-[1.75rem] bg-brand-navy p-6 text-text-on-inverse">
            <p className="text-xs font-bold uppercase tracking-wide text-blob-pink">
              Partnership focus
            </p>
            <p className="mt-3 font-display text-2xl font-bold">
              Schools, families and community leaders.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Prefer to browse first? See{" "}
              <Link href="/programmes" className="font-semibold text-brand-sky hover:underline">
                programmes &amp; projects
              </Link>
              .
            </p>
          </aside>
        </div>
      </ContentSection>

      <ProcessBand
        eyebrow="Partnership path"
        title="From hello to girls in the room."
        steps={[
          {
            step: "01",
            title: "Request a conversation",
            body: "Tell us about your school, family network or community.",
          },
          {
            step: "02",
            title: "Shape the visit",
            body: "GGI aligns programmes to local needs without one-size drops.",
          },
          {
            step: "03",
            title: "Walk with girls",
            body: "Education, health, mentorship and advocacy stay close to home.",
          },
        ]}
      />

      <ContentSection tone="surface">
        <IconFeatureGrid
          items={[
            {
              title: "Schools",
              body: "Host tours, rights conversations and learning support.",
              icon: School,
            },
            {
              title: "Families",
              body: "Open guidance pathways so girls are not walking alone.",
              icon: Users,
            },
            {
              title: "Community leaders",
              body: "Build durable local partnership around girls' dignity.",
              icon: Handshake,
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="Request a conversation" tone="sky" narrow>
        <PublicSubmissionForm
          kind="partnership"
          successTitle="Request received"
          successBody="Thank you. We've received your partnership request and will review it soon."
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

      <CtaBand
        title="Prefer another path?"
        primary={{ href: "/get-involved/volunteer", label: "Volunteer" }}
        secondary={{ href: "/contact", label: "Contact GGI" }}
      />
    </>
  );
}
