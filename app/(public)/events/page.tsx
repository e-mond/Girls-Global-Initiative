import Image from "next/image";
import Link from "next/link";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { getPublicEvents } from "@/features/content/public-content";

export default async function EventsPage() {
  const items = await getPublicEvents();
  const showingPlaceholders = items.every((item) => item.isPlaceholder);

  return (
    <>
      <PageHeroEditorial
        eyebrow="Events"
        title="Gatherings, outreach and invitations."
        description="Upcoming and recent GGI activities. Publish events from the admin CMS with dates and locations when available. Do not invent schedules."
        tone="blush"
        ctas={[
          { href: "/partner", label: "Invite GGI" },
          { href: "/news", label: "Read news", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="Calendar"
        title="Where girls and communities can meet the work."
        description={
          showingPlaceholders
            ? "Placeholder invitation only until events are published in Admin."
            : undefined
        }
        tone="cream"
      >
        <ul className="space-y-5">
          {items.map((item) => (
            <li key={item.id}>
              <article className="grid overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-surface md:grid-cols-[220px_1fr]">
                <div className="relative min-h-[160px] bg-blob-sky/40">
                  {item.imageSrc ? (
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="220px"
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  {item.isPlaceholder ? (
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Placeholder
                    </p>
                  ) : null}
                  <h2 className="mt-1 font-display text-xl font-bold text-brand-navy">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {item.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-brand-navy">
                    {item.startsOn ? <span>Starts: {item.startsOn}</span> : null}
                    {item.endsOn ? <span>Ends: {item.endsOn}</span> : null}
                    {item.location ? <span>{item.location}</span> : null}
                  </div>
                  <Link
                    href="/partner"
                    className="mt-5 inline-flex text-sm font-semibold text-brand-sky hover:underline"
                  >
                    Request a conversation
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </ContentSection>

      <CtaBand
        title="Open a door in your community."
        primary={{ href: "/partner", label: "Partner with us" }}
        secondary={{ href: "/contact", label: "Contact GGI" }}
      />
    </>
  );
}
