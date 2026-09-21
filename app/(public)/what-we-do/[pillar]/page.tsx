import Link from "next/link";
import { notFound } from "next/navigation";
import { HeartHandshake, Sparkles } from "lucide-react";
import {
  DualToneCards,
  ProcessBand,
} from "@/components/layout/editorial";
import {
  ContentSection,
  CtaBand,
  RelatedLinks,
} from "@/components/layout/content-section";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
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
        breadcrumb={pillar.title}
        badge="What we do"
        meta="Pillar detail"
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

      <ProcessBand
        eyebrow="How we work"
        title="Community-centred. Girl-focused. Empowerment-driven."
        description="Pillar work travels through school engagement, safe conversations, mentorship and local partnerships."
        steps={[
          {
            step: "01",
            title: "Listen",
            body: "Start from what girls and communities name as barriers.",
          },
          {
            step: "02",
            title: "Educate & support",
            body: "Bring rights, health, confidence and mentorship into the room.",
          },
          {
            step: "03",
            title: "Partner locally",
            body: "Never as a one-size programme dropped from outside.",
          },
        ]}
      />

      <DualToneCards
        left={{
          label: "Girl-focused",
          body: "This pillar exists so girls are informed, protected and hopeful.",
          icon: HeartHandshake,
          tone: "pink",
        }}
        right={{
          label: "Community-rooted",
          body: "Delivery stays close to schools, families and local partners.",
          icon: Sparkles,
          tone: "sky",
        }}
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
