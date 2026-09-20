import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
  tone?: "base" | "surface" | "navy";
  narrow?: boolean;
}) {
  const toneClass =
    tone === "surface"
      ? "bg-bg-surface text-brand-navy"
      : tone === "navy"
        ? "bg-brand-navy text-text-on-inverse"
        : "bg-bg-base text-brand-navy";

  return (
    <section className={cn("px-4 py-14 lg:px-6 lg:py-20", toneClass)}>
      <div
        className={cn(
          "mx-auto",
          narrow ? "max-w-3xl" : "max-w-6xl",
        )}
      >
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
        {children ? <div className={cn(title || description ? "mt-8" : "")}>{children}</div> : null}
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
