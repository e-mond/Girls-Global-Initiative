import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { founderSpotlight } from "@/features/content/mock-home";

export default function FounderPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Founder"
        title={founderSpotlight.name}
        description={founderSpotlight.role}
      />
      <section className="bg-bg-surface px-4 pb-16 lg:px-6 lg:pb-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start">
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
              Leadership biography and message content will be CMS-managed. This
              page follows the approved founder spotlight structure from the
              homepage reference without inventing additional claims.
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
      </section>
    </>
  );
}
