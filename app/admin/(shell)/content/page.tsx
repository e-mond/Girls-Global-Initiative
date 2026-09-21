import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

const CONTENT_SECTIONS = [
  {
    href: "/admin/content/pillars",
    title: "Pillars",
    body: "Four programme pillars: titles, descriptions, detail copy, order.",
  },
  {
    href: "/admin/content/team",
    title: "Team",
    body: "Team members and founder spotlight fields.",
  },
  {
    href: "/admin/content/challenge-tags",
    title: "Challenge tags",
    body: "Origin-section challenge tags girls told us they were facing.",
  },
  {
    href: "/admin/content/gallery",
    title: "Gallery",
    body: "Where we work community/gallery items with image URLs.",
  },
  {
    href: "/admin/content/news",
    title: "News",
    body: "News posts for the public News page and homepage strip.",
  },
  {
    href: "/admin/content/events",
    title: "Events",
    body: "Events for the public Events page and homepage strip.",
  },
  {
    href: "/admin/content/testimonials",
    title: "Testimonials",
    body: "Quotes and attributions for public storytelling.",
  },
  {
    href: "/admin/content/advocacy",
    title: "Advocacy",
    body: "Advocacy toolkit content blocks.",
  },
] as const;

export default function AdminContentHubPage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Manage"
        title="Content"
        description="Draft and publish public-facing content. Only published items appear on the website."
        actions={
          <Link
            href="/admin/content/media"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-navy px-4 text-sm font-semibold text-text-on-inverse hover:bg-brand-navy/90"
          >
            Media library
          </Link>
        }
      />

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CONTENT_SECTIONS.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="flex h-full flex-col rounded-2xl border border-border-default bg-bg-surface p-5 transition hover:border-brand-sky/40"
            >
              <span className="font-display text-lg font-bold text-brand-navy">
                {section.title}
              </span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                {section.body}
              </span>
              <span className="mt-4 text-sm font-semibold text-brand-magenta">
                Open →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
