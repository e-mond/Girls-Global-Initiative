import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.news.title,
  description: PAGE_SEO.news.description,
  path: "/news",
});

import Image from "next/image";
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
import { ShareButtons } from "@/components/news/share-buttons";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import {
  getPublicEvents,
  getPublicNews,
} from "@/features/content/public-content";

export default async function NewsPage() {
  const [items, events] = await Promise.all([
    getPublicNews(),
    getPublicEvents(),
  ]);
  const showingPlaceholders = items.every((item) => item.isPlaceholder);
  const liveEvents = events.filter((item) => !item.isPlaceholder);

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
          { href: "/events", label: "See events", variant: "secondary" },
          { href: "/gallery", label: "Gallery" },
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
          body: "Staff publish news and events from the CMS as programmes and reports are confirmed.",
          icon: Radio,
          tone: "pink",
        }}
      />

      {liveEvents.length > 0 ? (
        <ContentSection
          eyebrow="Events"
          title="Upcoming and recent gatherings."
          description="Open an event for the full details."
          tone="cream"
        >
          <Stagger className="space-y-4">
            {liveEvents.map((item) => (
              <StaggerItem key={item.id}>
                <Link
                  href={`/events/${item.slug}`}
                  className="block rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
                  aria-label={`View details for ${item.title}`}
                >
                  <article className="grid overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-surface transition hover:border-brand-sky/50 md:grid-cols-[200px_1fr]">
                    <div className="relative min-h-[140px] bg-blob-sky/40">
                      {item.imageSrc ? (
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      ) : null}
                    </div>
                    <div className="p-5 sm:p-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">
                        Event
                        {item.startsOn ? ` · ${item.startsOn}` : ""}
                      </p>
                      <h2 className="mt-2 font-display text-xl font-bold text-brand-navy">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">
                        {item.summary}
                      </p>
                      <span className="mt-4 inline-flex text-sm font-semibold text-brand-sky">
                        View details
                      </span>
                    </div>
                  </article>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6">
            <Link
              href="/events"
              className="text-sm font-semibold text-brand-sky hover:underline"
            >
              All events
            </Link>
          </p>
        </ContentSection>
      ) : null}

      <ContentSection
        eyebrow="Latest"
        title="What we are sharing right now."
        description={
          showingPlaceholders
            ? "Programme updates will appear here when published."
            : "Open a story for the full report and download."
        }
        tone="surface"
      >
        <Stagger className="grid gap-6 lg:grid-cols-2">
          {items.map((item) => {
            const href = item.isPlaceholder ? "/news" : `/news/${item.slug}`;
            return (
              <StaggerItem key={item.id}>
                <article className="overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-base transition hover:border-brand-sky/40">
                  <Link
                    href={href}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
                    aria-label={item.title}
                  >
                    <div className="relative h-52 bg-blob-sky/30">
                      {item.imageSrc ? (
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : null}
                    </div>
                    <div className="p-6">
                      {item.publishedOn ? (
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">
                          {item.publishedOn}
                        </p>
                      ) : null}
                      <h2 className="mt-2 font-display text-xl font-bold text-brand-navy">
                        {item.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-text-muted">
                        {item.summary}
                      </p>
                      {!item.isPlaceholder ? (
                        <span className="mt-4 inline-flex text-sm font-semibold text-brand-sky">
                          Read full update
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
      </ContentSection>

      <PhotoBand src="/our-story/values.jpg?v=20261026" alt="Two schoolgirls reading a book together outdoors in Ghana" />

      <CtaBand
        title="Stay closer to the work."
        description="Subscribe on the homepage or follow GGI on social channels."
        primary={{ href: "/#newsletter", label: "Newsletter" }}
        secondary={{ href: "/contact", label: "Contact us" }}
      />
    </>
  );
}
