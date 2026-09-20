import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  Prose,
} from "@/components/layout/content-section";
import { FOUNDER_MESSAGE } from "@/content/site-copy";
import { founderSpotlight } from "@/features/content/mock-home";

export default function FounderPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Founder"
        title={founderSpotlight.name}
        description={founderSpotlight.role}
      />

      <ContentSection tone="surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-t-[999px] rounded-b-3xl bg-blob-sky">
            <Image
              src={founderSpotlight.imageSrc}
              alt={founderSpotlight.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 40vw"
            />
          </div>
          <div className="space-y-6">
            <p className="font-display text-2xl font-bold text-brand-navy sm:text-3xl">
              &ldquo;{founderSpotlight.quote}&rdquo;
            </p>
            <p className="text-base leading-relaxed text-text-muted">
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
            <Link
              href="/team"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-navy px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-navy/90"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Message from the Founder"
        title="Every girl deserves the opportunity to dream, learn, grow and lead."
        tone="base"
        narrow
      >
        <Prose>
          {FOUNDER_MESSAGE.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </Prose>
        <p className="mt-8 font-display text-lg font-semibold text-brand-navy">
          {FOUNDER_MESSAGE.signatureName}
        </p>
        <p className="text-sm text-text-muted">
          {FOUNDER_MESSAGE.signatureRole}
        </p>
      </ContentSection>
    </>
  );
}
