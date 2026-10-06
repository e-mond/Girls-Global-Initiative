import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.ourStory.title,
  description: PAGE_SEO.ourStory.description,
  path: "/our-story",
});

import { OurStoryView } from "@/components/our-story/our-story-view";
import { getPublicGalleryItems } from "@/features/content/public-content";

export default async function OurStoryPage() {
  const gallery = await getPublicGalleryItems();
  const galleryImages = gallery.map((item) => ({
    id: item.id,
    src: item.imageSrc,
    alt: item.caption || item.title,
  }));

  return <OurStoryView galleryImages={galleryImages} />;
}
