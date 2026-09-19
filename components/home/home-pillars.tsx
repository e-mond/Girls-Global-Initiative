import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pillars, type Pillar } from "@/features/content/mock-home";
import { cn } from "@/lib/utils";

const toneClasses: Record<Pillar["tone"], string> = {
  navy: "bg-brand-navy text-text-on-inverse",
  magenta: "bg-brand-magenta text-text-on-inverse",
  sky: "bg-brand-sky text-text-on-inverse",
  cream: "bg-[#f3e6d8] text-brand-navy",
};

/** Four-pillar strip matching GGIHomepage.png “What we do”. */
export function HomePillars({
  showIntro = true,
}: {
  showIntro?: boolean;
}) {
  return (
    <section className="bg-bg-surface px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {showIntro ? (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              What we do
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              Four ways we walk alongside girls.
            </h2>
          </>
        ) : null}

        <div className={showIntro ? "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"}>
          {pillars.map((pillar) => (
            <article
              key={pillar.slug}
              className={cn(
                "flex min-h-[280px] flex-col rounded-3xl p-6",
                toneClasses[pillar.tone],
              )}
            >
              <h3 className="font-display text-xl font-bold">{pillar.title}</h3>
              <p
                className={cn(
                  "mt-3 flex-1 text-sm leading-relaxed",
                  pillar.tone === "cream" ? "text-brand-navy/80" : "text-white/85",
                )}
              >
                {pillar.description}
              </p>
              <Link
                href={`/what-we-do/${pillar.slug}`}
                className={cn(
                  "mt-6 inline-flex items-center gap-2 text-sm font-semibold",
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
    </section>
  );
}
