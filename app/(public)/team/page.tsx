import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { teamMembers } from "@/features/content/mock-home";

export default function TeamPage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Team"
        title="Meet the team"
        description="The people building Girls Global Initiative — youth-led leadership rooted in community."
      />
      <section className="bg-bg-surface px-4 pb-16 lg:px-6 lg:pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.id}
              className="overflow-hidden rounded-3xl border border-border-default bg-bg-base"
            >
              <div className="relative aspect-[4/5] bg-blob-sky">
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
                    Read the founder spotlight
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
