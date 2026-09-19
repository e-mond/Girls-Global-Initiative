import Image from "next/image";
import { Heart } from "lucide-react";
import { challengeTags } from "@/features/content/mock-home";

/** Origin section — layout and copy structure from GGIHomepage.png. */
export function HomeOrigin() {
  return (
    <section className="bg-bg-base px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-blob-pink">
            <Image
              src="/home/origin.jpg"
              alt="Community gathering in colourful patterned clothing"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-6 right-4 max-w-xs rounded-2xl bg-bg-surface p-4 shadow-lg sm:right-8">
            <div className="mb-2 flex items-center gap-2 text-brand-magenta">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-magenta/10">
                <Heart className="h-4 w-4 fill-brand-magenta" aria-hidden />
              </span>
              <p className="text-xs font-bold uppercase tracking-wide">
                How it started
              </p>
            </div>
            <p className="text-sm text-brand-navy">
              A conversation between two young women who saw girls in their
              communities being left behind.
            </p>
          </div>
        </div>

        <div className="space-y-6 pt-8 lg:pt-0">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
            Our origin
          </p>
          <h2 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
            Born from listening. Built around girls.
          </h2>
          <p className="text-base leading-relaxed text-text-muted">
            GGI grew from listening to the risks facing girls in rural, remote
            and underserved communities — and organising a response around
            rights, health, confidence and mentorship.
          </p>

          <div className="flex flex-wrap gap-2">
            {challengeTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border-default bg-bg-surface px-3 py-1.5 text-xs font-medium text-brand-navy"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-blob-sky/70 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                Our vision
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-navy/90">
                A world where every girl is seen, heard and able to thrive —
                starting where support is needed most.
              </p>
            </div>
            <div className="rounded-2xl bg-blob-pink/80 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                Our mission
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-navy/90">
                Advance the rights, dignity, health, wellbeing and education of
                girls through community-rooted programmes and advocacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
