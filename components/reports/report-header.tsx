import { CalendarDays, MapPin } from "lucide-react";
import { PageBreadcrumb } from "@/components/layout/editorial";
import { Reveal } from "@/components/motion/reveal";
import { ReportDownloadButton } from "@/components/reports/report-download-button";

type ReportHeaderProps = {
  title: string;
  summary: string;
  publishedOn?: string | null;
  locationHint?: string | null;
  body: string;
  fileName: string;
};

export function ReportHeader({
  title,
  summary,
  publishedOn,
  locationHint,
  body,
  fileName,
}: ReportHeaderProps) {
  return (
    <section className="relative -mt-[var(--public-header-offset)] overflow-hidden bg-brand-navy text-text-on-inverse">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy to-brand-navy/90" />
      <Reveal className="relative mx-auto max-w-6xl px-4 pb-8 pt-[calc(var(--public-header-offset)+1.5rem)] lg:px-6 lg:pb-10">
        <PageBreadcrumb current="Reports" onDark />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-brand-magenta px-3 py-1 text-xs font-bold uppercase tracking-wide">
            Girls Global Initiative
          </span>
          <span className="inline-flex rounded-full border border-white/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
            Programme report
          </span>
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-3xl font-bold leading-tight sm:text-4xl">
          {title}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/85">
          {publishedOn ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-brand-sky" aria-hidden />
              {publishedOn}
            </span>
          ) : null}
          {locationHint ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand-sky" aria-hidden />
              {locationHint}
            </span>
          ) : null}
        </div>
        {summary ? (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
            {summary}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <ReportDownloadButton
            title={title}
            summary={summary}
            publishedOn={publishedOn}
            body={body}
            fileName={fileName}
          />
          <a
            href="#report-body"
            className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-sm font-semibold text-text-on-inverse hover:border-brand-sky hover:text-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
          >
            Read online
          </a>
        </div>
      </Reveal>
    </section>
  );
}
