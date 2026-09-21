import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
  RelatedLinks,
} from "@/components/layout/content-section";
import { PILLAR_FOCUS } from "@/content/site-copy";
import { getPillar, pillars } from "@/features/content/mock-home";

export function generateStaticParams() {
  return pillars.map((pillar) => ({ pillar: pillar.slug }));
}

export default async function PillarDetailPage({
  params,
}: {
  params: Promise<{ pillar: string }>;
}) {
  const { pillar: slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) notFound();

  const focus = PILLAR_FOCUS[slug];
  const related = pillars.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHeroEditorial
        eyebrow="What we do"
        title={pillar.title}
        description={pillar.description}
        ctas={[
          { href: "/what-we-do", label: "All pillars", variant: "secondary" },
          { href: "/programmes", label: "Programmes" },
        ]}
      />

      <ContentSection
        eyebrow="Why this matters"
        title="Meeting girls where barriers are real."
        tone="sky"
        narrow
      >
        <p className="text-base leading-relaxed text-text-muted sm:text-lg">
          {pillar.detail}
        </p>
      </ContentSection>

      {focus ? (
        <ContentSection
          eyebrow="What we do"
          title="How this pillar shows up in GGI's work."
          tone="surface"
        >
          <ul className="grid gap-4 lg:grid-cols-2">
            {focus.focusTitles.map((title, index) => (
              <li
                key={title}
                className="rounded-3xl border border-border-default bg-bg-base p-6"
              >
                <h2 className="font-display text-lg font-bold text-brand-navy">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {focus.body[index]}
                </p>
              </li>
            ))}
          </ul>
        </ContentSection>
      ) : null}

      <ContentSection
        eyebrow="How we work"
        title="Community-centred. Girl-focused. Empowerment-driven."
        description="Pillar work travels through school engagement, safe conversations, mentorship and local partnerships — never as a one-size programme dropped from outside."
        tone="blush"
        narrow
      />

      <RelatedLinks
        title="Related pillars"
        links={related.map((item) => ({
          href: `/what-we-do/${item.slug}`,
          label: item.title,
          description: item.description,
        }))}
      />

      <CtaBand
        title="Bring this work closer to girls who need it."
        primary={{ href: "/get-involved", label: "Get involved" }}
        secondary={{ href: "/programmes", label: "View programmes" }}
      />

      <ContentSection tone="cream" narrow>
        <p className="text-sm text-text-muted">
          <Link href="/what-we-do" className="font-semibold text-brand-sky hover:underline">
            Back to all pillars
          </Link>
        </p>
      </ContentSection>
    </>
  );
}
