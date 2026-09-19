import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { communitiesCopy, communityStories } from "@/features/content/mock-home";

/** Where we work — matches the approved centered gallery screenshot. */
export function HomeCommunities({
  showIntro = true,
}: {
  showIntro?: boolean;
}) {
  return (
    <section className="bg-bg-base px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {showIntro ? (
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-sky">
              {communitiesCopy.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {communitiesCopy.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              {communitiesCopy.body}
            </p>
          </div>
        ) : null}

        <div
          className={
            showIntro
              ? "mt-12 grid gap-5 md:grid-cols-3"
              : "grid gap-5 md:grid-cols-3"
          }
        >
          {communityStories.map((story) => (
            <article
              key={story.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-brand-navy"
            >
              <Image
                src={story.imageSrc}
                alt={story.title}
                fill
                className="object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/20 to-transparent"
              />
              {story.badge ? (
                <span className="absolute right-3 top-3 rounded-full bg-[#ffb347] px-3 py-1 text-[11px] font-semibold text-brand-navy">
                  {story.badge}
                </span>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-lg font-bold text-white">
                  {story.title}
                </h3>
                <p className="mt-1 text-sm text-white/85">{story.caption}</p>
              </div>
            </article>
          ))}
        </div>

          <div className="mt-10 flex flex-col gap-5 rounded-[1.5rem] bg-[#edf2f7] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-navy text-white">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-display text-xl font-bold text-brand-navy">
                {communitiesCopy.ctaTitle}
              </p>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-text-muted">
                {communitiesCopy.ctaBody}
              </p>
            </div>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="/partner"
              className="inline-flex h-11 min-h-11 w-full items-center justify-center rounded-full bg-brand-navy px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-navy/90 sm:w-auto"
            >
              Invite GGI
            </Link>
            <Link
              href="/partner"
              className="inline-flex h-11 min-h-11 w-full items-center justify-center rounded-full border border-brand-navy/20 bg-bg-surface px-5 text-sm font-semibold text-brand-navy hover:border-brand-navy/40 sm:w-auto"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
