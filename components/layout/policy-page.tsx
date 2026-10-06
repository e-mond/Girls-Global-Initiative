import type { ReactNode } from "react";

/** Shared prose shell for public policy / legal pages. */
export function PolicyPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-4 border-b border-border-default pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">
          Legal and policy
        </p>
        <h1 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-text-muted sm:text-lg">
          {intro}
        </p>
        <p className="rounded-xl border border-border-default bg-bg-surface px-4 py-3 text-sm text-brand-navy">
          <span className="font-semibold">Status:</span> Official wording for
          several sections is{" "}
          <span className="font-semibold">
            awaiting official GGI confirmation
          </span>
          . This page describes how the website works today and what still
          needs organisational approval. It is not a claim of legal advice or
          verified regulatory compliance.
        </p>
      </header>
      <div className="prose-policy mt-10 space-y-8 text-sm leading-relaxed text-text-muted sm:text-base">
        {children}
      </div>
    </article>
  );
}

export function PolicySection({
  title,
  children,
  awaiting = false,
}: {
  title: string;
  children: ReactNode;
  awaiting?: boolean;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-bold text-brand-navy">
        {title}
      </h2>
      {awaiting ? (
        <p className="rounded-lg bg-bg-sky/40 px-3 py-2 text-sm text-brand-navy">
          Awaiting official GGI confirmation
        </p>
      ) : null}
      {children}
    </section>
  );
}
