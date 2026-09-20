import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { ContentSection } from "@/components/layout/content-section";
import { ADVOCATE_COPY } from "@/content/site-copy";
import { SocialLinks } from "@/components/layout/social-links";

export default function AdvocatePage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Raise your voice"
        title="Stand with girls — loudly and carefully."
        description={ADVOCATE_COPY.lead}
      />

      <ContentSection tone="surface">
        <ul className="grid gap-4 lg:grid-cols-3">
          {ADVOCATE_COPY.actions.map((action) => (
            <li
              key={action.title}
              className="rounded-3xl border border-border-default bg-bg-base p-6"
            >
              <h2 className="font-display text-lg font-bold text-brand-navy">
                {action.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {action.body}
              </p>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection
        eyebrow="Share the mission"
        title="Follow GGI and amplify with dignity."
        tone="base"
      >
        <SocialLinks variant="onLight" />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/partner"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-magenta px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-magenta/90"
          >
            Invite GGI to your community
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-default bg-bg-surface px-5 text-sm font-semibold text-brand-navy hover:border-brand-navy/40"
          >
            Contact the team
          </Link>
        </div>
      </ContentSection>
    </>
  );
}
