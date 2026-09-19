import { NextResponse } from "next/server";
import { toCsv } from "@/features/exports/csv";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdminSession } from "@/features/governance/require-admin";
import {
  submissionKindSchema,
  submissionStatusSchema,
} from "@/features/submissions/schemas";
import {
  listSubmissions,
  updateSubmissionStatus,
} from "@/features/submissions/service";

type RouteContext = { params: Promise<{ kind: string }> };

export async function GET(request: Request, context: RouteContext) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const { kind: raw } = await context.params;
  const kind = submissionKindSchema.safeParse(raw);
  if (!kind.success) {
    return NextResponse.json(
      { error: { message: "Unknown submission type." } },
      { status: 404 },
    );
  }

  const { searchParams } = new URL(request.url);
  const items = await listSubmissions(kind.data);
  const q = searchParams.get("q")?.trim().toLowerCase();
  const status = searchParams.get("status");
  const filtered = items.filter((item) => {
    if (status && item.status !== status) {
      return false;
    }
    if (!q) {
      return true;
    }
    return (
      item.summary.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q)
    );
  });

  if (searchParams.get("format") === "csv") {
    const limited = filtered.slice(0, 500);
    const csv = toCsv(
      ["id", "status", "email", "summary", "createdAt"],
      limited.map((item) => [
        item.id,
        item.status,
        item.email,
        item.summary,
        item.createdAt,
      ]),
    );
    await writeAuditLog({
      actorUserId: access.user.id,
      action: "submission.export",
      entityType: kind.data,
      summary: `Exported ${limited.length} ${kind.data} submissions`,
    });
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${kind.data}-submissions.csv"`,
      },
    });
  }

  return NextResponse.json({ data: { items: filtered } });
}

export async function PATCH(request: Request, context: RouteContext) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const { kind: raw } = await context.params;
  const kind = submissionKindSchema.safeParse(raw);
  if (!kind.success) {
    return NextResponse.json(
      { error: { message: "Unknown submission type." } },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid request." } },
      { status: 400 },
    );
  }

  const id = (body as { id?: string }).id;
  const status = submissionStatusSchema.safeParse(
    (body as { status?: string }).status,
  );
  if (!id || !status.success) {
    return NextResponse.json(
      { error: { message: "A valid id and status are required." } },
      { status: 400 },
    );
  }

  const updated = await updateSubmissionStatus(
    kind.data,
    id,
    status.data,
    access.user.id,
  );
  if (!updated) {
    return NextResponse.json(
      { error: { message: "Submission not found." } },
      { status: 404 },
    );
  }

  await writeAuditLog({
    actorUserId: access.user.id,
    action: "submission.status",
    entityType: kind.data,
    entityId: id,
    summary: `Set ${kind.data} status to ${status.data}`,
  });

  return NextResponse.json({ data: { item: updated } });
}
