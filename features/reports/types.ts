export const REPORT_EXTRACTION_STATUSES = [
  "none",
  "pending",
  "extracted",
  "needs_review",
  "approved",
  "failed",
] as const;

export type ReportExtractionStatus =
  (typeof REPORT_EXTRACTION_STATUSES)[number];

export type ExtractedReportDraft = {
  title: string;
  summary: string;
  publishedOn: string;
  body: string;
  extractionNotes: string;
  extractedRaw: string;
  pageCount: number;
  uncertain: boolean;
};
