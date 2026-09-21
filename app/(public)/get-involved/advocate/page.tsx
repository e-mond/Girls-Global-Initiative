import Link from "next/link";
import { Megaphone, Share2, Users } from "lucide-react";
import {
  IconFeatureGrid,
  PhotoBand,
  ProcessBand,
} from "@/components/layout/editorial";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import { SocialLinks } from "@/components/layout/social-links";
import { ADVOCATE_COPY } from "@/content/site-copy";

export default function AdvocatePage() {
  return (
    <>
      <PageHeroEditorial
        breadcrumb="Advocate"
        badge="Raise your voice"
        meta="Dignity · Care · Courage"
        title="Stand with girls, loudly and carefully."
        description={ADVOCATE_COPY.lead}
        tone="blush"
        ctas={[
          { href: "/partner", label: "Invite GGI" },
          { href: "/contact", label: "Contact the team", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="How to advocate"
        title="Amplify with dignity."
        tone="cream"
      >
        <ul className="grid gap-4 lg:grid-cols-3">
          {ADVOCATE_COPY.actions.map((action, index) => (
            <li
              key={action.title}
              className={
                index === 0
                  ? "rounded-[1.75rem] bg-brand-navy p-6 text-text-on-inverse"
                  : "rounded-[1.75rem] border border-border-default bg-bg-surface p-6"
              }
            >
              <h2
                className={
                  index === 0
                    ? "font-display text-lg font-bold text-text-on-inverse"
                    : "font-display text-lg font-bold text-brand-navy"
                }
              >
                {action.title}
              </h2>
              <p
                className={
                  index === 0
                    ? "mt-3 text-sm leading-relaxed text-white/80"
                    : "mt-3 text-sm leading-relaxed text-text-muted"
                }
              >
                {action.body}
              </p>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ProcessBand
        eyebrow="A careful cadence"
        title="Speak up without putting girls at risk."
        steps={[
          {
            step: "01",
            title: "Learn the story",
            body: "Start from GGI's approved narrative — never invent impact numbers.",
          },
          {
            step: "02",
            title: "Share with care",
            body: "Amplify rights, safety and school belonging in your networks.",
          },
          {
            step: "03",
            title: "Invite action",
            body: "Point people toward donate, volunteer, partner or contact paths.",
          },
        ]}
      />

      <ContentSection
        eyebrow="Share the mission"
        title="Follow GGI and pass the story on."
        tone="sky"
      >
        <IconFeatureGrid
          columns={2}
          items={[
            {
              title: "Raise the issue",
              body: "Talk about rural girls' rights, health and opportunity where you already have influence.",
              icon: Megaphone,
            },
            {
              title: "Share channels",
              body: "Follow GGI and pass along posts that protect dignity.",
              icon: Share2,
            },
            {
              title: "Open doors",
              body: "Introduce schools, families and community leaders to partnership.",
              icon: Users,
            },
          ]}
        />
        <div className="mt-8">
          <SocialLinks variant="onLight" />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/our-story"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-navy px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-navy/90"
          >
            Read our story
          </Link>
          <Link
            href="/get-involved"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-default bg-bg-surface px-5 text-sm font-semibold text-brand-navy hover:border-brand-navy/40"
          >
            More ways to help
          </Link>
        </div>
      </ContentSection>

      <PhotoBand src="/our-story/growth.jpg" alt="Advocacy rooted in community" />

      <CtaBand
        title="Turn attention into action."
        primary={{ href: "/get-involved/donate", label: "Support a girl" }}
        secondary={{ href: "/partner", label: "Partner with us" }}
      />
    </>
  );
}
