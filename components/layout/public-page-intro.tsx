import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Cta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "onDark";
};

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

/** Editorial / colour page opening — soft blobs, no required photo. */
export function PageHeroEditorial({
  eyebrow,
  title,
  description,
  ctas,
  children,
  tone = "cream",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  ctas?: Cta[];
  children?: ReactNode;
  tone?: "cream" | "navy" | "sky" | "blush";
}) {
  const onDark = tone === "navy";
  return (
    <section
      className={cn(
        "relative overflow-hidden px-4 py-14 lg:px-6 lg:py-20",
        tone === "cream" && "bg-bg-base text-brand-navy",
        tone === "navy" && "bg-brand-navy text-text-on-inverse",
        tone === "sky" && "bg-blob-sky/40 text-brand-navy",
        tone === "blush" && "bg-blob-pink/40 text-brand-navy",
      )}
    >
      {tone === "cream" ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blob-pink/70 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-blob-sky/80 blur-2xl"
          />
        </>
      ) : null}
      <div className="relative mx-auto max-w-3xl">
        {eyebrow ? (
          <p
            className={cn(
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
    </section>
  );
}

/** Compact section-style header for form-heavy or utility pages. */
export function PageHeroCompact({
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
    <section className="bg-bg-base px-4 py-10 lg:px-6 lg:py-14">
      <div className="mx-auto max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 font-display text-2xl font-bold text-brand-navy sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-text-muted">
          {description}
        </p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
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
}) {
  return (
    <section className="relative overflow-hidden bg-bg-base px-4 py-14 lg:px-6 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blob-pink/60 blur-2xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className={cn(reverse && "lg:order-2")}>
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
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
        </div>
        <div className={cn("relative", reverse && "lg:order-1")}>
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
          </div>
        </div>
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
}: {
  eyebrow?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  ctas?: Cta[];
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[22rem] sm:min-h-[28rem]">
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
        <div className="relative mx-auto flex min-h-[22rem] max-w-6xl items-end px-4 py-12 sm:min-h-[28rem] lg:px-6 lg:py-16">
          <div className="max-w-2xl text-text-on-inverse">
            {eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-wide text-blob-pink">
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
