import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { getInvolvedCards } from "@/features/content/mock-home";
import { cn } from "@/lib/utils";

const toneClasses = {
  magenta: "bg-brand-magenta text-text-on-inverse",
  navy: "bg-brand-navy text-text-on-inverse",
  sky: "bg-brand-sky text-text-on-inverse",
} as const;

const buttonClasses = {
  magenta: "bg-bg-surface text-brand-magenta hover:bg-bg-base",
  navy: "bg-bg-surface text-brand-navy hover:bg-bg-base",
  sky: "bg-bg-surface text-brand-sky hover:bg-bg-base",
} as const;

/** Get involved card trio from GGIHomepage.png. */
export function HomeGetInvolved() {
  return (
    <section className="bg-bg-base px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-xl font-display text-3xl font-bold text-brand-navy sm:text-4xl">
            There&apos;s a place for you in her story.
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          {getInvolvedCards.map((card) => (
            <StaggerItem key={card.href}>
              <article
                className={cn(
                  "flex min-h-[240px] flex-col rounded-3xl p-6",
                  toneClasses[card.tone],
                )}
              >
                <h3 className="font-display text-2xl font-bold">{card.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/90">
                  {card.body}
                </p>
                <Link
                  href={card.href}
                  className={cn(
                    "mt-6 inline-flex h-10 w-fit items-center justify-center rounded-xl px-4 text-sm font-semibold",
                    buttonClasses[card.tone],
                  )}
                >
                  {card.cta}
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
