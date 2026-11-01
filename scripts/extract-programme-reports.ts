/**
 * Extract programme PDFs into reviewed report drafts, then approve & publish.
 * Usage: npx tsx --env-file=.env.local scripts/extract-programme-reports.ts
 */
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { writeFileSync } from "fs";
import path from "path";

config({ path: ".env.local" });
config();

import { getDb } from "../db/client";
import { newsPosts } from "../db/schema";
import { extractReportFromPdfSource } from "../features/reports/extract-pdf";

const REPORTS = [
  {
    source: "/reports/breast-cancer-awareness-2026.pdf",
    slug: "breast-cancer-awareness-enchi-october-2026",
    imageUrl: "/news/breast-cancer-card.jpg",
    sortOrder: 10,
  },
  {
    source: "/reports/pages-of-hope-2026.pdf",
    slug: "pages-of-hope-rural-girls-education-2026",
    imageUrl: "/news/pages-of-hope-card.jpg",
    sortOrder: 20,
  },
] as const;

async function upsert(report: (typeof REPORTS)[number]) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");

  const draft = await extractReportFromPdfSource(report.source);
  console.log(
    `\n${report.slug}: pages=${draft.pageCount} chars=${draft.extractedRaw.length} uncertain=${draft.uncertain}`,
  );
  if (draft.extractionNotes) {
    console.log(`  notes: ${draft.extractionNotes}`);
  }

  // Persist a local comparison snapshot for QA (not served publicly).
  const snapshotPath = path.join(
    process.cwd(),
    "tmp",
    `${report.slug}-extract.txt`,
  );
  try {
    writeFileSync(
      snapshotPath,
      [
        draft.title,
        draft.publishedOn,
        draft.summary,
        "",
        draft.extractionNotes,
        "",
        draft.body,
        "",
        "----- RAW -----",
        draft.extractedRaw,
      ].join("\n"),
      "utf8",
    );
    console.log(`  wrote ${snapshotPath}`);
  } catch {
    // tmp may be absent; ignore
  }

  const now = new Date();
  const [existing] = await db
    .select()
    .from(newsPosts)
    .where(eq(newsPosts.slug, report.slug))
    .limit(1);

  const values = {
    title: draft.title,
    summary: draft.summary,
    body: draft.body,
    publishedOn: draft.publishedOn || null,
    imageUrl: report.imageUrl,
    attachmentUrl: report.source,
    kind: "report" as const,
    extractionStatus: "approved" as const,
    extractionNotes: draft.extractionNotes || null,
    extractedRaw: draft.extractedRaw,
    status: "published" as const,
    sortOrder: report.sortOrder,
    updatedAt: now,
    publishedAt: now,
  };

  if (existing) {
    await db.update(newsPosts).set(values).where(eq(newsPosts.id, existing.id));
    console.log(`  updated & approved ${report.slug}`);
    return;
  }

  await db.insert(newsPosts).values({
    slug: report.slug,
    ...values,
  });
  console.log(`  created & approved ${report.slug}`);
}

async function main() {
  for (const report of REPORTS) {
    await upsert(report);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
