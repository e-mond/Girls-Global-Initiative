import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { ContentSection } from "@/components/layout/content-section";
import { PROGRAMMES, PROJECTS } from "@/content/site-copy";

export default function ProgrammesPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Programmes"
        title="Programmes, initiatives and projects."
        description="GGI delivers its mission through focused initiatives and community projects — from school tours and mentorship to rural girl empowerment."
      />

      <ContentSection
        eyebrow="Initiatives"
        title="Six programmes that organise our ongoing work."
        tone="surface"
      >
        <ul className="grid gap-4 lg:grid-cols-2">
          {PROGRAMMES.map((item) => (
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
        tone="base"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {PROJECTS.map((project) => (
            <article
              key={project.title}
              className="rounded-3xl border border-border-default bg-bg-surface p-6"
            >
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
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-text-muted">
          See how these efforts sit under our pillars on{" "}
          <Link href="/what-we-do" className="font-semibold text-brand-sky hover:underline">
            What we do
          </Link>
          , or explore outcomes on{" "}
          <Link href="/impact" className="font-semibold text-brand-sky hover:underline">
            Impact
          </Link>
          .
        </p>
      </ContentSection>
    </>
  );
}
