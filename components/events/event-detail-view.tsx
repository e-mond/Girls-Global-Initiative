import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import { AddToCalendar } from "@/components/events/add-to-calendar";
import { CtaBand } from "@/components/layout/content-section";
import { PageBreadcrumb } from "@/components/layout/editorial";
import { Reveal } from "@/components/motion/reveal";
import { ShareButtons } from "@/components/news/share-buttons";
import type { PublicEventItem } from "@/features/content/public-content";

function bodyParagraphs(body: string) {
  return body
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function EventDetailView({ event }: { event: PublicEventItem }) {
  const paragraphs = bodyParagraphs(event.body);
  const host = event.hostLabel?.trim() || "Girls Global Initiative";
  const whenLabel = [event.startsOn, event.endsOn].filter(Boolean).join(" · ");

  return (
    <>
      <section className="relative -mt-[var(--public-header-offset)] overflow-hidden bg-brand-navy text-text-on-inverse">
        <div className="absolute inset-0">
          {event.imageSrc ? (
            <Image
              src={event.imageSrc}
              alt=""
              fill
              priority
              className="object-cover opacity-45"
              sizes="100vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand-navy via-brand-navy to-brand-magenta/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/80 to-brand-navy/55" />
        </div>

        <Reveal className="relative mx-auto max-w-6xl px-4 pb-14 pt-[calc(var(--public-header-offset)+2rem)] lg:px-6 lg:pb-16">
          <PageBreadcrumb current="Events" onDark />
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-brand-magenta px-3 py-1 text-xs font-bold uppercase tracking-wide text-text-on-inverse">
              Event
            </span>
            {whenLabel ? (
              <span className="text-sm font-medium text-white/85">{whenLabel}</span>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.25rem]">
            {event.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {event.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#event-details"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-magenta px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-magenta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
            >
              View details
            </Link>
            <Link
              href="/events"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 px-5 text-sm font-semibold text-text-on-inverse hover:border-brand-sky hover:text-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
            >
              All events
            </Link>
          </div>
        </Reveal>
      </section>

      <section
        id="event-details"
        className="scroll-mt-28 bg-bg-base px-4 py-10 lg:px-6 lg:py-12"
      >
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            {event.imageSrc ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-surface shadow-sm">
                <Image
                  src={event.imageSrc}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 640px"
                />
              </div>
            ) : null}

            <article className="rounded-[1.75rem] border border-border-default bg-bg-surface p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
                About this gathering
              </p>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-text-muted">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>{event.summary}</p>
                )}
              </div>
            </article>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] bg-brand-navy p-6 text-text-on-inverse shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-sky">
                What stands out
              </p>
              <ul className="mt-5 space-y-4">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <CalendarDays className="h-5 w-5 text-brand-sky" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Date
                    </p>
                    <p className="mt-1 font-display text-lg font-bold">
                      {event.startsOn ?? "To be confirmed"}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Clock3 className="h-5 w-5 text-brand-sky" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Time
                    </p>
                    <p className="mt-1 font-display text-lg font-bold">
                      {event.endsOn ?? "Shared on the day"}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <MapPin className="h-5 w-5 text-brand-sky" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Place
                    </p>
                    <p className="mt-1 font-display text-lg font-bold leading-snug">
                      {event.location ?? "Community venue"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-[1.75rem] border border-border-default bg-bg-surface p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-magenta/15 text-brand-magenta">
                  <Users className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
                    Host
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-brand-navy">
                    {host}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    A youth-led organisation advancing the rights, health and
                    potential of girls in underserved communities.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-dashed border-brand-sky/40 bg-blob-sky/25 p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-brand-navy" aria-hidden />
                <div>
                  <p className="font-display text-lg font-bold text-brand-navy">
                    Save the day
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    Add this gathering to your calendar so you do not miss it.
                  </p>
                </div>
              </div>
              <AddToCalendar
                title={event.title}
                summary={event.summary}
                location={event.location}
                startsOn={event.startsOn}
                endsOn={event.endsOn}
                url={`/events/${event.slug}`}
              />
            </div>

            <ShareButtons
              title={event.title}
              summary={event.summary}
              url={`/events/${event.slug}`}
            />

            <Link
              href="/events"
              className="inline-flex text-sm font-semibold text-brand-sky hover:underline"
            >
              ← Back to all events
            </Link>
          </aside>
        </div>
      </section>

      <section className="bg-bg-surface px-4 py-12 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
            Timeline
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy">
            How the day unfolds
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Arrive & welcome",
                body: event.startsOn
                  ? `Gathering opens around ${event.startsOn}${event.location ? ` at ${event.location}` : ""}.`
                  : "Guests arrive and are welcomed by the GGI team.",
              },
              {
                step: "02",
                title: "Programme in motion",
                body: "Conversations, learning and community engagement with girls at the centre.",
              },
              {
                step: "03",
                title: "Close & next steps",
                body: event.endsOn
                  ? `Programme winds down by ${event.endsOn}, with clear ways to stay involved.`
                  : "The day closes with appreciation and ways to continue supporting girls.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="rounded-[1.5rem] border border-border-default bg-bg-base p-5"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-brand-sky">
                  {item.step}
                </p>
                <p className="mt-2 font-display text-xl font-bold text-brand-navy">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        title="Bring GGI to your school or community."
        primary={{ href: "/partner", label: "Partner with us" }}
        secondary={{ href: "/news", label: "Read news & reports" }}
      />
    </>
  );
}
