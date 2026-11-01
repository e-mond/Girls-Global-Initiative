import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarDays, FileText, MapPin } from "lucide-react";
import { CtaBand } from "@/components/layout/content-section";
import { PageBreadcrumb } from "@/components/layout/editorial";
import { Reveal } from "@/components/motion/reveal";
import { ShareButtons } from "@/components/news/share-buttons";
import { DownloadBrandedPdf } from "@/components/reports/download-branded-pdf";
import type { PublicNewsItem } from "@/features/content/public-content";

type Block =
  | { type: "heading"; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "link"; label: string; href: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

/** Render inline markdown emphasis without leaving raw ** markers visible. */
function renderInline(text: string) {
  // Convert legacy `**Label:**` (colon inside markers) to `**Label**:`.
  const normalized = text.replace(/\*\*([^*]+):\*\*/g, "**$1**:");
  const parts = normalized.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={`${part}-${index}`}
          className="font-semibold text-brand-navy"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Fallback: strip unpaired emphasis markers so they never show as plain text.
    const cleaned = part.replace(/\*\*/g, "");
    return <span key={`${cleaned.slice(0, 24)}-${index}`}>{cleaned}</span>;
  });
}

function parseBlocks(body: string): Block[] {
  const chunks = body
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
  const blocks: Block[] = [];

  for (const chunk of chunks) {
    if (chunk.startsWith("## ")) {
      const text = chunk.replace(/^##\s+/, "");
      blocks.push({ type: "heading", text, id: slugify(text) });
      continue;
    }
    const linkMatch = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      blocks.push({ type: "link", label: linkMatch[1], href: linkMatch[2] });
      continue;
    }
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (
      lines.length >= 2 &&
      lines.every((line) => line.startsWith("|") && line.endsWith("|"))
    ) {
      const rows = lines
        .filter((line) => !/^\|[\s|:-]+\|$/.test(line))
        .map((line) =>
          line
            .slice(1, -1)
            .split("|")
            .map((cell) => cell.trim()),
        );
      if (rows.length) {
        blocks.push({ type: "table", rows });
        continue;
      }
    }
    if (
      lines.length > 1 &&
      lines.every(
        (line) =>
          /^•\s+/.test(line) ||
          /^\*\*[^*]+\*\*:/.test(line) ||
          /^\*\*[^*]+\*\*\s*:/.test(line),
      )
    ) {
      blocks.push({
        type: "list",
        items: lines.map((line) => line.replace(/^•\s+/, "")),
      });
      continue;
    }
    blocks.push({ type: "paragraph", text: chunk });
  }
  return blocks;
}

function inferLocationHint(report: PublicNewsItem): string | null {
  const match = report.body.match(/\*\*Venue\*\*\s*:\s*([^\n•]+)/i);
  if (match?.[1]) return match[1].trim();
  if (/Enchi/i.test(report.summary) || /Enchi/i.test(report.title)) {
    return "Enchi, Western North Region, Ghana";
  }
  return null;
}

export function ReportDetailView({ report }: { report: PublicNewsItem }) {
  const blocks = parseBlocks(report.body);
  const headings = blocks.filter(
    (block): block is Extract<Block, { type: "heading" }> =>
      block.type === "heading",
  );
  const locationHint = inferLocationHint(report);

  return (
    <>
      <section className="relative -mt-[var(--public-header-offset)] overflow-hidden bg-brand-navy text-text-on-inverse">
        <div className="absolute inset-0">
          {report.imageSrc ? (
            <Image
              src={report.imageSrc}
              alt=""
              fill
              priority
              className="object-cover opacity-25"
              sizes="100vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/92 to-brand-navy/75" />
        </div>
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
            {report.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/85">
            {report.publishedOn ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-brand-sky" aria-hidden />
                {report.publishedOn}
              </span>
            ) : null}
            {locationHint ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand-sky" aria-hidden />
                {locationHint}
              </span>
            ) : null}
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
            {report.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <DownloadBrandedPdf
              title={report.title}
              summary={report.summary}
              publishedOn={report.publishedOn}
              body={report.body}
              fileName={`${report.slug}-ggi.pdf`}
              label="Download Full Report"
            />
            <a
              href="#report-body"
              className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-sm font-semibold text-text-on-inverse hover:border-brand-sky hover:text-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
            >
              Read online
            </a>
            {report.attachmentUrl ? (
              <a
                href={report.attachmentUrl}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold text-text-on-inverse hover:border-brand-sky hover:text-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
              >
                <FileText className="h-4 w-4" aria-hidden />
                Original source PDF
              </a>
            ) : null}
          </div>
        </Reveal>
      </section>

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
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className="font-medium text-brand-navy hover:text-brand-sky"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
            {report.attachmentUrl ? (
              <a
                href={report.attachmentUrl}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-sky hover:underline"
              >
                <FileText className="h-4 w-4" aria-hidden />
                Original source PDF
              </a>
            ) : null}
          </nav>

          <article className="rounded-[1.75rem] border border-border-default bg-bg-surface p-6 sm:p-10">
            <div className="flex items-center gap-2 text-brand-magenta">
              <BookOpen className="h-4 w-4" aria-hidden />
              <p className="text-xs font-bold uppercase tracking-wide">
                Official GGI report
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {blocks.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={`${block.id}-${index}`}
                      id={block.id}
                      className="scroll-mt-28 border-l-4 border-brand-sky pl-4 pt-4 font-display text-2xl font-bold text-brand-navy"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul
                      key={`list-${index}`}
                      className="space-y-2 pl-1 text-base leading-relaxed text-text-muted"
                    >
                      {block.items.map((item) => (
                        <li key={item.slice(0, 48)} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-magenta" />
                          <span>{renderInline(item)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === "table") {
                  return (
                    <div
                      key={`table-${index}`}
                      className="overflow-x-auto rounded-xl border border-border-default"
                    >
                      <table className="min-w-full text-left text-sm">
                        <tbody>
                          {block.rows.map((row, rowIndex) => (
                            <tr
                              key={`row-${rowIndex}`}
                              className={
                                rowIndex === 0
                                  ? "bg-brand-navy text-text-on-inverse"
                                  : "border-t border-border-default text-text-muted"
                              }
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={`cell-${rowIndex}-${cellIndex}`}
                                  className="px-3 py-2 align-top"
                                >
                                  {renderInline(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                if (block.type === "link") {
                  return (
                    <p key={`link-${index}`}>
                      <a
                        href={block.href}
                        className="font-semibold text-brand-sky hover:underline"
                      >
                        {block.label}
                      </a>
                    </p>
                  );
                }
                return (
                  <p
                    key={`p-${index}`}
                    className="whitespace-pre-line text-base leading-relaxed text-text-muted"
                  >
                    {renderInline(block.text)}
                  </p>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border border-brand-sky/30 bg-blob-sky/20 p-5">
              <p className="font-display text-lg font-bold text-brand-navy">
                Download Full Report
              </p>
              <p className="mt-2 text-sm text-text-muted">
                A newly generated Girls Global Initiative PDF — not a reprint of
                the original source layout — for sharing with partners and
                schools.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <DownloadBrandedPdf
                  title={report.title}
                  summary={report.summary}
                  publishedOn={report.publishedOn}
                  body={report.body}
                  fileName={`${report.slug}-ggi.pdf`}
                  label="Download Full Report"
                />
                {report.attachmentUrl ? (
                  <a
                    href={report.attachmentUrl}
                    className="inline-flex h-11 items-center rounded-full border border-border-default bg-bg-surface px-5 text-sm font-semibold text-brand-navy hover:border-brand-sky"
                  >
                    Original source PDF
                  </a>
                ) : null}
              </div>
            </div>

            <ShareButtons
              className="mt-8"
              title={report.title}
              summary={report.summary}
              url={`/reports/${report.slug}`}
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

      <CtaBand
        title="Support the next chapter of this work."
        primary={{ href: "/get-involved/donate", label: "Donate" }}
        secondary={{ href: "/partner", label: "Partner with GGI" }}
      />
    </>
  );
}
