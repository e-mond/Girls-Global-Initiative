import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newsPosts } from "@/db/schema";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdminSession } from "@/features/governance/require-admin";
import { extractReportFromPdfSource } from "@/features/reports/extract-pdf";

export const runtime = "nodejs";

const bodySchema = z.object({
  sourceUrl: z.string().min(1),
  /** Optional existing report id to update in place (stays draft). */
  id: z.string().uuid().optional(),
  slug: z.string().min(1).optional(),
});

/**
 * Extract text from a source PDF into a draft report.
 * Never publishes — sets extractionStatus to needs_review / failed.
 */
export async function POST(request: Request) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid request." } },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Provide a PDF source URL or path." } },
      { status: 400 },
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: { message: "Database is unavailable." } },
      { status: 503 },
    );
  }

  try {
    const draft = await extractReportFromPdfSource(parsed.data.sourceUrl);
    const now = new Date();
    const extractionStatus = draft.uncertain ? "needs_review" : "extracted";
    const finalStatus =
      draft.extractionNotes.includes("FAILED_TEXT_LAYER") || !draft.extractedRaw
        ? "failed"
        : extractionStatus === "extracted" && draft.uncertain
          ? "needs_review"
          : extractionStatus === "extracted"
            ? "needs_review"
            : extractionStatus;

    // Always require human review before publish.
    const statusForSave =
      finalStatus === "failed" ? "failed" : "needs_review";

    const slug =
      parsed.data.slug?.trim() ||
      draft.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 72) ||
      `report-${Date.now()}`;

    if (parsed.data.id) {
      const [updated] = await db
        .update(newsPosts)
        .set({
          title: draft.title,
          summary: draft.summary,
          body: draft.body,
          publishedOn: draft.publishedOn || null,
          attachmentUrl: parsed.data.sourceUrl,
          kind: "report",
          extractionStatus: statusForSave,
          extractionNotes: draft.extractionNotes || null,
          extractedRaw: draft.extractedRaw || null,
          status: "draft",
          updatedAt: now,
          updatedById: access.user.id,
        })
        .where(eq(newsPosts.id, parsed.data.id))
        .returning();

      await writeAuditLog({
        actorUserId: access.user.id,
        action: "report.extract",
        entityType: "news_posts",
        entityId: parsed.data.id,
        summary: "Extracted report draft from PDF (pending review)",
        metadata: {
          pageCount: draft.pageCount,
          extractionStatus: statusForSave,
        },
      });

      return NextResponse.json({
        data: {
          item: updated,
          pageCount: draft.pageCount,
          uncertain: draft.uncertain,
        },
      });
    }

    const [created] = await db
      .insert(newsPosts)
      .values({
        title: draft.title,
        slug,
        summary: draft.summary,
        body: draft.body,
        publishedOn: draft.publishedOn || null,
        attachmentUrl: parsed.data.sourceUrl,
        kind: "report",
        extractionStatus: statusForSave,
        extractionNotes: draft.extractionNotes || null,
        extractedRaw: draft.extractedRaw || null,
        status: "draft",
        sortOrder: 0,
        createdById: access.user.id,
        updatedById: access.user.id,
      })
      .returning();

    await writeAuditLog({
      actorUserId: access.user.id,
      action: "report.extract",
      entityType: "news_posts",
      entityId: created.id,
      summary: "Created report draft from PDF extraction (pending review)",
      metadata: {
        pageCount: draft.pageCount,
        extractionStatus: statusForSave,
      },
    });

    return NextResponse.json(
      {
        data: {
          item: created,
          pageCount: draft.pageCount,
          uncertain: draft.uncertain,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[reports.extract]", error);
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error
              ? error.message
              : "PDF extraction failed. Try again or enter content manually.",
        },
      },
      { status: 500 },
    );
  }
}
