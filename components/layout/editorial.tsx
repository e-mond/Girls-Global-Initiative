import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Shared breadcrumb used across editorial public pages. */
export function PageBreadcrumb({
  current,
  parents = [{ href: "/", label: "Home" }],
  onDark = false,
}: {
  current: string;
  parents?: { href: string; label: string }[];
  onDark?: boolean;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "text-xs font-medium",
        onDark ? "text-white/70" : "text-text-muted",
      )}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {parents.map((item) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <Link
              href={item.href}
              className={onDark ? "hover:text-white" : "hover:text-brand-navy"}
            >
              {item.label}
            </Link>
            <span
              aria-hidden
              className={onDark ? "text-white/40" : "text-text-muted/60"}
            >
              /
            </span>
          </li>
        ))}
        <li className={onDark ? "text-white" : "text-brand-navy"}>{current}</li>
      </ol>
    </nav>
  );
}

export function PageBadgeRow({
  badge,
  meta,
  onDark = false,
}: {
  badge: string;
  meta?: string;
  onDark?: boolean;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span
        className={cn(
          "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
          onDark
            ? "bg-brand-magenta text-text-on-inverse"
            : "bg-brand-magenta text-text-on-inverse",
        )}
      >
        {badge}
      </span>
      {meta ? (
        <span
          className={cn(
            "text-xs font-medium",
            onDark ? "text-white/70" : "text-text-muted",
          )}
        >
          {meta}
        </span>
      ) : null}
    </div>
  );
}

/** Icon + title + body cards (challenges / beliefs / how-to patterns). */
export function IconFeatureGrid({
  items,
  columns = 3,
}: {
  items: { title: string; body: string; icon: LucideIcon }[];
  columns?: 2 | 3;
}) {
  return (
    <Stagger
      className={cn(
        "grid gap-3",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <StaggerItem key={item.title}>
            <article className="h-full rounded-2xl border border-border-default bg-bg-base p-5 shadow-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blob-pink/60 text-brand-magenta">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-brand-navy">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                {item.body}
              </p>
            </article>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

/** Horizontal numbered steps on navy (journey / approach pattern). */
export function ProcessBand({
  eyebrow,
  title,
  description,
  steps,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  steps: { step: string; title: string; body: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="bg-brand-navy px-4 py-14 text-text-on-inverse lg:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wide text-blob-pink">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-white/75">
              {description}
            </p>
          ) : null}
        </Reveal>

        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-brand-sky/40 via-brand-magenta/50 to-brand-sky/40 lg:block"
          />
          <Stagger
            className={cn(
              "grid gap-8",
              steps.length === 3 && "sm:grid-cols-3",
              steps.length === 4 && "sm:grid-cols-2 lg:grid-cols-4",
              steps.length >= 5 && "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {steps.map((item) => (
              <StaggerItem key={item.step}>
                <div className="relative">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-sky to-brand-magenta text-xs font-bold text-white ring-4 ring-brand-navy">
                    {item.step}
                  </div>
                  <h3 className="font-display text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {item.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Two equal highlight cards (vision/mission style). */
export function DualToneCards({
  left,
  right,
}: {
  left: { label: string; body: string; icon: LucideIcon; tone: "sky" | "pink" };
  right: { label: string; body: string; icon: LucideIcon; tone: "sky" | "pink" };
}) {
  const cards = [left, right];
  return (
    <section className="bg-bg-base px-4 py-14 lg:px-6 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const sky = card.tone === "sky";
          return (
            <Reveal key={card.label} delay={index * 0.08}>
              <article
                className={cn(
                  "h-full rounded-[1.75rem] border border-border-default p-7 sm:p-8",
                  sky ? "bg-blob-sky/45" : "bg-blob-pink/50",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-xl",
                    sky
                      ? "bg-brand-sky/25 text-brand-sky"
                      : "bg-brand-magenta/15 text-brand-magenta",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-brand-navy sm:text-2xl">
                  {card.label}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-text-muted sm:text-lg">
                  {card.body}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/** Full-bleed rounded photo strip. */
export function PhotoBand({
  src,
  alt,
  aspect = "wide",
}: {
  src: string;
  alt: string;
  aspect?: "wide" | "cinema";
}) {
  return (
    <section className="bg-bg-surface px-4 py-10 lg:px-6">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem]">
        <div
          className={cn(
            "relative min-h-[10rem]",
            aspect === "wide" ? "aspect-[21/8]" : "aspect-[21/9]",
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </Reveal>
    </section>
  );
}

/** Stacked belief/value rows beside an image. */
export function MediaBeliefSplit({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  items,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  items: { title: string; body: string; icon: LucideIcon }[];
}) {
  return (
    <section className="bg-bg-base px-4 py-14 lg:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-brand-navy sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              {description}
            </p>
          ) : null}
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <Reveal className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] lg:min-h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </Reveal>
          <Stagger className="flex flex-col gap-3">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.title}>
                  <article className="flex gap-4 rounded-2xl border border-border-default bg-bg-surface p-5 shadow-sm">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blob-pink/60 text-brand-magenta">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-brand-navy">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-text-muted">
                        {item.body}
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
