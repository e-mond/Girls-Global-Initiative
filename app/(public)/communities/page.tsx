import Link from "next/link";
import { HomeCommunities } from "@/components/home/home-communities";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { ContentSection } from "@/components/layout/content-section";
import { COMMUNITIES_COPY } from "@/content/site-copy";

export default function CommunitiesPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Communities"
        title="Rural, remote & underserved — first, not last."
        description={COMMUNITIES_COPY.lead}
      />

      <ContentSection tone="surface">
        <ul className="grid gap-4 lg:grid-cols-3">
          {COMMUNITIES_COPY.points.map((point) => (
            <li
              key={point.slice(0, 32)}
              className="rounded-3xl border border-border-default bg-bg-base p-5 text-sm leading-relaxed text-text-muted"
            >
              {point}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-text-muted">
          Learn how community work connects to{" "}
          <Link href="/programmes" className="font-semibold text-brand-sky hover:underline">
            programmes &amp; projects
          </Link>{" "}
          and our{" "}
          <Link href="/impact" className="font-semibold text-brand-sky hover:underline">
            impact themes
          </Link>
          .
        </p>
      </ContentSection>

      <HomeCommunities showIntro={false} />
    </>
  );
}
