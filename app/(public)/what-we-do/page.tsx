import Link from "next/link";
import { HomePillars } from "@/components/home/home-pillars";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { ContentSection } from "@/components/layout/content-section";
import { APPROACH_STEPS, FOCUS_AREAS } from "@/content/site-copy";

export default function WhatWeDoPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="What we do"
        title="Four ways we walk alongside girls."
        description="GGI organises its work around rights and dignity, health and wellbeing, confidence and growth, and mentorship and opportunity — using a community-centred, girl-focused and empowerment-driven approach."
      />

      <HomePillars showIntro={false} />

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
        description="These focus areas from GGI's organisational narrative map into the four pillars above and into the programmes and projects detailed on our Programmes page."
        tone="base"
      >
        <ul className="grid gap-4 lg:grid-cols-2">
          {FOCUS_AREAS.map((area) => (
            <li
              key={area.title}
              className="rounded-3xl border border-border-default bg-bg-surface p-6"
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
          Explore how programmes and projects bring this work to life on{" "}
          <Link href="/programmes" className="font-semibold text-brand-sky hover:underline">
            Programmes &amp; projects
          </Link>
          .
        </p>
      </ContentSection>
    </>
  );
}
