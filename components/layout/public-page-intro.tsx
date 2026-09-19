import type { ReactNode } from "react";

/** Shared public editorial page chrome matching homepage rhythm. */
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
    <section className="bg-bg-base px-4 py-14 lg:px-6 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 font-display text-4xl font-bold text-brand-navy sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
          {description}
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
