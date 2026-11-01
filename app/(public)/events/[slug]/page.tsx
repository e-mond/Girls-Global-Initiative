import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ContentSection,
  CtaBand,
  Prose,
} from "@/components/layout/content-section";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import { ShareButtons } from "@/components/news/share-buttons";
import {
  getPublicEventBySlug,
  getPublicEvents,
} from "@/features/content/public-content";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await getPublicEvents();
  return items
    .filter((item) => !item.isPlaceholder)
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    return buildPageMetadata({
      title: "Event",
      description: "Girls Global Initiative events.",
      path: "/events",
    });
  }
  return buildPageMetadata({
    title: event.title,
    description: event.summary,
    path: `/events/${event.slug}`,
  });
}

function bodyParagraphs(body: string) {
  return body
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export default async function EventDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) notFound();

  const paragraphs = bodyParagraphs(event.body);

  return (
    <>
      <PageHeroEditorial
        breadcrumb="Events"
        badge="Event"
        meta={[event.startsOn, event.location].filter(Boolean).join(" · ") || "GGI event"}
        title={event.title}
        description={event.summary}
        tone="blush"
        ctas={[
          { href: "/events", label: "All events", variant: "secondary" },
          { href: "/partner", label: "Invite GGI" },
        ]}
      />

      {event.imageSrc ? (
        <div className="bg-bg-surface px-4 pb-4 lg:px-6">
          <div className="relative mx-auto aspect-[21/9] max-w-6xl overflow-hidden rounded-[1.75rem]">
            <Image
              src={event.imageSrc}
              alt={event.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1100px"
            />
          </div>
        </div>
      ) : null}

      <ContentSection tone="surface" narrow>
        <div className="flex flex-wrap gap-3 text-sm font-medium text-brand-navy">
          {event.startsOn ? <span>Date: {event.startsOn}</span> : null}
          {event.endsOn ? <span>Time: {event.endsOn}</span> : null}
          {event.location ? <span>Format: {event.location}</span> : null}
        </div>

        {paragraphs.length > 0 ? (
          <Prose className="mt-8">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </Prose>
        ) : (
          <p className="mt-8 text-base leading-relaxed text-text-muted">
            {event.summary}
          </p>
        )}

        <ShareButtons
          className="mt-8"
          title={event.title}
          summary={event.summary}
          url={`/events/${event.slug}`}
        />

        <p className="mt-8">
          <Link
            href="/events"
            className="text-sm font-semibold text-brand-sky hover:underline"
          >
            ← Back to all events
          </Link>
        </p>
      </ContentSection>

      <CtaBand
        title="Bring GGI to your school or community."
        primary={{ href: "/partner", label: "Partner with us" }}
        secondary={{ href: "/news", label: "Read news" }}
      />
    </>
  );
}
