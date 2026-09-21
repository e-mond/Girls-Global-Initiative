import Link from "next/link";
import { BookOpen, HeartHandshake, School, Users } from "lucide-react";
import {
  IconFeatureGrid,
  ProcessBand,
} from "@/components/layout/editorial";
import { ContentSection, CtaBand } from "@/components/layout/content-section";
import { PageHeroSplit } from "@/components/layout/public-page-intro";
import { DonationForm } from "@/components/donations/donation-form";
import { TAGLINE } from "@/content/site-copy";

export default function DonatePage() {
  return (
    <>
      <PageHeroSplit
        breadcrumb="Donate"
        badge="Donate"
        meta="One-time · Monthly interest"
        title="Donate and support a girl."
        description={`${TAGLINE} Your gift helps Girls Global Initiative advance the rights, dignity, health and opportunity of girls in rural and underserved communities.`}
        imageSrc="/home/hero-main.jpg"
        imageAlt="Girls supported through Girls Global Initiative programmes"
        imageShape="rounded"
        imageCaption="Support that travels"
        imageTags="Education · Health · Mentorship"
        ctas={[
          {
            href: "/get-involved/volunteer",
            label: "Prefer to volunteer?",
            variant: "secondary",
          },
        ]}
      />

      <ContentSection
        tone="navy"
        title="Give toward education, health, mentorship and rural girl empowerment."
        description="One-time gifts process through Paystack when configured. You can also use organisation transfer details on this page. Monthly giving is captured as interest until recurring billing launches."
      />

      <ContentSection
        eyebrow="Where gifts go"
        title="Support that reaches girls where barriers are greatest."
        tone="surface"
      >
        <IconFeatureGrid
          columns={2}
          items={[
            {
              title: "Educational support",
              body: "School engagement and learning resources for girls facing barriers.",
              icon: School,
            },
            {
              title: "Health & hygiene",
              body: "Menstrual education and practical wellbeing support.",
              icon: HeartHandshake,
            },
            {
              title: "Mentorship",
              body: "Guidance and safe spaces so girls are not figuring it out alone.",
              icon: Users,
            },
            {
              title: "Rural outreach",
              body: "Community work that prioritises underserved settings.",
              icon: BookOpen,
            },
          ]}
        />
      </ContentSection>

      <ProcessBand
        eyebrow="Giving path"
        title="Clear steps. Honest follow-through."
        steps={[
          {
            step: "01",
            title: "Choose an amount",
            body: "One-time gifts or monthly interest until recurring billing launches.",
          },
          {
            step: "02",
            title: "Complete checkout",
            body: "Paystack when configured, or organisation transfer details on this page.",
          },
          {
            step: "03",
            title: "Receive thanks",
            body: "A branded acknowledgement when email is configured.",
          },
        ]}
      />

      <ContentSection tone="sky">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <aside className="rounded-[1.75rem] border border-border-default bg-bg-surface p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Why give
            </p>
            <p className="mt-3 font-display text-2xl font-bold text-brand-navy">
              Support that reaches girls where barriers are greatest.
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-text-muted">
              <li>Educational support and school engagement</li>
              <li>Health and menstrual hygiene education</li>
              <li>Mentorship, guidance and safe spaces</li>
              <li>Community outreach in rural and underserved areas</li>
            </ul>
            <p className="mt-6 text-sm text-text-muted">
              Want to give time instead?{" "}
              <Link
                href="/get-involved/volunteer"
                className="font-semibold text-brand-sky hover:underline"
              >
                Volunteer or mentor
              </Link>
              .
            </p>
          </aside>
          <div className="rounded-[1.75rem] border border-border-default bg-bg-surface p-6 sm:p-8">
            <DonationForm />
          </div>
        </div>
      </ContentSection>

      <CtaBand
        title="Walk with us beyond giving."
        primary={{ href: "/our-story", label: "Our story" }}
        secondary={{ href: "/get-involved", label: "More ways to help" }}
      />
    </>
  );
}
