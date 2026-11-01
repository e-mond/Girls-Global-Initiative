"use client";

import { DownloadBrandedPdf } from "@/components/reports/download-branded-pdf";

type ReportDownloadButtonProps = {
  title: string;
  summary: string;
  publishedOn?: string | null;
  body: string;
  fileName?: string;
  className?: string;
};

/** Public CTA for the official GGI branded report PDF. */
export function ReportDownloadButton(props: ReportDownloadButtonProps) {
  return (
    <DownloadBrandedPdf
      {...props}
      label="Download the Full Report"
    />
  );
}
