import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Coins,
  Droplets,
  GraduationCap,
  Handshake,
  Heart,
  HeartHandshake,
  MessageCircleQuestion,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/layout/content-section";
import {
  GalleryShuffleBand,
  type GalleryShuffleImage,
} from "@/components/our-story/gallery-shuffle-band";
import {
  STORY_BELIEFS,
  STORY_CHALLENGES,
  STORY_HERO,
  STORY_JOURNEY,
} from "@/content/our-story";
import { OUR_STORY } from "@/content/site-copy";
import { founderSpotlight } from "@/features/content/mock-home";

const challengeIcons = {
  coins: Coins,
  heart: Heart,
  graduation: GraduationCap,
  droplets: Droplets,
  sparkles: Sparkles,
  message: MessageCircleQuestion,
} as const;

const beliefIcons = {
  users: Users,
  shield: Shield,
  handshake: Handshake,
  heartHandshake: HeartHandshake,
} as const;

export function OurStoryView({
  galleryImages = [],
}: {
  galleryImages?: GalleryShuffleImage[];
}) {
  return (
    <>
      {/* Hero — matches GGIOurStory.png split layout */}
      <section className="relative -mt-[var(--public-header-offset)] overflow-hidden bg-bg-base px-4 pb-14 pt-[calc(var(--public-header-offset)+1.75rem)] lg:px-6 lg:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-36 -top-28 h-[34rem] w-[34rem] rounded-full bg-blob-pink/90 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-16 h-[28rem] w-[28rem] rounded-full bg-blob-sky/70 blur-2xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <nav
              aria-label="Breadcrumb"
              className="text-xs font-medium text-text-muted"
            >
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-brand-navy">
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-text-muted/60">
                  /
                </li>
                <li className="text-brand-navy">Our story</li>
              </ol>
            </nav>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-magenta px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-text-on-inverse">
                {STORY_HERO.badge}
              </span>
              <span className="text-xs font-medium text-text-muted">
                {STORY_HERO.meta}
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-brand-navy sm:text-5xl">
              {STORY_HERO.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              {STORY_HERO.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/founder"
                className="inline-flex h-11 min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
              >
                Meet our founder
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex h-11 min-h-11 items-center justify-center rounded-xl border border-border-default bg-bg-surface px-5 text-sm font-semibold text-brand-navy hover:border-brand-navy/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
              >
                How you can help
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-blob-sky">
              <Image
                src="/our-story/hero.jpg"
                alt="Community celebration with girls and women"
                fill
                priority
                className="object-cover object-[50%_20%]"
                sizes="(max-width: 1024px) 90vw, 40vw"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-brand-navy/95 px-4 py-3 text-text-on-inverse shadow-lg sm:right-auto sm:max-w-[16rem]">
                <p className="text-sm font-bold">{STORY_HERO.imageCaption}</p>
                <p className="mt-1 text-[11px] font-medium text-white/75">
                  {STORY_HERO.imageTags}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Challenges */}
      <section className="bg-bg-surface px-4 py-14 lg:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              What we began
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-brand-navy sm:text-4xl">
              The challenges girls named
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              Poverty, early pregnancy, school dropout, menstrual health
              challenges, limited opportunities and missing guidance still shape
              too many girls&apos; futures — especially in rural and underserved
              communities.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <Reveal className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] lg:min-h-full">
              <Image
                src="/our-story/challenges.jpg"
                alt="Girls running and playing outdoors"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </Reveal>

            <Stagger className="grid gap-3 sm:grid-cols-2">
              {STORY_CHALLENGES.map((item) => {
                const Icon = challengeIcons[item.icon];
                return (
                  <StaggerItem key={item.title}>
                    <article className="h-full rounded-2xl border border-border-default bg-bg-base p-5 shadow-sm">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blob-pink/60 text-brand-magenta">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <h3 className="mt-3 font-display text-base font-bold text-brand-navy">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                        {item.body}
                      </p>
                    </article>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="bg-brand-navy px-4 py-14 text-text-on-inverse lg:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wide text-blob-pink">
              Our journey
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-4xl">
              From conversation to commitment
            </h2>
          </Reveal>

          <div className="relative mt-12">
            <div
              aria-hidden
              className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-brand-sky/40 via-brand-magenta/50 to-brand-sky/40 lg:block"
            />
            <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STORY_JOURNEY.map((item) => (
                <StaggerItem key={item.step}>
                  <div className="relative">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-sky to-brand-magenta text-xs font-bold text-white ring-4 ring-brand-navy">
                      {item.step}
                    </div>
                    <h3 className="font-display text-lg font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {item.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.1} className="mt-12 overflow-hidden rounded-[1.75rem]">
            <div className="relative aspect-[21/9] min-h-[12rem]">
              <Image
                src="/our-story/journey.jpg"
                alt="Girls and community members gathered together"
                fill
                className="object-cover opacity-90"
                sizes="100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-bg-base px-4 py-14 lg:px-6 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-[1.75rem] border border-border-default bg-blob-sky/45 p-7 sm:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-sky/25 text-brand-sky">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-brand-navy sm:text-2xl">
                Vision
              </h2>
              <p className="mt-3 text-base leading-relaxed text-text-muted sm:text-lg">
                {OUR_STORY.vision}
              </p>
            </article>
          </Reveal>
          <Reveal delay={0.08}>
            <article className="h-full rounded-[1.75rem] border border-border-default bg-blob-pink/50 p-7 sm:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-magenta/15 text-brand-magenta">
                <HeartHandshake className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-brand-navy sm:text-2xl">
                Mission
              </h2>
              <p className="mt-3 text-base leading-relaxed text-text-muted sm:text-lg">
                {OUR_STORY.mission}
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      {/* Founder band */}
      <section className="relative overflow-hidden bg-[#050b20] px-4 py-16 text-text-on-inverse lg:px-6 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-sky/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-brand-magenta/30 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal className="relative mx-auto w-full max-w-sm pb-8">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-3xl ring-1 ring-brand-sky/35">
              <Image
                src={founderSpotlight.imageSrc}
                alt={`${founderSpotlight.name}, ${founderSpotlight.role}`}
                fill
                className="object-cover object-[50%_12%]"
                sizes="(max-width: 1024px) 90vw, 360px"
              />
            </div>
            <div className="absolute bottom-2 left-1/2 w-[min(100%,17rem)] -translate-x-1/2 rounded-2xl bg-bg-surface px-4 py-3 text-center shadow-lg">
              <p className="font-display text-sm font-bold text-brand-navy">
                {founderSpotlight.name}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-magenta">
                {founderSpotlight.role}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-wide text-blob-pink">
              Leadership with lived understanding
            </p>
            <h2 className="font-display text-3xl font-bold leading-snug sm:text-4xl">
              &ldquo;{founderSpotlight.quote}&rdquo;
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-white/80">
              {founderSpotlight.body}
            </p>
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <Link
                href="/founder"
                className="inline-flex h-11 items-center justify-center rounded-full bg-brand-magenta px-6 text-sm font-semibold text-text-on-inverse hover:bg-brand-magenta/90"
              >
                A message from Philomena
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/85"
              >
                Meet the team
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What we believe */}
      <section className="bg-bg-base px-4 py-14 lg:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              What we believe
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-brand-navy sm:text-4xl">
              Hopeful, human, and unwilling to look away.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              {OUR_STORY.belief}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <Reveal className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] lg:min-h-full">
              <Image
                src="/our-story/values.jpg"
                alt="A girl reading outdoors"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </Reveal>

            <Stagger className="flex flex-col gap-3">
              {STORY_BELIEFS.map((item) => {
                const Icon = beliefIcons[item.icon];
                return (
                  <StaggerItem key={item.title}>
                    <article className="flex gap-4 rounded-2xl border border-border-default bg-bg-surface p-5 shadow-sm">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blob-pink/60 text-brand-magenta">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-bold text-brand-navy">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-text-muted">
                          {item.body}
                        </p>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>

          <Reveal className="mt-10">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {OUR_STORY.values.map((value) => (
                <li
                  key={value.name}
                  className="rounded-2xl border border-border-default bg-bg-surface px-4 py-3"
                >
                  <h3 className="font-display text-sm font-bold text-brand-navy">
                    {value.name}
                  </h3>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-text-muted">
              These core values guide every classroom visit and community
              conversation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Gallery shuffle mosaic */}
      <GalleryShuffleBand images={galleryImages} />

      <CtaBand
        title="Walk with us for the girls who need it most."
        description="Support GGI through giving, volunteering, partnership or advocacy — especially where support is thinnest."
        primary={{ href: "/get-involved/donate", label: "Support a girl" }}
        secondary={{ href: "/", label: "Back to home" }}
      />
    </>
  );
}
