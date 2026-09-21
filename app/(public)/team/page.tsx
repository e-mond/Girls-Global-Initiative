import Image from "next/image";
import Link from "next/link";
import { PageHeroCompact } from "@/components/layout/public-page-intro";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { TAGLINE } from "@/content/site-copy";
import { teamMembers } from "@/features/content/mock-home";

export default function TeamPage() {
  return (
    <>
      <PageHeroCompact
        eyebrow="Team"
        title="Meet the people building GGI."
        description={`Youth-led leadership rooted in community. ${TAGLINE}`}
      />

      <ContentSection tone="sky">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.id}
              className="overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-surface shadow-sm"
            >
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
          ))}
        </div>
      </ContentSection>

      <CtaBand
        title="Want to work alongside this team?"
        description="Volunteer, partner or write to GGI."
        primary={{ href: "/get-involved/volunteer", label: "Volunteer" }}
        secondary={{ href: "/contact", label: "Contact us" }}
        tone="navy"
      />
    </>
  );
}
