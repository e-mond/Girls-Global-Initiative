import Link from "next/link";
import { HomeCommunities } from "@/components/home/home-communities";
import { PageHeroPhoto } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { COMMUNITIES_COPY } from "@/content/site-copy";

export default function CommunitiesPage() {
  return (
    <>
      <PageHeroPhoto
        eyebrow="Communities"
        title="Rural, remote & underserved: first, not last."
        description={COMMUNITIES_COPY.lead}
        imageSrc="/home/community-1.jpg"
        imageAlt="Girls and community members in a learning setting"
        ctas={[
          { href: "/partner", label: "Invite GGI", variant: "onDark" },
          { href: "/programmes", label: "See programmes", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="Where we prioritise"
        title="Community storytelling over invented maps."
        description="GGI does not publish fabricated location counts. What we do share is the focus: girls in rural, remote and underserved communities."
        tone="cream"
      >
        <ul className="grid gap-4 lg:grid-cols-3">
          {COMMUNITIES_COPY.points.map((point) => (
            <li
              key={point.slice(0, 32)}
              className="rounded-3xl border border-border-default bg-bg-surface p-5 text-sm leading-relaxed text-text-muted"
            >
              {point}
            </li>
          ))}
        </ul>
      </ContentSection>

      <HomeCommunities showIntro={false} />

      <ContentSection tone="sky" narrow>
        <p className="text-sm text-text-muted">
          Connect community work to{" "}
          <Link href="/programmes" className="font-semibold text-brand-sky hover:underline">
            programmes &amp; projects
          </Link>{" "}
          and{" "}
          <Link href="/impact" className="font-semibold text-brand-sky hover:underline">
            impact themes
          </Link>
          .
        </p>
      </ContentSection>

      <CtaBand
        title="Open a door in your community."
        primary={{ href: "/partner", label: "Partner with us" }}
        secondary={{ href: "/contact", label: "Contact GGI" }}
      />
    </>
  );
}
