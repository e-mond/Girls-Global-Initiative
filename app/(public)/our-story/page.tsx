import Image from "next/image";
import Link from "next/link";
import {
  PageHeroEditorial,
} from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
  Prose,
  QuoteBand,
} from "@/components/layout/content-section";
import { OUR_STORY, TAGLINE } from "@/content/site-copy";
import { challengeTags } from "@/features/content/mock-home";

export default function OurStoryPage() {
  return (
    <>
      <PageHeroEditorial
        eyebrow="Our story"
        title="Born from listening. Built around girls."
        description={TAGLINE}
        ctas={[
          { href: "/what-we-do", label: "See what we do" },
          { href: "/get-involved", label: "Get involved", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="The beginning"
        title="A conversation between two young women became GGI."
        tone="surface"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image
              src="/home/origin.jpg"
              alt="Community members gathered together"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-border-default bg-bg-base p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
                Our beginning
              </p>
              <p className="mt-2 font-display text-xl font-bold text-brand-navy">
                From YMK Foundation to Girls Global Initiative — December 2024.
              </p>
            </div>
            <Prose>
              {OUR_STORY.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </Prose>
          </div>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Why GGI exists"
        title="Closing the gap for girls facing the greatest barriers."
        description="Poverty, early pregnancy, school dropout, menstrual health challenges and limited guidance still shape too many girls' futures — especially in rural and underserved communities."
        tone="sky"
      >
        <div className="flex flex-wrap gap-2">
          {challengeTags.map((tag) => (
            <span
              key={tag.label}
              className="rounded-full border border-border-default bg-bg-surface px-3 py-1.5 text-xs font-medium text-brand-navy"
            >
              {tag.label}
            </span>
          ))}
        </div>
      </ContentSection>

      <QuoteBand quote={OUR_STORY.belief} attribution="Girls Global Initiative" />

      <ContentSection tone="cream">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { label: "Vision", body: OUR_STORY.vision, tone: "bg-blob-sky/50" },
            { label: "Mission", body: OUR_STORY.mission, tone: "bg-blob-pink/50" },
            { label: "Purpose", body: OUR_STORY.purpose, tone: "bg-bg-surface" },
          ].map((item) => (
            <article
              key={item.label}
              className={`rounded-3xl border border-border-default p-6 ${item.tone}`}
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
        <p className="mt-8 text-sm text-text-muted">
          Meet the founder behind this story on{" "}
          <Link href="/founder" className="font-semibold text-brand-sky hover:underline">
            the Founder page
          </Link>
          .
        </p>
      </ContentSection>

      <CtaBand
        title="Walk with us for the girls who need it most."
        description="Support GGI through giving, volunteering, partnership or advocacy."
        primary={{ href: "/get-involved", label: "Get involved" }}
        secondary={{ href: "/what-we-do", label: "Explore our work" }}
      />
    </>
  );
}
