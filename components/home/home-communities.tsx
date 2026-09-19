import Image from "next/image";
import Link from "next/link";
import { communityStories } from "@/features/content/mock-home";

/** “Where we work” gallery + community CTA from GGIHomepage.png. */
export function HomeCommunities({
  showIntro = true,
}: {
  showIntro?: boolean;
}) {
  return (
    <section className="bg-bg-surface px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {showIntro ? (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Where we work
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              Rural, remote &amp; underserved — first, not last.
            </h2>
          </>
        ) : null}

        <div className={showIntro ? "mt-10 grid gap-5 md:grid-cols-3" : "grid gap-5 md:grid-cols-3"}>
          {communityStories.map((story) => (
            <article key={story.id} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-blob-sky">
                <Image
                  src={story.imageSrc}
                  alt={story.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-brand-navy">
                {story.title}
              </h3>
              <p className="mt-1 text-sm text-text-muted">{story.caption}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-blob-sky/80 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="font-display text-xl font-bold text-brand-navy">
              Is your community next?
            </p>
            <p className="mt-1 text-sm text-brand-navy/80">
              Invite GGI or partner with us to bring programmes closer to girls
              who need them.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/partner"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-navy px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-navy/90"
            >
              Invite GGI
            </Link>
            <Link
              href="/partner"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-brand-navy/25 bg-bg-surface px-5 text-sm font-semibold text-brand-navy hover:border-brand-navy/40"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
