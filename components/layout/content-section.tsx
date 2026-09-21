import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ContentTone =
  | "base"
  | "surface"
  | "navy"
  | "sky"
  | "blush"
  | "cream";

/** Reusable content band for public editorial pages (not the homepage). */
export function ContentSection({
  eyebrow,
  title,
  description,
  children,
  tone = "base",
  narrow = false,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  tone?: ContentTone;
  narrow?: boolean;
}) {
  const toneClass =
    tone === "surface"
      ? "bg-bg-surface text-brand-navy"
      : tone === "navy"
        ? "bg-brand-navy text-text-on-inverse"
        : tone === "sky"
          ? "bg-blob-sky/35 text-brand-navy"
          : tone === "blush"
            ? "bg-blob-pink/40 text-brand-navy"
            : tone === "cream"
              ? "bg-bg-base text-brand-navy"
              : "bg-bg-base text-brand-navy";

  return (
    <section className={cn("px-4 py-14 lg:px-6 lg:py-20", toneClass)}>
      <div className={cn("mx-auto", narrow ? "max-w-3xl" : "max-w-6xl")}>
        {eyebrow ? (
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-wide",
              tone === "navy" ? "text-blob-pink" : "text-brand-magenta",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2
            className={cn(
              "mt-3 font-display text-2xl font-bold sm:text-4xl",
              tone === "navy" ? "text-text-on-inverse" : "text-brand-navy",
            )}
          >
            {title}
          </h2>
        ) : null}
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-3xl text-base leading-relaxed",
              tone === "navy" ? "text-white/80" : "text-text-muted",
            )}
          >
            {description}
          </p>
        ) : null}
        {children ? (
          <div className={cn(title || description ? "mt-8" : "")}>{children}</div>
        ) : null}
      </div>
    </section>
  );
}

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-4 text-base leading-relaxed text-text-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Highlighted quote / belief band. */
export function QuoteBand({
  quote,
  attribution,
  tone = "navy",
}: {
  quote: string;
  attribution?: string;
  tone?: "navy" | "blush";
}) {
  return (
    <ContentSection tone={tone === "blush" ? "blush" : "navy"} narrow>
      <blockquote className="font-display text-2xl font-bold leading-snug sm:text-3xl">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {attribution ? (
        <p
          className={cn(
            "mt-6 text-sm font-medium",
            tone === "navy" ? "text-white/70" : "text-text-muted",
          )}
        >
          {attribution}
        </p>
      ) : null}
    </ContentSection>
  );
}

/** Closing CTA strip. */
export function CtaBand({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  tone = "navy",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  tone?: "navy" | "sky" | "blush";
}) {
  return (
    <ContentSection
      eyebrow={eyebrow}
      title={title}
      description={description}
      tone={tone}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={primary.href}
          className={cn(
            "inline-flex h-11 min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold",
            tone === "navy"
              ? "bg-brand-magenta text-text-on-inverse hover:bg-brand-magenta/90"
              : "bg-brand-navy text-text-on-inverse hover:bg-brand-navy/90",
          )}
        >
          {primary.label}
        </Link>
        {secondary ? (
          <Link
            href={secondary.href}
            className={cn(
              "inline-flex h-11 min-h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold",
              tone === "navy"
                ? "border-white/30 text-text-on-inverse hover:border-brand-sky hover:text-brand-sky"
                : "border-border-default bg-bg-surface text-brand-navy hover:border-brand-navy/30",
            )}
          >
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </ContentSection>
  );
}

/** Related destinations strip for contextual secondary navigation. */
export function RelatedLinks({
  title = "Continue exploring",
  links,
}: {
  title?: string;
  links: readonly { href: string; label: string; description?: string }[];
}) {
  return (
    <ContentSection eyebrow="Related" title={title} tone="surface">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex h-full flex-col rounded-3xl border border-border-default bg-bg-base p-5 transition-colors hover:border-brand-sky/50"
            >
              <span className="font-display text-lg font-bold text-brand-navy">
                {link.label}
              </span>
              {link.description ? (
                <span className="mt-2 text-sm leading-relaxed text-text-muted">
                  {link.description}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </ContentSection>
  );
}
