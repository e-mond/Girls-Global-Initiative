import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { ContentSection } from "@/components/layout/content-section";
import { IMPACT } from "@/content/site-copy";
import { HomeCommunities } from "@/components/home/home-communities";

export default function ImpactPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Impact"
        title="What we have begun — and what we are building next."
        description="GGI documents real achievements from school tours, hygiene support, safe spaces and rural-focused initiatives. We do not invent numeric impact counters until GGI publishes verified figures."
      />

      <ContentSection
        eyebrow="Key achievements"
        title="Progress rooted in community work."
        tone="surface"
      >
        <ul className="space-y-4">
          {IMPACT.achievements.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-2xl border border-border-default bg-bg-base p-5 text-sm leading-relaxed text-brand-navy"
            >
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-magenta"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection
        eyebrow="Impact themes"
        title="Categories we document through photography and story."
        description="These labels describe the kinds of impact GGI tracks. Counts will appear here only when GGI supplies verified numbers."
        tone="base"
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {IMPACT.categories.map((label) => (
            <li
              key={label}
              className="rounded-3xl border border-dashed border-border-default bg-bg-surface px-5 py-8 text-center"
            >
              <p className="font-display text-lg font-bold text-brand-navy">
                {label}
              </p>
              <p className="mt-2 text-xs text-text-muted">
                Photography &amp; narrative — figures pending
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-text-muted">
          Visit{" "}
          <Link href="/communities" className="font-semibold text-brand-sky hover:underline">
            Communities
          </Link>{" "}
          for gallery moments from the field, or{" "}
          <Link href="/programmes" className="font-semibold text-brand-sky hover:underline">
            Programmes
          </Link>{" "}
          to see how the work is organised.
        </p>
      </ContentSection>

      <HomeCommunities showIntro={false} />
    </>
  );
}
