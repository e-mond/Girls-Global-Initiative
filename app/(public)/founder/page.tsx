import Image from "next/image";
import Link from "next/link";
import {
  Crown,
  GraduationCap,
  HeartHandshake,
  Megaphone,
  Users,
} from "lucide-react";
import {
  DualToneCards,
} from "@/components/layout/editorial";
import {
  ContentSection,
  CtaBand,
  Prose,
  QuoteBand,
} from "@/components/layout/content-section";
import { PageHeroSplit } from "@/components/layout/public-page-intro";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { FOUNDER_MESSAGE } from "@/content/site-copy";
import { founderSpotlight } from "@/features/content/mock-home";

const calloutIcons = {
  megaphone: Megaphone,
  graduation: GraduationCap,
  users: Users,
} as const;

export default function FounderPage() {
  return (
    <>
      <PageHeroSplit
        breadcrumb="Founder"
        badge="Leadership"
        meta="Founder & Executive Director"
        title={founderSpotlight.name}
        description={founderSpotlight.body}
        imageSrc={founderSpotlight.imageSrc}
        imageAlt={founderSpotlight.name}
        imageShape="arch"
        imageCaption={founderSpotlight.name}
        imageTags={founderSpotlight.role}
        ctas={[
          { href: "/team", label: "Meet the team", variant: "secondary" },
          { href: "/get-involved", label: "Support the mission" },
        ]}
      >
        <p className="font-display text-xl font-bold text-brand-navy sm:text-2xl">
          &ldquo;{founderSpotlight.quote}&rdquo;
        </p>
      </PageHeroSplit>

      <ContentSection tone="surface">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-base px-3 py-1.5 text-xs font-medium text-brand-navy">
              <Crown className="h-3.5 w-3.5 text-brand-magenta" aria-hidden />
              {founderSpotlight.badge}
            </span>
            <Stagger className="mt-6 grid gap-3 sm:grid-cols-3">
              {founderSpotlight.callouts.map((item) => {
                const Icon = calloutIcons[item.icon];
                return (
                  <StaggerItem key={item.title}>
                    <div className="h-full rounded-2xl border border-border-default bg-bg-base p-4">
                      <Icon
                        className="h-4 w-4 text-brand-magenta"
                        aria-hidden
                      />
                      <p className="mt-3 text-sm font-semibold text-brand-navy">
                        {item.title}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-text-muted">
                        {item.body}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Reveal>
          <Reveal delay={0.08}>
            <aside className="rounded-[1.75rem] border border-border-default bg-blob-sky/35 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
                Leadership
              </p>
              <p className="mt-3 font-display text-lg font-bold text-brand-navy">
                Youth-led. Community-rooted. Girls first.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                Philomena leads GGI so girls do not have to navigate rights,
                health, school and opportunity alone.
              </p>
              <Link
                href="/our-story"
                className="mt-5 inline-flex text-sm font-semibold text-brand-sky hover:underline"
              >
                Read our story
              </Link>
            </aside>
          </Reveal>
        </div>
      </ContentSection>

      <QuoteBand
        quote="Every girl deserves the opportunity to dream, learn, grow, lead and build a meaningful future."
        attribution={FOUNDER_MESSAGE.signatureName}
        tone="navy"
      />

      <DualToneCards
        left={{
          label: "Lived understanding",
          body: "Leadership shaped by listening to girls in rural, remote and underserved communities.",
          icon: HeartHandshake,
          tone: "pink",
        }}
        right={{
          label: "A clear charge",
          body: "Close the gap where barriers are greatest — with education, rights, health and mentorship.",
          icon: Users,
          tone: "sky",
        }}
      />

      <ContentSection
        eyebrow="Message from the Founder"
        title="Closing the gap where barriers are greatest."
        tone="cream"
        narrow
      >
        <Prose>
          {FOUNDER_MESSAGE.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </Prose>
        <div className="mt-10 flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-full">
            <Image
              src={founderSpotlight.imageSrc}
              alt=""
              fill
              className="object-cover object-top"
              sizes="56px"
            />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-brand-navy">
              {FOUNDER_MESSAGE.signatureName}
            </p>
            <p className="text-sm text-text-muted">
              {FOUNDER_MESSAGE.signatureRole}
            </p>
          </div>
        </div>
      </ContentSection>

      <CtaBand
        title="Stand with the girls GGI serves."
        primary={{ href: "/get-involved/donate", label: "Support a girl" }}
        secondary={{ href: "/team", label: "Meet the team" }}
      />
    </>
  );
}
