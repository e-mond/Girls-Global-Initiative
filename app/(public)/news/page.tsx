import Image from "next/image";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { getPublicNews } from "@/features/content/public-content";

export default async function NewsPage() {
  const items = await getPublicNews();
  const showingPlaceholders = items.every((item) => item.isPlaceholder);

  return (
    <>
      <PageHeroEditorial
        eyebrow="News"
        title="Updates from Girls Global Initiative."
        description="Stories and updates from school outreach, community work and partnership moments. Publish news posts from the admin CMS to replace placeholders."
        tone="sky"
        ctas={[
          { href: "/events", label: "See events", variant: "secondary" },
          { href: "/gallery", label: "Gallery" },
        ]}
      />

      <ContentSection
        eyebrow="Latest"
        title="What we are sharing right now."
        description={
          showingPlaceholders
            ? "Placeholder updates only. Publish news_posts in Admin for live stories."
            : undefined
        }
        tone="surface"
      >
        <ul className="grid gap-6 lg:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <article className="overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-base">
                {item.imageSrc ? (
                  <div className="relative h-48">
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  {item.publishedOn ? (
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">
                      {item.publishedOn}
                    </p>
                  ) : item.isPlaceholder ? (
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Placeholder
                    </p>
                  ) : null}
                  <h2 className="mt-2 font-display text-xl font-bold text-brand-navy">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {item.summary}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </ContentSection>

      <CtaBand
        title="Stay closer to the work."
        description="Subscribe on the homepage or follow GGI on social channels."
        primary={{ href: "/#newsletter", label: "Newsletter" }}
        secondary={{ href: "/contact", label: "Contact us" }}
      />
    </>
  );
}
