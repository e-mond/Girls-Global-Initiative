import Link from "next/link";

const CONTENT_SECTIONS = [
  {
    href: "/admin/content/pillars",
    title: "Pillars",
    body: "Four programme pillars — titles, descriptions, detail copy, order.",
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
    body: "Where we work community/gallery items.",
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
  {
    href: "/admin/content/media",
    title: "Media library",
    body: "Upload, preview and manage images with required alt text.",
  },
] as const;

export default function AdminContentHubPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-brand-navy">
          Content
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Draft and publish public-facing content. Only published items appear
          on the website.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CONTENT_SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border border-border-default bg-bg-surface p-5 transition hover:border-brand-sky/40"
          >
            <p className="font-display text-base font-semibold text-brand-navy">
              {section.title}
            </p>
            <p className="mt-2 text-sm text-text-muted">{section.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
