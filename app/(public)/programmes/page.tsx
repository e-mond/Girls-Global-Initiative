import Image from "next/image";
import Link from "next/link";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
  RelatedLinks,
} from "@/components/layout/content-section";
import { PROGRAMMES, PROJECTS } from "@/content/site-copy";

export default function ProgrammesPage() {
  const [featured, ...rest] = PROGRAMMES;

  return (
    <>
      <PageHeroEditorial
        eyebrow="Programmes"
        title="Programmes, initiatives and projects."
        description="GGI delivers its mission through focused initiatives and community projects — from school tours and mentorship to rural girl empowerment."
        ctas={[
          { href: "/what-we-do", label: "See pillars" },
          { href: "/partner", label: "Invite GGI", variant: "secondary" },
        ]}
      />

      <ContentSection
        eyebrow="Featured initiative"
        title={featured.title}
        description={featured.body}
        tone="navy"
      >
        <Link
          href="/get-involved"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-magenta px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-magenta/90"
        >
          Support this work
        </Link>
      </ContentSection>

      <ContentSection
        eyebrow="Initiatives"
        title="Programmes that organise our ongoing work."
        tone="surface"
      >
        <ul className="grid gap-4 lg:grid-cols-2">
          {rest.map((item) => (
            <li
              key={item.title}
              className="rounded-3xl border border-border-default bg-bg-base p-6"
            >
              <h2 className="font-display text-xl font-bold text-brand-navy">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection
        eyebrow="Projects"
        title="Projects that bring girls together where they learn and live."
        tone="blush"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <article
              key={project.title}
              className="overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-surface"
            >
              {index < 2 ? (
                <div className="relative h-40">
                  <Image
                    src={
                      index === 0
                        ? "/home/community-2.jpg"
                        : "/home/community-3.jpg"
                    }
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : null}
              <div className="p-6">
                <h2 className="font-display text-xl font-bold text-brand-navy">
                  {project.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {project.summary}
                </p>
                <ul className="mt-4 space-y-2">
                  {project.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-sm text-brand-navy"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-magenta" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>

      <RelatedLinks
        links={[
          {
            href: "/what-we-do",
            label: "What we do",
            description: "Four pillars that frame programmes.",
          },
          {
            href: "/impact",
            label: "Impact",
            description: "Achievements documented without invented counts.",
          },
          {
            href: "/communities",
            label: "Communities",
            description: "Where rural and underserved girls remain first.",
          },
        ]}
      />

      <CtaBand
        title="Bring a programme closer to your community."
        primary={{ href: "/partner", label: "Partner with us" }}
        secondary={{ href: "/contact", label: "Contact GGI" }}
      />
    </>
  );
}
