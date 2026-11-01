import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newsPosts } from "@/db/schema";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdminSession } from "@/features/governance/require-admin";

const bodySchema = z.object({
  id: z.string().uuid(),
  publish: z.boolean().optional(),
});

/** Mark a report extraction as approved; optionally publish. */
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
      { error: { message: "Report id is required." } },
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

  const [existing] = await db
    .select()
    .from(newsPosts)
    .where(
      and(eq(newsPosts.id, parsed.data.id), eq(newsPosts.kind, "report")),
    )
    .limit(1);

  if (!existing) {
    return NextResponse.json(
      { error: { message: "Report not found." } },
      { status: 404 },
    );
  }

  if (existing.extractionStatus === "failed") {
    return NextResponse.json(
      {
        error: {
          message:
            "This extraction failed. Fix the content or re-run extraction before approving.",
        },
      },
      { status: 400 },
    );
  }

  const now = new Date();
  const shouldPublish = Boolean(parsed.data.publish);
  const [updated] = await db
    .update(newsPosts)
    .set({
      extractionStatus: "approved",
      status: shouldPublish ? "published" : existing.status,
      publishedAt: shouldPublish
        ? (existing.publishedAt ?? now)
        : existing.publishedAt,
      updatedAt: now,
      updatedById: access.user.id,
    })
    .where(eq(newsPosts.id, existing.id))
    .returning();

  await writeAuditLog({
    actorUserId: access.user.id,
    action: shouldPublish ? "report.approve_publish" : "report.approve",
    entityType: "news_posts",
    entityId: existing.id,
    summary: shouldPublish
      ? "Approved and published programme report"
      : "Approved programme report extraction",
  });

  return NextResponse.json({ data: { item: updated } });
}
