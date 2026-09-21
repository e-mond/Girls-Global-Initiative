import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  PageBadgeRow,
  PageBreadcrumb,
} from "@/components/layout/editorial";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type Cta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "onDark";
};

const heroBleed =
  "relative -mt-[var(--public-header-offset)] overflow-hidden px-4 pb-14 pt-[calc(var(--public-header-offset)+2rem)] lg:px-6 lg:pb-20";

function CtaGroup({ ctas, onDark = false }: { ctas?: Cta[]; onDark?: boolean }) {
  if (!ctas?.length) {
    return null;
  }
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {ctas.map((cta) => {
        const variant = cta.variant ?? "primary";
        return (
          <Link
            key={cta.href + cta.label}
            href={cta.href}
            className={cn(
              "inline-flex h-11 min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky",
              variant === "primary" &&
                "bg-brand-navy text-text-on-inverse hover:bg-brand-navy/90",
              variant === "secondary" &&
                (onDark
                  ? "border border-white/30 text-text-on-inverse hover:border-brand-sky hover:text-brand-sky"
                  : "border border-border-default bg-bg-surface text-brand-navy hover:border-brand-navy/30"),
              variant === "onDark" &&
                "bg-brand-magenta text-text-on-inverse hover:bg-brand-magenta/90",
            )}
          >
            {cta.label}
          </Link>
        );
      })}
    </div>
  );
}

/** Editorial / colour page opening. Bleeds under sticky nav so colours sync. */
export function PageHeroEditorial({
  eyebrow,
  title,
  description,
  ctas,
  children,
  tone = "cream",
  ambient = "default",
  breadcrumb,
  badge,
  meta,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  ctas?: Cta[];
  children?: ReactNode;
  tone?: "cream" | "navy" | "sky" | "blush";
  /** `flat` skips gradient blobs (e.g. What we do cream sync). */
  ambient?: "default" | "flat";
  breadcrumb?: string;
  badge?: string;
  meta?: string;
}) {
  const onDark = tone === "navy";
  const showPink =
    ambient === "default" && (tone === "cream" || tone === "blush");
  const showSky =
    ambient === "default" && (tone === "cream" || tone === "sky");

  return (
    <section
      className={cn(
        heroBleed,
        tone === "cream" && "bg-bg-base text-brand-navy",
        tone === "navy" && "bg-brand-navy text-text-on-inverse",
        tone === "sky" && "bg-blob-sky/40 text-brand-navy",
        tone === "blush" && "bg-blob-pink/40 text-brand-navy",
      )}
    >
      {showPink ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -left-36 -top-28 h-[34rem] w-[34rem] rounded-full bg-blob-pink/90 blur-2xl"
        />
      ) : null}
      {tone === "sky" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-blob-sky/25"
        />
      ) : null}
      {showSky ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-[28rem] w-[28rem] rounded-full bg-blob-sky/75 blur-2xl"
        />
      ) : null}
      <Reveal className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl">
          {breadcrumb ? (
            <PageBreadcrumb current={breadcrumb} onDark={onDark} />
          ) : null}
          {badge ? (
            <PageBadgeRow badge={badge} meta={meta} onDark={onDark} />
          ) : eyebrow ? (
            <p
              className={cn(
                breadcrumb ? "mt-5" : "",
                "text-xs font-bold uppercase tracking-wide",
                onDark ? "text-blob-pink" : "text-brand-magenta",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              "mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl",
              onDark ? "text-text-on-inverse" : "text-brand-navy",
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "mt-4 text-base leading-relaxed sm:text-lg",
              onDark ? "text-white/80" : "text-text-muted",
            )}
          >
            {description}
          </p>
          <CtaGroup ctas={ctas} onDark={onDark} />
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Reveal>
    </section>
  );
}

/** Compact section-style header for form-heavy or utility pages. */
export function PageHeroCompact({
  eyebrow,
  title,
  description,
  children,
  breadcrumb,
  badge,
  meta,
  ctas,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
  breadcrumb?: string;
  badge?: string;
  meta?: string;
  ctas?: Cta[];
}) {
  return (
    <section
      className={cn(
        heroBleed,
        "bg-bg-base pb-10 pt-[calc(var(--public-header-offset)+1.5rem)] lg:pb-14",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-36 -top-28 h-[30rem] w-[30rem] rounded-full bg-blob-pink/90 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-8 h-[22rem] w-[22rem] rounded-full bg-blob-sky/60 blur-2xl"
      />
      <Reveal className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl">
          {breadcrumb ? <PageBreadcrumb current={breadcrumb} /> : null}
          {badge ? (
            <PageBadgeRow badge={badge} meta={meta} />
          ) : eyebrow ? (
            <p
              className={cn(
                breadcrumb ? "mt-5" : "",
                "text-xs font-bold uppercase tracking-wide text-brand-magenta",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 font-display text-2xl font-bold text-brand-navy sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            {description}
          </p>
          <CtaGroup ctas={ctas} />
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </Reveal>
    </section>
  );
}

/** Split text + photography opening. */
export function PageHeroSplit({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  imageShape = "rounded",
  ctas,
  children,
  reverse = false,
  breadcrumb,
  badge,
  meta,
  imageCaption,
  imageTags,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageShape?: "rounded" | "arch";
  ctas?: Cta[];
  children?: ReactNode;
  reverse?: boolean;
  breadcrumb?: string;
  badge?: string;
  meta?: string;
  imageCaption?: string;
  imageTags?: string;
}) {
  return (
    <section className={cn(heroBleed, "bg-bg-base")}>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-36 -top-28 h-[34rem] w-[34rem] rounded-full bg-blob-pink/90 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-16 h-[28rem] w-[28rem] rounded-full bg-blob-sky/70 blur-2xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal className={cn(reverse && "lg:order-2")}>
          {breadcrumb ? <PageBreadcrumb current={breadcrumb} /> : null}
          {badge ? (
            <PageBadgeRow badge={badge} meta={meta} />
          ) : eyebrow ? (
            <p
              className={cn(
                breadcrumb ? "mt-5" : "",
                "text-xs font-bold uppercase tracking-wide text-brand-magenta",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-brand-navy sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
            {description}
          </p>
          <CtaGroup ctas={ctas} />
          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
        <Reveal delay={0.12} className={cn("relative", reverse && "lg:order-1")}>
          <div
            className={cn(
              "relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-blob-sky",
              imageShape === "arch"
                ? "rounded-t-[999px] rounded-b-3xl"
                : "rounded-[2rem]",
            )}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 40vw"
            />
            {imageCaption ? (
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-brand-navy/95 px-4 py-3 text-text-on-inverse shadow-lg sm:right-auto sm:max-w-[16rem]">
                <p className="text-sm font-bold">{imageCaption}</p>
                {imageTags ? (
                  <p className="mt-1 text-[11px] font-medium text-white/75">
                    {imageTags}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Photography-forward opening with overlay copy. */
export function PageHeroPhoto({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  ctas,
  breadcrumb,
  badge,
  meta,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  ctas?: Cta[];
  breadcrumb?: string;
  badge?: string;
  meta?: string;
}) {
  return (
    <section className="relative -mt-[var(--public-header-offset)] overflow-hidden">
      <div className="relative min-h-[24rem] sm:min-h-[30rem]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/70 to-brand-navy/35"
        />
        <div className="relative px-4 pb-12 pt-[calc(var(--public-header-offset)+2rem)] sm:min-h-[30rem] lg:px-6 lg:pb-16">
          <div className="mx-auto flex min-h-[18rem] max-w-6xl items-end sm:min-h-[22rem]">
            <Reveal className="max-w-2xl text-text-on-inverse">
              {breadcrumb ? (
                <nav
                  aria-label="Breadcrumb"
                  className="text-xs font-medium text-white/70"
                >
                  <ol className="flex flex-wrap items-center gap-1.5">
                    <li>
                      <Link href="/" className="hover:text-white">
                        Home
                      </Link>
                    </li>
                    <li aria-hidden>/</li>
                    <li className="text-white">{breadcrumb}</li>
                  </ol>
                </nav>
              ) : null}
              {badge ? (
                <PageBadgeRow badge={badge} meta={meta} onDark />
              ) : eyebrow ? (
                <p
                  className={cn(
                    breadcrumb ? "mt-5" : "",
                    "text-xs font-bold uppercase tracking-wide text-blob-pink",
                  )}
                >
                  {eyebrow}
                </p>
              ) : null}
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                {description}
              </p>
              <CtaGroup ctas={ctas} onDark />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Backward-compatible alias used by existing pages until migrated. */
export function PublicPageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <PageHeroEditorial
      eyebrow={eyebrow}
      title={title}
      description={description}
    >
      {children}
    </PageHeroEditorial>
  );
}
