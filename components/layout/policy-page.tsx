import type { ReactNode } from "react";
import {
  POLICY_LAST_UPDATED_ISO,
  POLICY_LAST_UPDATED_LABEL,
} from "@/content/policy-meta";

/** Shared prose shell for public policy / legal pages. */
export function PolicyPage({
  title,
  intro,
  lastUpdated = POLICY_LAST_UPDATED_LABEL,
  lastUpdatedIso = POLICY_LAST_UPDATED_ISO,
  children,
}: {
  title: string;
  intro: string;
  lastUpdated?: string;
  lastUpdatedIso?: string;
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
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-brand-navy">Last updated:</span>{" "}
          <time dateTime={lastUpdatedIso}>{lastUpdated}</time>
        </p>
        <p className="text-base leading-relaxed text-text-muted sm:text-lg">
          {intro}
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
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-bold text-brand-navy">
        {title}
      </h2>
      {children}
    </section>
  );
}
