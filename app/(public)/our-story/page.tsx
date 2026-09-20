import Image from "next/image";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  Prose,
} from "@/components/layout/content-section";
import { OUR_STORY, TAGLINE } from "@/content/site-copy";
import { challengeTags } from "@/features/content/mock-home";

export default function OurStoryPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Our story"
        title="Born from listening. Built around girls."
        description={TAGLINE}
      />

      <ContentSection tone="surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/home/origin.jpg"
              alt="Community members gathered together"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <Prose>
            {OUR_STORY.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </Prose>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Belief"
        title="When girls are empowered, communities thrive and nations transform."
        tone="navy"
        narrow
      />

      <ContentSection tone="base">
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            { label: "Vision", body: OUR_STORY.vision },
            { label: "Mission", body: OUR_STORY.mission },
            { label: "Purpose", body: OUR_STORY.purpose },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-border-default bg-bg-surface p-6"
            >
              <h2 className="font-display text-xl font-bold text-brand-navy">
                {item.label}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Core values"
        title="What guides every conversation, classroom and community visit."
        tone="surface"
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OUR_STORY.values.map((value) => (
            <li
              key={value.name}
              className="rounded-3xl border border-border-default bg-bg-base p-5"
            >
              <h3 className="font-display text-lg font-bold text-brand-navy">
                {value.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {value.description}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-2">
          {challengeTags.map((tag) => (
            <span
              key={tag.label}
              className="rounded-full border border-border-default bg-bg-base px-3 py-1.5 text-xs font-medium text-brand-navy"
            >
              {tag.label}
            </span>
          ))}
        </div>
      </ContentSection>
    </>
  );
}
