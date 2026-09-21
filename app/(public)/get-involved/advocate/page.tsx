import Link from "next/link";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { ADVOCATE_COPY } from "@/content/site-copy";
import { SocialLinks } from "@/components/layout/social-links";

export default function AdvocatePage() {
  return (
    <>
      <PageHeroEditorial
        eyebrow="Raise your voice"
        title="Stand with girls — loudly and carefully."
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
                  ? "rounded-[1.75rem] bg-brand-navy p-6 text-text-on-inverse lg:col-span-1"
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

      <ContentSection
        eyebrow="Share the mission"
        title="Follow GGI and pass the story on."
        tone="sky"
      >
        <SocialLinks variant="onLight" />
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

      <CtaBand
        title="Turn attention into action."
        primary={{ href: "/get-involved/donate", label: "Support a girl" }}
        secondary={{ href: "/partner", label: "Partner with us" }}
      />
    </>
  );
}
