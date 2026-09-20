import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  Prose,
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

  return (
    <>
      <PublicPageIntro
        eyebrow="What we do"
        title={pillar.title}
        description={pillar.description}
      >
        <Prose>
          <p>{pillar.detail}</p>
        </Prose>
        <p className="mt-6 text-sm text-text-muted">
          <Link href="/what-we-do" className="text-brand-sky hover:underline">
            Back to all pillars
          </Link>
        </p>
      </PublicPageIntro>

      {focus ? (
        <ContentSection
          eyebrow="Focus within this pillar"
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
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/programmes"
              className="font-semibold text-brand-sky hover:underline"
            >
              View programmes &amp; projects
            </Link>
            <Link
              href="/get-involved"
              className="font-semibold text-brand-magenta hover:underline"
            >
              Get involved
            </Link>
          </div>
        </ContentSection>
      ) : null}
    </>
  );
}
