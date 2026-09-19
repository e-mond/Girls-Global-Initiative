import Image from "next/image";
import Link from "next/link";
import { founderSpotlight } from "@/features/content/mock-home";

/** Founder spotlight band from GGIHomepage.png. */
export function HomeFounder() {
  return (
    <section className="bg-bg-base px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand-navy text-text-on-inverse lg:grid lg:grid-cols-2">
        <div className="relative min-h-[360px] p-6 sm:p-8">
          <div className="relative mx-auto h-full min-h-[320px] max-w-sm overflow-hidden rounded-t-[999px] rounded-b-3xl bg-blob-sky">
            <Image
              src="/home/founder.jpg"
              alt={`${founderSpotlight.name}, ${founderSpotlight.role}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 40vw"
            />
          </div>
          <div className="absolute bottom-10 left-1/2 w-[min(100%,18rem)] -translate-x-1/2 rounded-2xl bg-bg-surface p-4 text-center text-brand-navy shadow-lg">
            <p className="font-display text-sm font-bold">
              {founderSpotlight.name}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {founderSpotlight.role}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-8 p-8 sm:p-10 lg:p-12">
          <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">
            &ldquo;{founderSpotlight.quote}&rdquo;
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {founderSpotlight.callouts.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
              >
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-white/75">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/founder"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-magenta px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-magenta/90"
            >
              A message from Philomena
            </Link>
            <Link
              href="/team"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 px-5 text-sm font-semibold text-text-on-inverse hover:bg-white/10"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
