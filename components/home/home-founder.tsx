import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown, GraduationCap, Megaphone, Users } from "lucide-react";
import { founderSpotlight } from "@/features/content/mock-home";

const calloutIcons = {
  megaphone: Megaphone,
  graduation: GraduationCap,
  users: Users,
} as const;

/** Founder spotlight — matches the approved navy leadership screenshot. */
export function HomeFounder() {
  return (
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
        <div className="relative mx-auto w-full max-w-sm pb-8">
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
        </div>

        <div className="flex flex-col justify-center space-y-6 lg:space-y-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
            <Crown className="h-3.5 w-3.5" aria-hidden />
            {founderSpotlight.badge}
          </span>

          <h2 className="font-display text-3xl font-bold leading-snug sm:text-4xl">
            &ldquo;{founderSpotlight.quote}&rdquo;
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-white/80">
            {founderSpotlight.body}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {founderSpotlight.callouts.map((item) => {
              const Icon = calloutIcons[item.icon];
              return (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <Icon className="h-4 w-4 text-white/90" aria-hidden />
                  <p className="mt-3 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/65">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>

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
        </div>
      </div>
    </section>
  );
}
