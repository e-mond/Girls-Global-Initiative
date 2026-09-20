import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { ContentSection } from "@/components/layout/content-section";
import { getInvolvedCards } from "@/features/content/mock-home";
import { TAGLINE } from "@/content/site-copy";

export default function GetInvolvedPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Get involved"
        title="There's a place for you in her story."
        description={`${TAGLINE} Choose how you want to support girls — donate, volunteer, raise your voice, or partner with GGI.`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getInvolvedCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-3xl border border-border-default bg-bg-surface p-5 hover:border-brand-sky"
            >
              <p className="font-display text-lg font-bold text-brand-navy">
                {card.title}
              </p>
              <p className="mt-2 text-sm text-text-muted">{card.body}</p>
              <p className="mt-4 text-sm font-semibold text-brand-magenta">
                {card.cta}
              </p>
            </Link>
          ))}
          <Link
            href="/partner"
            className="rounded-3xl border border-border-default bg-bg-surface p-5 hover:border-brand-sky"
          >
            <p className="font-display text-lg font-bold text-brand-navy">
              Partner with us
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Invite GGI into your school, family network or community.
            </p>
            <p className="mt-4 text-sm font-semibold text-brand-magenta">
              Request a conversation
            </p>
          </Link>
        </div>
      </PublicPageIntro>

      <ContentSection
        eyebrow="Why it matters"
        title="Support that reaches girls where barriers are greatest."
        description="Whether you give, mentor, advocate or open a door in your community, you help GGI close the gap between rural girls and the opportunities they deserve."
        tone="navy"
        narrow
      />
    </>
  );
}
