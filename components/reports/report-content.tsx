import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ShareButtons } from "@/components/news/share-buttons";
import { ReportDownloadButton } from "@/components/reports/report-download-button";
import {
  MarkdownBlocks,
  parseMarkdownBlocks,
} from "@/lib/content/safe-markdown";

type ReportContentProps = {
  title: string;
  summary: string;
  body: string;
  slug: string;
  publishedOn?: string | null;
  fileName: string;
};

export function ReportContent({
  title,
  summary,
  body,
  slug,
  publishedOn,
  fileName,
}: ReportContentProps) {
  const blocks = parseMarkdownBlocks(body);
  const headings = blocks.filter(
    (block) => block.type === "heading" && block.level === 2,
  );

  return (
    <section
      id="report-body"
      className="scroll-mt-28 bg-bg-base px-4 py-10 lg:px-6 lg:py-14"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-label="Report sections"
          className="hidden lg:block lg:sticky lg:top-28 lg:self-start"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
            Contents
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {headings.map((heading) =>
              heading.type === "heading" ? (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className="font-medium text-brand-navy hover:text-brand-sky"
                  >
                    {heading.text}
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </nav>

        <article className="rounded-[1.75rem] border border-border-default bg-bg-surface p-6 sm:p-10">
          <div className="flex items-center gap-2 text-brand-magenta">
            <BookOpen className="h-4 w-4" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-wide">
              Official GGI report
            </p>
          </div>

          <div className="prose-report mt-8 max-w-3xl">
            <MarkdownBlocks blocks={blocks} className="space-y-6" />
          </div>

          <div className="mt-10 rounded-2xl border border-brand-sky/30 bg-blob-sky/20 p-5">
            <p className="font-display text-lg font-bold text-brand-navy">
              Download the Full Report
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Download the complete report in GGI&apos;s official document
              format.
            </p>
            <div className="mt-4">
              <ReportDownloadButton
                title={title}
                summary={summary}
                publishedOn={publishedOn}
                body={body}
                fileName={fileName}
              />
            </div>
          </div>

          <ShareButtons
            className="mt-8"
            title={title}
            summary={summary}
            url={`/reports/${slug}`}
          />

          <p className="mt-8">
            <Link
              href="/reports"
              className="text-sm font-semibold text-brand-sky hover:underline"
            >
              ← All reports
            </Link>
          </p>
        </article>
      </div>
    </section>
  );
}
