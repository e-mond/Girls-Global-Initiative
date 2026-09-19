"use client";

/** Segment error UI — keeps the rest of the tree usable. */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-lg px-4 py-16 text-center">
      <h2 className="font-display text-2xl font-semibold text-brand-navy">
        Something went wrong
      </h2>
      <p className="mt-3 text-sm text-text-muted">
        We could not load this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-brand-magenta px-4 text-sm font-medium text-text-on-inverse"
      >
        Try again
      </button>
    </section>
  );
}
