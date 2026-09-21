import Link from "next/link";
import { ArrowRight, HeartHandshake, Sparkles } from "lucide-react";
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
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { APPROACH_STEPS, FOCUS_AREAS } from "@/content/site-copy";
import { pillars, type Pillar } from "@/features/content/mock-home";
import { cn } from "@/lib/utils";

const toneClasses: Record<Pillar["tone"], string> = {
  navy: "bg-brand-navy text-text-on-inverse",
  magenta: "bg-brand-magenta text-text-on-inverse",
  sky: "bg-brand-sky text-text-on-inverse",
  cream: "bg-[#f3e6d8] text-brand-navy",
};

export default function WhatWeDoPage() {
  const [featured, ...rest] = pillars;
  const approachSteps = APPROACH_STEPS.slice(0, 4).map((step, index) => ({
    step: String(index + 1).padStart(2, "0"),
    title: step,
    body: "Part of GGI's community-centred approach in schools and neighbourhoods.",
  }));

  return (
    <>
      <PageHeroEditorial
        breadcrumb="What we do"
        badge="What we do"
        meta="Four pillars · One mission"
        title="Four connected ways we walk alongside girls."
        description="GGI organises its work around rights and dignity, health and wellbeing, confidence and growth, and mentorship and opportunity."
        tone="cream"
        ambient="flat"
        ctas={[
          { href: "/programmes", label: "View programmes" },
          { href: "/impact", label: "See impact themes", variant: "secondary" },
        ]}
      />

      <div
        aria-hidden
        className="mx-auto h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-brand-navy/20 to-transparent px-4"
      />

      <ContentSection
        eyebrow="Our pillars"
        title="One mission. Four areas of care."
        tone="cream"
      >
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <article
              className={cn(
                "flex min-h-[320px] flex-col rounded-[2rem] p-8",
                toneClasses[featured.tone],
              )}
            >
              <p className="text-xs font-bold uppercase tracking-wide text-white/70">
                Featured pillar
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold">
                {featured.title}
              </h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-white/85">
                {featured.description}
              </p>
              <Link
                href={`/what-we-do/${featured.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-text-on-inverse"
              >
                Explore this pillar
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
            {rest.map((pillar) => (
              <StaggerItem key={pillar.slug}>
                <article
                  className={cn(
                    "flex flex-col rounded-3xl p-6 sm:min-h-[140px]",
                    toneClasses[pillar.tone],
                  )}
                >
                  <h3 className="font-display text-xl font-bold">
                    {pillar.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 flex-1 text-sm leading-relaxed",
                      pillar.tone === "cream"
                        ? "text-brand-navy/80"
                        : "text-white/85",
                    )}
                  >
                    {pillar.description}
                  </p>
                  <Link
                    href={`/what-we-do/${pillar.slug}`}
                    className={cn(
                      "mt-4 inline-flex items-center gap-2 text-sm font-semibold",
                      pillar.tone === "cream"
                        ? "text-brand-navy"
                        : "text-text-on-inverse",
                    )}
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </ContentSection>

      <ProcessBand
        eyebrow="Our approach"
        title="How we show up in schools and communities."
        description="A girl-focused rhythm that listens first, then educates, supports and advocates."
        steps={approachSteps}
      />

      <DualToneCards
        left={{
          label: "Girl-focused",
          body: "Every pillar starts with what girls need to stay safe, informed and hopeful.",
          icon: HeartHandshake,
          tone: "pink",
        }}
        right={{
          label: "Community-centred",
          body: "Lasting change travels through schools, families and local partners.",
          icon: Sparkles,
          tone: "sky",
        }}
      />

      <ContentSection
        eyebrow="Focus areas"
        title="Six focus areas that feed our pillars and programmes."
        description="These focus areas from GGI's organisational narrative map into the four pillars above and into the programmes detailed on our Programmes page."
        tone="blush"
      >
        <ul className="grid gap-4 lg:grid-cols-2">
          {FOCUS_AREAS.map((area) => (
            <li
              key={area.title}
              className="rounded-3xl border border-border-default bg-bg-surface/80 p-6"
            >
              <h3 className="font-display text-lg font-bold text-brand-navy">
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {area.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-text-muted">
          Full approach list includes education support, mentorship, health
          education, menstrual hygiene, rights awareness, economic empowerment,
          outreach, advocacy, partnerships and physical education.
        </p>
      </ContentSection>

      <RelatedLinks
        links={[
          {
            href: "/programmes",
            label: "Programmes & projects",
            description: "See how initiatives bring the pillars to life.",
          },
          {
            href: "/impact",
            label: "Impact",
            description: "Achievements and themes we document without invented counts.",
          },
          {
            href: "/communities",
            label: "Communities",
            description: "Where GGI prioritises rural and underserved girls.",
          },
        ]}
      />

      <CtaBand
        title="Help us walk alongside more girls."
        primary={{ href: "/get-involved", label: "Get involved" }}
        secondary={{ href: "/partner", label: "Partner with us" }}
      />
    </>
  );
}
