import type { Metadata } from "next";
import { OurStoryView } from "@/components/our-story/our-story-view";
import { getPublicGalleryItems } from "@/features/content/public-content";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "How Girls Global Initiative began — from a conversation between two young women to a youth-led organisation advancing the rights, health and potential of girls.",
};

export default async function OurStoryPage() {
  const gallery = await getPublicGalleryItems();
  const galleryImages = gallery.map((item) => ({
    id: item.id,
    src: item.imageSrc,
    alt: item.caption || item.title,
  }));

  return <OurStoryView galleryImages={galleryImages} />;
}
