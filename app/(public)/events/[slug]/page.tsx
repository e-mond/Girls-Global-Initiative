import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventDetailView } from "@/components/events/event-detail-view";
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

export default async function EventDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) notFound();
  return <EventDetailView event={event} />;
}
