import { CtaBand } from "@/components/layout/content-section";
import { ReportContent } from "@/components/reports/report-content";
import { ReportHeader } from "@/components/reports/report-header";
import type { PublicNewsItem } from "@/features/content/public-content";

function inferLocationHint(report: PublicNewsItem): string | null {
  const match = report.body.match(/\*\*Venue\*\*\s*:\s*([^\n•]+)/i);
  if (match?.[1]) return match[1].trim();
  if (/Enchi/i.test(report.summary) || /Enchi/i.test(report.title)) {
    return "Enchi, Western North Region, Ghana";
  }
  return null;
}

/**
 * Shared public report presentation — used for every programme report.
 * Source PDFs stay internal; visitors get the online report + branded download.
 */
export function ReportDetailView({ report }: { report: PublicNewsItem }) {
  const fileName = `${report.slug}-ggi.pdf`;

  return (
    <>
      <ReportHeader
        title={report.title}
        summary={report.summary}
        publishedOn={report.publishedOn}
        locationHint={inferLocationHint(report)}
        body={report.body}
        fileName={fileName}
      />
      <ReportContent
        title={report.title}
        summary={report.summary}
        body={report.body}
        slug={report.slug}
        publishedOn={report.publishedOn}
        fileName={fileName}
      />
      <CtaBand
        title="Support the next chapter of this work."
        primary={{ href: "/get-involved/donate", label: "Donate" }}
        secondary={{ href: "/partner", label: "Partner with GGI" }}
      />
    </>
  );
}
