import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.events.title,
  description: PAGE_SEO.events.description,
  path: "/events",
});

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import {
  IconFeatureGrid,
  ProcessBand,
} from "@/components/layout/editorial";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import {
  getPublicEvents,
  type PublicEventItem,
} from "@/features/content/public-content";
import { eventStatusLabel } from "@/lib/events/programme-status";

function EventCardList({ items }: { items: PublicEventItem[] }) {
  return (
    <Stagger className="space-y-5">
      {items.map((item) => {
        const href = item.isPlaceholder ? undefined : `/events/${item.slug}`;
        const dateLabel =
          item.displayStatus === "postponed" && item.revisedStartsOn
            ? item.revisedStartsOn
            : item.startsOn;
        const card = (
          <article className="grid h-full overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-surface transition hover:border-brand-sky/50 md:grid-cols-[220px_1fr]">
            <div className="relative min-h-[160px] bg-blob-sky/40">
              {item.imageSrc ? (
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="object-contain object-center p-2"
                  sizes="220px"
                />
              ) : null}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-brand-navy/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-navy">
                  {eventStatusLabel(item.displayStatus)}
                </span>
                {dateLabel ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">
                    {dateLabel}
                  </p>
                ) : null}
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-brand-navy">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {item.statusNote &&
                (item.displayStatus === "cancelled" ||
                  item.displayStatus === "postponed")
                  ? item.statusNote
                  : item.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-brand-navy">
                {item.endsOn ? <span>{item.endsOn}</span> : null}
                {item.location ? <span>{item.location}</span> : null}
              </div>
              <span className="mt-5 inline-flex text-sm font-semibold text-brand-sky">
                {href ? "Details & add to calendar" : "Invite GGI via Partner"}
              </span>
            </div>
          </article>
        );

        return (
          <StaggerItem key={item.id}>
            {href ? (
              <Link
                href={href}
                className="block rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
                aria-label={`View details for ${item.title}`}
              >
                {card}
              </Link>
            ) : (
              card
            )}
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

function EventGroup({
  title,
  description,
  items,
  empty,
}: {
  title: string;
  description?: string;
  items: PublicEventItem[];
  empty: string;
}) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold text-brand-navy">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      ) : null}
      <div className="mt-4">
        {items.length > 0 ? (
          <EventCardList items={items} />
        ) : (
          <p className="text-sm text-text-muted">{empty}</p>
        )}
      </div>
    </div>
  );
}

export default async function EventsPage() {
  const items = await getPublicEvents();
  const showingPlaceholders = items.every((item) => item.isPlaceholder);
  const live = showingPlaceholders ? [] : items;
  const upcoming = live.filter((item) => item.displayStatus === "upcoming");
  const past = live.filter((item) => item.displayStatus === "past");
  const postponed = live.filter((item) => item.displayStatus === "postponed");
  const cancelled = live.filter((item) => item.displayStatus === "cancelled");

  return (
    <>
      <PageHeroEditorial
        breadcrumb="Events"
        badge="Events"
        meta="Outreach · Gatherings · Invitations"
        title="Gatherings, outreach and invitations."
        description="Outreach, gatherings, and invitations — published only when confirmed."
        tone="blush"
        ctas={[
          { href: "#events-calendar", label: "See Events" },
          { href: "/partner", label: "Invite GGI", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="What an event can be"
        title="Spaces where girls and communities meet the work."
        tone="surface"
      >
        <IconFeatureGrid
          items={[
            {
              title: "School visits",
              body: "Tours and conversations that keep learning and rights in the room.",
              icon: Sparkles,
            },
            {
              title: "Community days",
              body: "Gatherings hosted with schools, families and local partners.",
              icon: CalendarDays,
            },
            {
              title: "Open invitations",
              body: "Ask GGI to come where girls already learn and live.",
              icon: MapPin,
            },
          ]}
        />
      </ContentSection>

      <ProcessBand
        eyebrow="Hosting with GGI"
        title="From invitation to a day with girls."
        steps={[
          {
            step: "01",
            title: "Reach out",
            body: "Schools and community leaders request a conversation.",
          },
          {
            step: "02",
            title: "Plan with care",
            body: "Dates and locations are published only when confirmed.",
          },
          {
            step: "03",
            title: "Walk together",
            body: "Outreach focuses on dignity, learning and local partnership.",
          },
        ]}
      />

      <ContentSection
        id="events-calendar"
        eyebrow="Calendar"
        title="Where girls and communities can meet the work."
        description={
          showingPlaceholders
            ? "Confirmed gatherings will appear here when published."
            : "Upcoming invitations appear first. Cancelled and postponed events are labelled clearly. Past programmes stay available in the archive."
        }
        tone="cream"
      >
        {showingPlaceholders ? (
          <EventCardList items={items} />
        ) : (
          <div className="space-y-12">
            <EventGroup
              title="Upcoming"
              items={upcoming}
              empty="No upcoming events are published right now. Browse other sections below or invite GGI to your community."
            />
            {postponed.length > 0 ? (
              <EventGroup
                title="Postponed"
                description="Events officially postponed by GGI staff."
                items={postponed}
                empty="No postponed events."
              />
            ) : null}
            {cancelled.length > 0 ? (
              <EventGroup
                title="Cancelled"
                description="Events officially cancelled — kept for historical record."
                items={cancelled}
                empty="No cancelled events."
              />
            ) : null}
            <EventGroup
              title="Past events"
              description="Completed programmes remain available for reference."
              items={past}
              empty="Past programmes will appear here after their event date."
            />
          </div>
        )}
      </ContentSection>

      <CtaBand
        title="Open a door in your community."
        primary={{ href: "/partner", label: "Partner with us" }}
        secondary={{ href: "/contact", label: "Contact GGI" }}
      />
    </>
  );
}
