import Link from "next/link";

/** Homepage shell — full design implementation is Unit 2. */
export default function HomePage() {
  return (
    <section className="bg-brand-navy text-text-on-inverse">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-medium text-brand-sky">
            Girls Global Initiative
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            Every girl,{" "}
            <span className="text-brand-magenta">everywhere,</span>{" "}
            <span className="text-brand-sky">seen,</span> heard &amp; thriving.
          </h1>
          <p className="text-base text-white/85 sm:text-lg">
            Homepage content and imagery land in the Public Website unit. This
            shell confirms brand tokens, typography, and layout foundations.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/get-involved"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-bg-surface px-5 text-sm font-medium text-brand-navy hover:bg-bg-base"
            >
              Join our mission
            </Link>
            <Link
              href="/our-story"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-medium text-text-on-inverse hover:bg-white/10"
            >
              Our story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
