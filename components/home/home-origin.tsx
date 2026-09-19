import Image from "next/image";
import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Droplets,
  Eye,
  Globe2,
  MessageCircleHeart,
  Target,
} from "lucide-react";
import { challengeTags, originCopy } from "@/features/content/mock-home";

const tagIcons = {
  calendar: Calendar,
  globe: Globe2,
  book: BookOpen,
  droplet: Droplets,
  check: CheckCircle2,
  briefcase: Briefcase,
} as const;

/** Origin section — pixel-faithful to the approved Our Origin screenshot. */
export function HomeOrigin() {
  return (
    <section className="bg-bg-base px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="relative pb-12 sm:pb-10">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-[#f3e6d8]">
            <Image
              src="/home/origin.jpg"
              alt="Community gathering in colourful patterned clothing"
              fill
              className="object-cover object-[50%_35%]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <span className="absolute left-3 top-3 z-10 inline-flex -rotate-2 items-center rounded-full bg-[#f4a44d] px-3 py-1.5 text-xs font-semibold text-brand-navy shadow-sm sm:left-4 sm:top-4">
            youth-led 🤝 from day one
          </span>

          <div className="absolute -bottom-2 right-2 z-10 max-w-[17rem] rounded-2xl bg-bg-surface p-4 shadow-[0_12px_40px_rgba(4,27,75,0.12)] sm:right-5 sm:max-w-[18.5rem]">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-magenta">
                <MessageCircleHeart
                  className="h-3.5 w-3.5 text-white"
                  aria-hidden
                />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-magenta">
                How it started
              </p>
            </div>
            <p className="text-sm leading-relaxed text-brand-navy">
              {originCopy.howItStarted}
            </p>
          </div>
        </div>

        <div className="space-y-6 lg:pt-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-magenta">
            {originCopy.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
            {originCopy.title}
          </h2>
          <p className="text-base leading-relaxed text-text-muted">
            {originCopy.body}
          </p>

          <div>
            <p className="text-sm font-bold text-brand-navy">
              {originCopy.facingLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {challengeTags.map((tag) => {
                const Icon = tagIcons[tag.icon];
                return (
                  <span
                    key={tag.label}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#f8ede3] px-3 py-2 text-sm font-medium text-brand-navy"
                  >
                    <Icon className="h-4 w-4 text-brand-navy/70" aria-hidden />
                    {tag.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#e8f1ff] p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-sky text-white">
                <Eye className="h-4 w-4" aria-hidden />
              </span>
              <p className="mt-3 font-display text-base font-bold text-brand-navy">
                Our vision
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {originCopy.vision}
              </p>
            </div>
            <div className="rounded-2xl bg-[#fff0f5] p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-magenta text-white">
                <Target className="h-4 w-4" aria-hidden />
              </span>
              <p className="mt-3 font-display text-base font-bold text-brand-navy">
                Our mission
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {originCopy.mission}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
