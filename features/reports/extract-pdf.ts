import { readFile } from "fs/promises";
import path from "path";
import { structureReportFromText } from "@/features/reports/structure-from-text";
import type { ExtractedReportDraft } from "@/features/reports/types";

function resolveLocalPdfPath(source: string): string | null {
  try {
    if (source.startsWith("/")) {
      return path.join(process.cwd(), "public", source.replace(/^\//, ""));
    }
    const url = new URL(source);
    if (
      url.hostname.includes("girlsglobalinitiative.org") ||
      url.hostname === "localhost"
    ) {
      return path.join(process.cwd(), "public", url.pathname.replace(/^\//, ""));
    }
  } catch {
    // not a URL
  }
  return null;
}

async function readPdfBuffer(source: string): Promise<Buffer> {
  const local = resolveLocalPdfPath(source);
  if (local) {
    try {
      return await readFile(local);
    } catch {
      // fall through to remote fetch
    }
  }

  const response = await fetch(source);
  if (!response.ok) {
    throw new Error("Could not download the source PDF.");
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (
    !contentType.includes("pdf") &&
    !source.toLowerCase().endsWith(".pdf")
  ) {
    throw new Error("The source URL did not return a PDF file.");
  }
  return Buffer.from(await response.arrayBuffer());
}

function tablesToMarkdown(
  pages: Array<{ tables?: string[][][] }> | undefined,
): string {
  if (!pages?.length) return "";
  const blocks: string[] = [];
  for (const page of pages) {
    for (const table of page.tables ?? []) {
      if (!table.length) continue;
      const rows = table
        .map((row) =>
          `| ${row.map((cell) => String(cell ?? "").replace(/\|/g, "\\|").trim()).join(" | ")} |`,
        )
        .filter((row) => row.replace(/[|\s]/g, "").length > 0);
      if (rows.length < 2) continue;
      const colCount = Math.max(
        ...table.map((row) => row.length),
        1,
      );
      const separator = `| ${Array.from({ length: colCount }, () => "---").join(" | ")} |`;
      blocks.push([rows[0], separator, ...rows.slice(1)].join("\n"));
    }
  }
  return blocks.join("\n\n");
}

/**
 * Extract text (and tables where available) from a PDF source and shape a draft.
 * Heavy work — call from Node scripts or Node-runtime admin routes only.
 * OCR for scanned PDFs is not automatic; short extracts are flagged for review.
 */
export async function extractReportFromPdfSource(
  source: string,
): Promise<ExtractedReportDraft> {
  const buffer = await readPdfBuffer(source.trim());
  if (buffer.byteLength < 64) {
    throw new Error("The PDF file appears empty.");
  }
  if (buffer.byteLength > 25 * 1024 * 1024) {
    throw new Error("PDFs larger than 25MB cannot be processed in one pass.");
  }

  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  try {
    const textResult = await parser.getText();
    let tableMarkdown = "";
    try {
      const tableResult = await parser.getTable();
      tableMarkdown = tablesToMarkdown(tableResult.pages);
    } catch {
      // Tables are best-effort; text extraction remains authoritative.
    }

    const text = (textResult.text ?? "").trim();
    const pageCount = textResult.total ?? textResult.pages?.length ?? 0;

    if (!text) {
      return {
        title: "Programme report",
        summary:
          "No selectable text was found. This PDF may be scanned — upload OCR output or enter content manually for review.",
        publishedOn: "",
        body: "## Programme overview\n\nNo selectable text could be extracted from this PDF. Administrator review and manual entry are required.",
        extractionNotes:
          "FAILED_TEXT_LAYER: No extractable text. OCR is required for scanned PDFs.",
        extractedRaw: "",
        pageCount,
        uncertain: true,
      };
    }

    const combined = tableMarkdown
      ? `${text}\n\n## Extracted tables\n\n${tableMarkdown}`
      : text;

    return structureReportFromText(combined, { pageCount });
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}
