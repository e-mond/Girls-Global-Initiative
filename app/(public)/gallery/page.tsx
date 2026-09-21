import Image from "next/image";
import Link from "next/link";
import { PageHeroPhoto } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { getPublicGalleryItems } from "@/features/content/public-content";

export default async function GalleryPage() {
  const items = await getPublicGalleryItems();
  const showingPlaceholders = items.every((item) => item.isPlaceholder);

  return (
    <>
      <PageHeroPhoto
        eyebrow="Gallery"
        title="Moments from the work with girls."
        description="Photography from school engagement, community visits and safe spaces. Staff can publish gallery items from the CMS media library."
        imageSrc="/home/community-1.jpg"
        imageAlt="Girls Global Initiative community photography"
        ctas={[
          { href: "/communities", label: "Communities", variant: "secondary" },
          { href: "/partner", label: "Invite GGI", variant: "onDark" },
        ]}
      />

      <ContentSection
        eyebrow="From the field"
        title="A living gallery of GGI's community work."
        description={
          showingPlaceholders
            ? "Showing identifiable placeholder imagery until gallery items are published in Admin."
            : "Published gallery items from the CMS."
        }
        tone="cream"
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <article className="group relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-brand-navy">
                <Image
                  src={item.imageSrc}
                  alt={item.caption || item.title}
                  fill
                  className="object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/20 to-transparent"
                />
                {item.badge ? (
                  <span className="absolute right-3 top-3 rounded-full bg-[#ffb347] px-3 py-1 text-[11px] font-semibold text-brand-navy">
                    {item.badge}
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h2 className="font-display text-lg font-bold text-white">
                    {item.title}
                  </h2>
                  {item.caption ? (
                    <p className="mt-1 text-sm text-white/85">{item.caption}</p>
                  ) : null}
                  {item.location ? (
                    <p className="mt-2 text-xs text-white/70">{item.location}</p>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-text-muted">
          Explore community context on{" "}
          <Link href="/communities" className="font-semibold text-brand-sky hover:underline">
            Communities
          </Link>{" "}
          or invite GGI via{" "}
          <Link href="/partner" className="font-semibold text-brand-sky hover:underline">
            Partner
          </Link>
          .
        </p>
      </ContentSection>

      <CtaBand
        title="Share a community invitation."
        primary={{ href: "/partner", label: "Partner with us" }}
        secondary={{ href: "/contact", label: "Contact GGI" }}
      />
    </>
  );
}
