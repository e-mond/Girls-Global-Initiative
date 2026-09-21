import Image from "next/image";
import Link from "next/link";
import { BookOpen, HeartHandshake, Users } from "lucide-react";
import {
  IconFeatureGrid,
  PhotoBand,
  ProcessBand,
} from "@/components/layout/editorial";
import {
  ContentSection,
  CtaBand,
  RelatedLinks,
} from "@/components/layout/content-section";
import { PageHeroSplit } from "@/components/layout/public-page-intro";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PROGRAMMES, PROJECTS } from "@/content/site-copy";

export default function ProgrammesPage() {
  const [featured, ...rest] = PROGRAMMES;

  return (
    <>
      <PageHeroSplit
        breadcrumb="Programmes"
        badge="Programmes"
        meta="Initiatives · Projects · Outreach"
        title="Programmes, initiatives and projects."
        description="GGI delivers its mission through focused initiatives and community projects: from school tours and mentorship to rural girl empowerment."
        imageSrc="/home/community-2.jpg"
        imageAlt="Girls participating in a GGI community programme"
        imageCaption="Work that travels"
        imageTags="Schools · Mentorship · Health"
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
        eyebrow="How programmes move"
        title="From invitation to girls in the room."
        tone="surface"
      >
        <IconFeatureGrid
          items={[
            {
              title: "Learn with girls",
              body: "School tours and educational support that keep girls engaged.",
              icon: BookOpen,
            },
            {
              title: "Care for wellbeing",
              body: "Health, menstrual education and practical hygiene support.",
              icon: HeartHandshake,
            },
            {
              title: "Walk with community",
              body: "Mentorship, guidance and rural outreach with local partners.",
              icon: Users,
            },
          ]}
        />
      </ContentSection>

      <ContentSection
        eyebrow="Initiatives"
        title="Programmes that organise our ongoing work."
        tone="cream"
      >
        <Stagger className="grid gap-4 lg:grid-cols-2">
          {rest.map((item) => (
            <StaggerItem key={item.title}>
              <li className="list-none rounded-3xl border border-border-default bg-bg-surface p-6">
                <h2 className="font-display text-xl font-bold text-brand-navy">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {item.body}
                </p>
              </li>
            </StaggerItem>
          ))}
        </Stagger>
      </ContentSection>

      <ProcessBand
        eyebrow="Project rhythm"
        title="Projects that gather girls where they learn and live."
        steps={PROJECTS.slice(0, 4).map((project, index) => ({
          step: String(index + 1).padStart(2, "0"),
          title: project.title,
          body: project.summary,
        }))}
      />

      <ContentSection
        eyebrow="Projects"
        title="Detail for partners and community hosts."
        tone="blush"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.05}>
              <article className="overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-surface">
                <div className="relative h-40">
                  <Image
                    src={
                      index % 2 === 0
                        ? "/home/community-2.jpg"
                        : "/home/community-3.jpg"
                    }
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
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
            </Reveal>
          ))}
        </div>
      </ContentSection>

      <PhotoBand src="/our-story/values.jpg" alt="Girls learning through GGI programmes" />

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
