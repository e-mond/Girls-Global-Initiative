import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Quote, Star } from "lucide-react";

/**
 * Homepage hero matching the approved design reference screenshot:
 * cream atmosphere, split Youth-led badge, magenta emphasis in the
 * headline, dual CTAs, avatar proof row, arch collage, and navy pillar bar.
 */
export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-bg-base">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-blob-pink/80 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-24 h-96 w-96 rounded-full bg-blob-sky/90 blur-2xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:items-center md:gap-10 md:pb-20 md:pt-8 lg:gap-12 lg:px-6 lg:pt-10">
        <div className="space-y-6">
          <div className="inline-flex max-w-full items-stretch overflow-hidden rounded-full border border-border-default bg-bg-surface shadow-sm">
            <span className="bg-brand-navy px-3 py-1.5 text-xs font-semibold text-text-on-inverse sm:px-4 sm:text-sm">
              Youth-led
            </span>
            <span className="px-3 py-1.5 text-xs text-text-muted sm:px-4 sm:text-sm">
              For girls in rural &amp; underserved communities
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-brand-navy sm:text-5xl lg:text-[3.25rem]">
            Every girl,{" "}
            <span className="text-brand-magenta">everywhere, seen,</span> heard
            &amp; thriving.
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
            Girls Global Initiative advances the rights, dignity, health,
            wellbeing and potential of girls , starting where support is needed
            most.
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/get-involved"
              className="inline-flex h-11 min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-navy/90 sm:w-auto"
            >
              Join our mission
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/our-story"
              className="inline-flex h-11 min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-surface px-5 text-sm font-semibold text-brand-navy hover:border-brand-navy/30 sm:w-auto"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-navy/20">
                <Play className="h-3 w-3 fill-brand-navy text-brand-navy" aria-hidden />
              </span>
              Our story in 2 min
            </Link>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2" aria-hidden>
              <span className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-bg-base">
                <Image
                  src="/home/hero-main.jpg"
                  alt=""
                  fill
                  className="object-cover object-[30%_20%]"
                  sizes="36px"
                />
              </span>
              <span className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-bg-base">
                <Image
                  src="/home/hero-little-girl.jpg"
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="36px"
                />
              </span>
              <span className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-bg-base">
                <Image
                  src="/home/hero-main.jpg"
                  alt=""
                  fill
                  className="object-cover object-[70%_35%]"
                  sizes="36px"
                />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-bg-base bg-brand-magenta text-[10px] font-bold text-text-on-inverse">
                GG
              </span>
            </div>
            <p className="max-w-[14rem] text-sm text-text-muted sm:max-w-none">
              Born from a conversation between two young women.
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="relative grid grid-cols-[1.2fr_0.9fr] gap-3 sm:gap-4">
            <div className="relative min-h-[280px] sm:min-h-[340px]">
              <div className="absolute inset-0 overflow-hidden rounded-t-[999px] rounded-b-3xl bg-blob-sky shadow-lg">
                <Image
                  src="/home/hero-main.jpg"
                  alt="Young people gathering outdoors in community"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 55vw, 320px"
                  priority
                />
              </div>
              <div className="absolute bottom-4 left-3 z-10 max-w-[11.5rem] rounded-2xl bg-bg-surface p-3 shadow-md sm:left-4 sm:max-w-[12.5rem]">
                <div className="mb-1 flex items-center gap-1.5 text-brand-magenta">
                  <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
                  <p className="text-xs font-semibold text-brand-navy">
                    Health + confidence
                  </p>
                </div>
                <p className="text-xs text-text-muted">
                  Mentorship &amp; guidance
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:gap-4 sm:pt-8">
              <div className="relative min-h-[120px] flex-[0.9] overflow-hidden rounded-2xl bg-blob-sky shadow-md sm:min-h-[140px]">
                <Image
                  src="/home/hero-little-girl.jpg"
                  alt="A schoolgirl reading a book in class"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 40vw, 220px"
                  priority
                />
              </div>
              <div className="relative flex flex-[1.1] flex-col justify-between overflow-hidden rounded-2xl bg-brand-navy p-4 text-text-on-inverse shadow-md sm:p-5">
                <div
                  aria-hidden
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-magenta/30"
                />
                <div
                  aria-hidden
                  className="absolute -right-2 top-10 h-16 w-16 rounded-full bg-brand-sky/25"
                />
                <Quote
                  className="relative h-5 w-5 text-text-on-inverse/80"
                  aria-hidden
                />
                <p className="relative mt-3 font-display text-base font-semibold leading-snug sm:text-lg">
                  &ldquo;Around girls&apos; empowerment, education and
                  advocacy.&rdquo;
                </p>
                <p className="relative mt-4 text-xs text-white/70">
                  Why GGI was created
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-navy text-text-on-inverse">
        <ul className="mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:px-6 lg:py-5">
          {[
            "Advancing rights & dignity",
            "Health & wellbeing",
            "Education & confidence",
            "Mentorship & opportunities",
          ].map((label) => (
            <li
              key={label}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-magenta"
              />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
