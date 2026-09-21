import Image from "next/image";
import Link from "next/link";
import { Handshake, Heart, Sparkles, Users } from "lucide-react";
import {
  IconFeatureGrid,
  PhotoBand,
} from "@/components/layout/editorial";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { PageHeroSplit } from "@/components/layout/public-page-intro";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { TAGLINE } from "@/content/site-copy";
import { teamMembers } from "@/features/content/mock-home";

export default function TeamPage() {
  return (
    <>
      <PageHeroSplit
        breadcrumb="Team"
        badge="Team"
        meta="Youth-led · Community-rooted"
        title="Meet the people building GGI."
        description={`A small leadership circle advancing rights, health and opportunity for girls. ${TAGLINE}`}
        imageSrc="/home/founder.jpg"
        imageAlt="Girls Global Initiative leadership"
        imageCaption="Built around girls"
        imageTags="Leadership · Trust · Care"
        ctas={[
          { href: "/founder", label: "Meet the founder" },
          {
            href: "/get-involved/volunteer",
            label: "Volunteer",
            variant: "secondary",
          },
        ]}
      />

      <ContentSection
        eyebrow="How we work together"
        title="Roles that keep girls at the centre."
        tone="surface"
      >
        <IconFeatureGrid
          columns={2}
          items={[
            {
              title: "Shared leadership",
              body: "Youth-led direction with clear accountability to girls and communities.",
              icon: Users,
            },
            {
              title: "Programme care",
              body: "Day-to-day coordination of outreach, education and safe spaces.",
              icon: Sparkles,
            },
            {
              title: "Community trust",
              body: "Relationships with schools, families and local partners.",
              icon: Handshake,
            },
            {
              title: "Dignity first",
              body: "Every role protects girls' voices, privacy and wellbeing.",
              icon: Heart,
            },
          ]}
        />
      </ContentSection>

      <ContentSection
        eyebrow="The circle"
        title="Names, roles and the work they hold."
        tone="sky"
      >
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <StaggerItem key={member.id}>
              <article className="overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-surface shadow-sm">
                <div className="relative aspect-[4/5] bg-blob-pink/40">
                  <Image
                    src={member.imageSrc}
                    alt={
                      member.photoPending
                        ? `Photo coming soon for ${member.name}`
                        : `${member.name}, ${member.role}`
                    }
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {member.photoPending ? (
                    <span className="absolute left-3 top-3 rounded-full bg-bg-surface/95 px-3 py-1 text-[11px] font-semibold text-brand-navy">
                      Photo coming soon
                    </span>
                  ) : null}
                </div>
                <div className="space-y-1 p-5">
                  <h2 className="font-display text-lg font-bold text-brand-navy">
                    {member.name}
                  </h2>
                  <p className="text-sm font-medium text-brand-magenta">
                    {member.role}
                  </p>
                  {member.isFounder ? (
                    <Link
                      href="/founder"
                      className="mt-3 inline-flex text-sm font-semibold text-brand-sky hover:underline"
                    >
                      Read the founder message
                    </Link>
                  ) : null}
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </ContentSection>

      <PhotoBand src="/our-story/growth.jpg" alt="Girls growing with GGI support" />

      <CtaBand
        title="Want to work alongside this team?"
        description="Volunteer, partner or write to GGI."
        primary={{ href: "/get-involved/volunteer", label: "Volunteer" }}
        secondary={{ href: "/contact", label: "Contact us" }}
      />
    </>
  );
}
