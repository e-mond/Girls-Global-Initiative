import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
  RelatedLinks,
} from "@/components/layout/content-section";
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

  return (
    <>
      <PageHeroEditorial
        eyebrow="What we do"
        title="Four connected ways we walk alongside girls."
        description="GGI organises its work around rights and dignity, health and wellbeing, confidence and growth, and mentorship and opportunity — using a community-centred, girl-focused approach."
        tone="sky"
        ctas={[
          { href: "/programmes", label: "View programmes" },
          { href: "/impact", label: "See impact themes", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="Our pillars"
        title="One mission. Four areas of care."
        tone="cream"
      >
        <div className="grid gap-4 lg:grid-cols-5">
          <article
            className={cn(
              "flex min-h-[320px] flex-col rounded-[2rem] p-8 lg:col-span-2",
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

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-1">
            {rest.map((pillar) => (
              <article
                key={pillar.slug}
                className={cn(
                  "flex flex-col rounded-3xl p-6 sm:min-h-[140px]",
                  toneClasses[pillar.tone],
                )}
              >
                <h3 className="font-display text-xl font-bold">{pillar.title}</h3>
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
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Our approach"
        title="How we show up in schools and communities."
        tone="surface"
      >
        <ol className="grid gap-3 sm:grid-cols-2">
          {APPROACH_STEPS.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 rounded-2xl border border-border-default bg-bg-base p-4 text-sm text-brand-navy"
            >
              <span className="font-display text-lg font-bold text-brand-magenta">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </ContentSection>

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
