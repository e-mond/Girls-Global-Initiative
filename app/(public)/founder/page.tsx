import Image from "next/image";
import Link from "next/link";
import { PageHeroSplit } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
  Prose,
  QuoteBand,
} from "@/components/layout/content-section";
import { FOUNDER_MESSAGE } from "@/content/site-copy";
import { founderSpotlight } from "@/features/content/mock-home";

export default function FounderPage() {
  return (
    <>
      <PageHeroSplit
        eyebrow="Founder & Executive Director"
        title={founderSpotlight.name}
        description={founderSpotlight.role}
        imageSrc={founderSpotlight.imageSrc}
        imageAlt={founderSpotlight.name}
        imageShape="arch"
        ctas={[
          { href: "/team", label: "Meet the team", variant: "secondary" },
          { href: "/get-involved", label: "Support the mission" },
        ]}
      >
        <p className="font-display text-xl font-bold text-brand-navy sm:text-2xl">
          &ldquo;{founderSpotlight.quote}&rdquo;
        </p>
      </PageHeroSplit>

      <ContentSection tone="surface">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-text-muted sm:text-lg">
              {founderSpotlight.body}
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {founderSpotlight.callouts.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border-default bg-bg-base p-4"
                >
                  <p className="text-sm font-semibold text-brand-navy">
                    {item.title}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-3xl border border-border-default bg-blob-sky/30 p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Leadership
            </p>
            <p className="mt-3 font-display text-lg font-bold text-brand-navy">
              Youth-led. Community-rooted. Girls first.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Philomena leads GGI so girls do not have to navigate rights,
              health, school and opportunity alone.
            </p>
            <Link
              href="/our-story"
              className="mt-5 inline-flex text-sm font-semibold text-brand-sky hover:underline"
            >
              Read our story
            </Link>
          </aside>
        </div>
      </ContentSection>

      <QuoteBand
        quote="Every girl deserves the opportunity to dream, learn, grow, lead and build a meaningful future."
        attribution={FOUNDER_MESSAGE.signatureName}
        tone="blush"
      />

      <ContentSection
        eyebrow="Message from the Founder"
        title="Closing the gap where barriers are greatest."
        tone="cream"
        narrow
      >
        <Prose>
          {FOUNDER_MESSAGE.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </Prose>
        <div className="mt-10 flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-full">
            <Image
              src={founderSpotlight.imageSrc}
              alt=""
              fill
              className="object-cover object-top"
              sizes="56px"
            />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-brand-navy">
              {FOUNDER_MESSAGE.signatureName}
            </p>
            <p className="text-sm text-text-muted">
              {FOUNDER_MESSAGE.signatureRole}
            </p>
          </div>
        </div>
      </ContentSection>

      <CtaBand
        title="Stand with the girls GGI serves."
        primary={{ href: "/get-involved/donate", label: "Support a girl" }}
        secondary={{ href: "/team", label: "Meet the team" }}
      />
    </>
  );
}
