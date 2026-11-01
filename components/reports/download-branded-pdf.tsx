"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";

type DownloadBrandedPdfProps = {
  title: string;
  summary: string;
  publishedOn?: string | null;
  body: string;
  fileName?: string;
  className?: string;
};

const NAVY: [number, number, number] = [4, 27, 75];
const MAGENTA: [number, number, number] = [224, 2, 134];
const SKY: [number, number, number] = [0, 176, 242];
const CREAM: [number, number, number] = [253, 246, 236];

function wrapLines(
  doc: { getTextWidth: (t: string) => number },
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (doc.getTextWidth(next) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export function DownloadBrandedPdf({
  title,
  summary,
  publishedOn,
  body,
  fileName,
  className,
}: DownloadBrandedPdfProps) {
  const [busy, setBusy] = useState(false);

  async function onDownload() {
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 54;
      const maxWidth = pageWidth - margin * 2;
      let y = 0;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - 64) {
          doc.addPage();
          y = margin + 28;
        }
      };

      // Cover
      doc.setFillColor(...NAVY);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      doc.setFillColor(...MAGENTA);
      doc.rect(0, 0, 14, pageHeight, "F");
      doc.setFillColor(...SKY);
      doc.rect(14, 0, 6, pageHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("GIRLS GLOBAL INITIATIVE", margin + 12, 72);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Official programme report", margin + 12, 90);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      y = 150;
      for (const line of wrapLines(doc, title, maxWidth - 12)) {
        doc.text(line, margin + 12, y);
        y += 28;
      }
      if (publishedOn) {
        y += 12;
        doc.setTextColor(...SKY);
        doc.setFontSize(12);
        doc.text(publishedOn, margin + 12, y);
      }
      y += 36;
      doc.setTextColor(230, 235, 245);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      for (const line of wrapLines(doc, summary, maxWidth - 12)) {
        doc.text(line, margin + 12, y);
        y += 16;
      }
      doc.setFontSize(9);
      doc.setTextColor(180, 190, 210);
      doc.text("girlsglobalinitiative.org", margin + 12, pageHeight - 48);

      // Body pages
      doc.addPage();
      doc.setFillColor(...CREAM);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      y = margin + 28;

      const blocks = body
        .split(/\n\n+/)
        .map((block) => block.trim())
        .filter(Boolean);

      for (const block of blocks) {
        if (block.startsWith("## ")) {
          y += 12;
          ensureSpace(36);
          doc.setDrawColor(...SKY);
          doc.setLineWidth(3);
          doc.line(margin, y - 12, margin, y + 8);
          doc.setTextColor(...NAVY);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.text(block.replace(/^##\s+/, ""), margin + 10, y);
          y += 22;
          continue;
        }
        if (/^\[[^\]]+\]\([^)]+\)$/.test(block)) continue;

        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
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
                .map((cell) => cell.replace(/\*\*/g, "").trim()),
            );
          for (const [rowIndex, row] of rows.entries()) {
            const text = row.join("  ·  ");
            ensureSpace(16);
            doc.setFont("helvetica", rowIndex === 0 ? "bold" : "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(...(rowIndex === 0 ? NAVY : ([55, 55, 65] as [number, number, number])));
            for (const line of wrapLines(doc, text, maxWidth)) {
              ensureSpace(13);
              doc.text(line, margin, y);
              y += 13;
            }
            y += 3;
          }
          y += 8;
          continue;
        }

        const isList = lines.every(
          (line) => line.startsWith("•") || /^\*\*[^*]+\*\*:/.test(line),
        );
        if (isList) {
          doc.setFontSize(10.5);
          doc.setTextColor(55, 55, 65);
          for (const item of lines) {
            const clean = item.replace(/^•\s+/, "").replace(/\*\*/g, "");
            const wrapped = wrapLines(doc, `• ${clean}`, maxWidth);
            for (const [lineIndex, line] of wrapped.entries()) {
              ensureSpace(14);
              doc.setFont(
                "helvetica",
                lineIndex === 0 && /^\*\*/.test(item) ? "bold" : "normal",
              );
              doc.text(line, margin, y);
              y += 14;
            }
            y += 4;
          }
          y += 6;
          continue;
        }

        doc.setTextColor(55, 55, 65);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        const clean = block.replace(/\*\*/g, "");
        for (const line of wrapLines(doc, clean, maxWidth)) {
          ensureSpace(14);
          doc.text(line, margin, y);
          y += 14;
        }
        y += 10;
      }

      const pages = doc.getNumberOfPages();
      for (let i = 2; i <= pages; i += 1) {
        doc.setPage(i);
        doc.setFillColor(...NAVY);
        doc.rect(0, 0, pageWidth, 28, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text("Girls Global Initiative  ·  Programme report", margin, 18);
        doc.setDrawColor(...MAGENTA);
        doc.setLineWidth(2);
        doc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
        doc.setTextColor(...NAVY);
        doc.text(
          "Generated branded PDF from reviewed report content — not a reprint of the source layout.",
          margin,
          pageHeight - 24,
        );
        doc.text(`Page ${i - 1} of ${pages - 1}`, pageWidth - margin, pageHeight - 24, {
          align: "right",
        });
      }

      const safeName =
        fileName ||
        `${title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 60) || "ggi-report"}.pdf`;
      doc.save(safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onDownload()}
      disabled={busy}
      className={
        className ??
        "inline-flex h-11 items-center gap-2 rounded-full bg-brand-magenta px-5 text-sm font-semibold text-text-on-inverse hover:bg-brand-magenta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky disabled:opacity-60"
      }
    >
      <FileDown className="h-4 w-4" aria-hidden />
      {busy ? "Preparing PDF…" : "Download branded PDF"}
    </button>
  );
}
