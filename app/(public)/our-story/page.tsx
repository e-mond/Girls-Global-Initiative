import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.ourStory.title,
  description: PAGE_SEO.ourStory.description,
  path: "/our-story",
});

import { OurStoryView } from "@/components/our-story/our-story-view";
import {
  getPublicFounderSpotlight,
  getPublicGalleryItems,
} from "@/features/content/public-content";
import { VideoEmbed } from "@/components/media/video-embed";
import { getSiteSettings } from "@/features/settings/service";

export default async function OurStoryPage() {
  const [gallery, founderSpotlight, settings] = await Promise.all([
    getPublicGalleryItems(),
    getPublicFounderSpotlight(),
    getSiteSettings(),
  ]);
  const galleryImages = gallery.map((item) => ({
    id: item.id,
    src: item.imageSrc,
    alt: item.caption || item.title,
  }));

  return (
    <>
      <OurStoryView
        galleryImages={galleryImages}
        founderSpotlight={founderSpotlight}
      />
      {settings.storyVideoEmbedUrl ? (
        <section className="bg-bg-surface px-4 py-12 lg:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              Watch
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-brand-navy">
              Our story in 2 min
            </h2>
            <div className="mt-6">
              <VideoEmbed
                url={settings.storyVideoEmbedUrl}
                title="Girls Global Initiative — our story"
              />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
