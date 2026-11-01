import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import {
  ContentSection,
  CtaBand,
} from "@/components/layout/content-section";
import { PageHeroEditorial } from "@/components/layout/public-page-intro";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { getPublicReports } from "@/features/content/public-content";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: "Reports",
  description:
    "Programme and activity reports from Girls Global Initiative school and community work.",
  path: "/reports",
});

export default async function ReportsPage() {
  const reports = await getPublicReports();

  return (
    <>
      <PageHeroEditorial
        breadcrumb="Reports"
        badge="Reports"
        meta="Programmes · Evidence · Learning"
        title="Programme reports from the field."
        description="Proofread activity and programme reports in GGI's official format — read online or download the full report."
        tone="sky"
        ctas={[
          { href: "/news", label: "News updates", variant: "secondary" },
          { href: "/gallery", label: "Gallery" },
        ]}
      />

      <ContentSection
        eyebrow="Published reports"
        title="What we documented and learned."
        description={
          reports.length === 0
            ? "Reports will appear here when published from Admin → Content → Reports."
            : "Open a report to read online, then download the full report in GGI's official document format."
        }
        tone="cream"
      >
        {reports.length === 0 ? (
          <p className="rounded-[1.5rem] border border-dashed border-border-default bg-bg-surface p-8 text-sm text-text-muted">
            No programme reports are published yet.
          </p>
        ) : (
          <Stagger className="grid gap-6 lg:grid-cols-2">
            {reports.map((item) => (
              <StaggerItem key={item.id}>
                <Link
                  href={`/reports/${item.slug}`}
                  className="block overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-surface transition hover:border-brand-sky/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
                >
                  <div className="relative h-52 bg-blob-sky/30">
                    {item.imageSrc ? (
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-brand-navy/40">
                        <FileText className="h-10 w-10" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    {item.publishedOn ? (
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">
                        {item.publishedOn}
                      </p>
                    ) : null}
                    <h2 className="mt-2 font-display text-xl font-bold text-brand-navy">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {item.summary}
                    </p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-brand-sky">
                      Open report
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </ContentSection>

      <CtaBand
        title="Invite GGI to document work in your community."
        primary={{ href: "/partner", label: "Partner with us" }}
        secondary={{ href: "/contact", label: "Contact" }}
      />
    </>
  );
}
