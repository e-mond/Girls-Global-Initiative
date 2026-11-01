import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.news.title,
  description: PAGE_SEO.news.description,
  path: "/news",
});

import Link from "next/link";
import { Newspaper, Radio } from "lucide-react";
import {
  DualToneCards,
  PhotoBand,
} from "@/components/layout/editorial";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import { ContainImage } from "@/components/media/contain-image";
import { ShareButtons } from "@/components/news/share-buttons";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import {
  getArchivedNews,
  getPublicEvents,
  getPublicNews,
  getPublicNewsletters,
} from "@/features/content/public-content";
import type { PublicNewsItem } from "@/features/content/public-content";
import { eventStatusLabel } from "@/lib/events/programme-status";

function NewsCardGrid({
  items,
  emptyHint,
  ctaLabel,
}: {
  items: PublicNewsItem[];
  emptyHint: string;
  ctaLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-text-muted">{emptyHint}</p>;
  }

  return (
    <Stagger className="grid gap-6 lg:grid-cols-2">
      {items.map((item) => {
        const href = item.isPlaceholder ? "/news" : `/news/${item.slug}`;
        return (
          <StaggerItem key={item.id}>
            <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-base transition hover:border-brand-sky/40">
              <Link
                href={href}
                className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
                aria-label={item.title}
              >
                {item.imageSrc ? (
                  <ContainImage
                    src={item.imageSrc}
                    alt={item.title}
                    variant="card"
                  />
                ) : (
                  <div className="aspect-[4/5] min-h-[220px] max-h-[320px] bg-blob-sky/30" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">
                    {item.kind === "newsletter" ? "Newsletter" : "News"}
                    {item.contentStatus === "archived" ? " · Archive" : ""}
                    {item.publishedOn ? ` · ${item.publishedOn}` : ""}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold text-brand-navy">
                    {item.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                    {item.summary}
                  </p>
                  {!item.isPlaceholder ? (
                    <span className="mt-4 inline-flex text-sm font-semibold text-brand-sky">
                      {ctaLabel}
                    </span>
                  ) : null}
                </div>
              </Link>
              {!item.isPlaceholder ? (
                <div className="px-6 pb-6">
                  <ShareButtons
                    title={item.title}
                    summary={item.summary}
                    url={`/news/${item.slug}`}
                  />
                </div>
              ) : null}
            </article>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

export default async function NewsPage() {
  const [items, newsletters, events, archived] = await Promise.all([
    getPublicNews(),
    getPublicNewsletters(),
    getPublicEvents(),
    getArchivedNews(),
  ]);
  const showingPlaceholders = items.every((item) => item.isPlaceholder);
  const liveNews = showingPlaceholders ? [] : items;
  const liveEvents = events.filter((item) => !item.isPlaceholder);
  const cancelledOrPostponed = liveEvents.filter(
    (item) =>
      item.displayStatus === "cancelled" || item.displayStatus === "postponed",
  );

  return (
    <>
      <PageHeroEditorial
        breadcrumb="News"
        badge="News"
        meta="Updates · Letters · Moments"
        title="Updates from Girls Global Initiative."
        description="School outreach, community work, partnership updates, and upcoming events."
        tone="sky"
        ctas={[
          { href: "#newsletter-notes", label: "Newsletter notes", variant: "secondary" },
          { href: "/events", label: "See events" },
        ]}
      />

      <DualToneCards
        left={{
          label: "What we share",
          body: "School visits, community invitations and partnership notes — written with care for girls' dignity.",
          icon: Newspaper,
          tone: "sky",
        }}
        right={{
          label: "How it grows",
          body: "Staff publish news and newsletter notes from the CMS as programmes and observances are confirmed.",
          icon: Radio,
          tone: "pink",
        }}
      />

      {cancelledOrPostponed.length > 0 ? (
        <ContentSection
          eyebrow="Programme notices"
          title="Cancelled or postponed gatherings."
          description="Announcements linked to events that were officially cancelled or postponed."
          tone="cream"
        >
          <Stagger className="space-y-4">
            {cancelledOrPostponed.map((item) => (
              <StaggerItem key={item.id}>
                <Link
                  href={`/events/${item.slug}`}
                  className="block rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
                  aria-label={`View details for ${item.title}`}
                >
                  <article className="overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-surface p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">
                      {eventStatusLabel(item.displayStatus)}
                      {item.startsOn ? ` · ${item.startsOn}` : ""}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-bold text-brand-navy">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {item.statusNote || item.summary}
                    </p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-brand-sky">
                      View event details
                    </span>
                  </article>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </ContentSection>
      ) : null}

      <ContentSection
        eyebrow="Latest"
        title="Published updates."
        description={
          liveNews.length === 0
            ? "Programme updates will appear here when published."
            : "Open a story for the full update."
        }
        tone="surface"
      >
        <NewsCardGrid
          items={liveNews}
          emptyHint="Programme updates will appear here when published."
          ctaLabel="Read full update"
        />
      </ContentSection>

      <ContentSection
        id="newsletter-notes"
        eyebrow="Newsletter"
        title="Observances and campaign notes."
        description="Commemorative messages and awareness notes from GGI — not always programme events."
        tone="cream"
      >
        <NewsCardGrid
          items={newsletters}
          emptyHint="Newsletter notes will appear here when published."
          ctaLabel="Read note"
        />
      </ContentSection>

      {archived.length > 0 ? (
        <ContentSection
          eyebrow="Archive"
          title="Earlier news and notes."
          description="Archived stories remain available for reference."
          tone="surface"
        >
          <NewsCardGrid
            items={archived}
            emptyHint="No archived news yet."
            ctaLabel="Read archived update"
          />
        </ContentSection>
      ) : null}

      <PhotoBand src="/our-story/values.jpg?v=20261026" alt="Two schoolgirls reading a book together outdoors in Ghana" />

      <CtaBand
        title="Stay closer to the work."
        description="Subscribe on the homepage or follow GGI on social channels."
        primary={{ href: "/#newsletter", label: "Newsletter signup" }}
        secondary={{ href: "/contact", label: "Contact us" }}
      />
    </>
  );
}
