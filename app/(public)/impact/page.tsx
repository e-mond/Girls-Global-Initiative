import { HomeCommunities } from "@/components/home/home-communities";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
  RelatedLinks,
} from "@/components/layout/content-section";
import { IMPACT } from "@/content/site-copy";

export default function ImpactPage() {
  return (
    <>
      <PageHeroEditorial
        eyebrow="Impact"
        title="What we have begun, and what we are building next."
        description="GGI documents real achievements from school tours, hygiene support, safe spaces and rural-focused initiatives. Numeric counters appear only when GGI publishes verified figures."
        tone="cream"
        ctas={[
          { href: "/communities", label: "See communities" },
          { href: "/programmes", label: "Programmes", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="Key achievements"
        title="Progress rooted in community work."
        tone="navy"
      >
        <ul className="space-y-4">
          {IMPACT.achievements.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm leading-relaxed text-white/90"
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
        tone="sky"
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {IMPACT.categories.map((label) => (
            <li
              key={label}
              className="rounded-3xl border border-dashed border-border-default bg-bg-surface/80 px-5 py-8 text-center"
            >
              <p className="font-display text-lg font-bold text-brand-navy">
                {label}
              </p>
              <p className="mt-2 text-xs text-text-muted">
                Photography &amp; narrative. Figures pending
              </p>
            </li>
          ))}
        </ul>
      </ContentSection>

      <HomeCommunities showIntro={false} />

      <RelatedLinks
        links={[
          {
            href: "/communities",
            label: "Communities",
            description: "Field moments from rural and underserved settings.",
          },
          {
            href: "/programmes",
            label: "Programmes",
            description: "How the work is organised day to day.",
          },
          {
            href: "/get-involved",
            label: "Get involved",
            description: "Help GGI continue this progress.",
          },
        ]}
      />

      <CtaBand
        title="Help the next chapter of impact take shape."
        primary={{ href: "/get-involved/donate", label: "Donate" }}
        secondary={{ href: "/get-involved/volunteer", label: "Volunteer" }}
      />
    </>
  );
}
