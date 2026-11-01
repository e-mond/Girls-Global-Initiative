# Report PDF extraction & branded generation

## Purpose

Source PDFs are content inputs, not the published presentation. Staff extract
text from an uploaded or linked PDF, review and correct the draft, approve it,
then publish a GGI-branded online report and a separately generated downloadable
PDF.

## Workflow

1. Admin → Content → Reports
2. Provide a public path or URL (for example `/reports/breast-cancer-awareness-2026.pdf`)
3. Extract — Node route `POST /api/admin/reports/extract` (`runtime = "nodejs"`)
4. Review / edit title, summary, body (`##` sections), source URL
5. Approve (`POST /api/admin/reports/approve`) — required before publish
6. Publish — gated in content PATCH when `kind = report` and extraction is not approved

Original source PDF remains in `news_posts.attachment_url` for **admin reference
only**. It is never linked on public report pages. Visitors use the online report
and **Download the Full Report** (GGI branded PDF generated from reviewed content).

## Extraction pipeline

* Library: `pdf-parse` v2 (`PDFParse.getText`, best-effort `getTable`)
* Structuring: `features/reports/structure-from-text.ts`
* Entry: `features/reports/extract-pdf.ts`
* Seed / QA script: `npm run db:extract-programme-reports`
* Statuses: `none | pending | extracted | needs_review | approved | failed`
  (schema migration `0013_report_extraction`)

Rules:

* Process every page of the text layer
* Do not invent facts, names, dates or outcomes
* Flag short / empty extracts for admin review (scanned PDFs need OCR offline)
* Never auto-publish from extraction

## Presentation

Shared report components (all future reports use the same system):

* `ReportHeader` / `ReportContent` / `ReportDownloadButton`
* Safe Markdown via `lib/content/safe-markdown.tsx` (headings, lists, tables, links)
* Online: `/reports` and `/reports/[slug]` with section TOC
* Downloadable PDF: `components/reports/download-branded-pdf.tsx` — navy /
  magenta / sky / cream cover + body, page numbers, selectable text
* Public CTA copy: **Download the Full Report** —
  “Download the complete report in GGI's official document format.”

## Limits

* Max source size ~25MB per pass
* OCR is not automatic on Cloudflare Workers Free — use Node admin/scripts
* Embedded photos/charts from the source PDF are not yet re-hosted into the
  branded layout; use the report card image
* Extraction should run in Node (admin route / scripts), not on the Edge runtime

## Validation fixture

Breast Cancer Awareness PDF:

`https://girlsglobalinitiative.org/reports/breast-cancer-awareness-2026.pdf`

Local copy: `public/reports/breast-cancer-awareness-2026.pdf`
