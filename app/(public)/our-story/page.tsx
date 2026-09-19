import Image from "next/image";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { challengeTags } from "@/features/content/mock-home";

export default function OurStoryPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Our story"
        title="Born from listening. Built around girls."
        description="Girls Global Initiative began as a conversation between two young women who recognised the risks facing girls in their communities — and chose to organise a response."
      />
      <section className="bg-bg-surface px-4 pb-16 lg:px-6 lg:pb-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/home/origin.jpg"
              alt="Community members gathered together"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-5">
            <p className="text-base leading-relaxed text-text-muted">
              From that starting point, GGI has focused on rural, remote and
              underserved communities first — advancing rights, health,
              confidence and mentorship so no girl has to navigate hard
              realities alone.
            </p>
            <p className="text-sm text-text-muted">
              Fuller story content will be CMS-managed. Until then, this page
              reflects the approved homepage narrative without inventing impact
              figures or unverified claims.
            </p>
            <div className="flex flex-wrap gap-2">
              {challengeTags.map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-full border border-border-default bg-bg-base px-3 py-1.5 text-xs font-medium text-brand-navy"
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
