import Link from "next/link";
import {
  HeartHandshake,
  MapPin,
  School,
  Shield,
  Users,
} from "lucide-react";
import { HomeCommunities } from "@/components/home/home-communities";
import {
  IconFeatureGrid,
  MediaBeliefSplit,
  PhotoBand,
} from "@/components/layout/editorial";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { PageHeroPhoto } from "@/components/layout/public-page-intro";
import { COMMUNITIES_COPY } from "@/content/site-copy";

export default function CommunitiesPage() {
  return (
    <>
      <PageHeroPhoto
        breadcrumb="Communities"
        badge="Communities"
        meta="Rural · Remote · Underserved"
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
        <IconFeatureGrid
          items={[
            {
              title: "Rural first",
              body: COMMUNITIES_COPY.points[0],
              icon: MapPin,
            },
            {
              title: "Schools & safe spaces",
              body: COMMUNITIES_COPY.points[1],
              icon: School,
            },
            {
              title: "Families & partners",
              body: COMMUNITIES_COPY.points[2],
              icon: Users,
            },
          ]}
        />
      </ContentSection>

      <HomeCommunities showIntro={false} />

      <MediaBeliefSplit
        eyebrow="How we show up"
        title="Presence that protects dignity."
        description="Community work means listening first, then walking with schools, families and girls."
        imageSrc="/our-story/challenges.jpg"
        imageAlt="Girls gathering in community"
        items={[
          {
            title: "Listen before leading",
            body: "Programmes start from what girls and caretakers name as barriers.",
            icon: HeartHandshake,
          },
          {
            title: "Protect dignity",
            body: "Photography and storytelling never invent numbers or expose girls.",
            icon: Shield,
          },
          {
            title: "Stay accountable",
            body: "Impact is documented through story and verified figures only.",
            icon: Users,
          },
        ]}
      />

      <PhotoBand src="/our-story/journey.jpg" alt="Community journey with GGI" />

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
