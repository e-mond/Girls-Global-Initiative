import { NextResponse } from "next/server";
import { z } from "zod";
import {
  contentEntitySchema,
  contentStatusSchema,
  programmeStatusSchema,
} from "@/features/governance/rbac";
import {
  createContent,
  deleteContent,
  getContent,
  listContent,
  updateContent,
} from "@/features/content/content-service";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdminSession } from "@/features/governance/require-admin";

const createSchema = z
  .object({
    status: contentStatusSchema.optional(),
    programmeStatus: programmeStatusSchema.optional(),
    publishedAt: z.union([z.string(), z.null()]).optional(),
    revisedStartsOn: z.union([z.string(), z.null()]).optional(),
    statusNote: z.union([z.string(), z.null()]).optional(),
    timezone: z.union([z.string(), z.null()]).optional(),
  })
  .passthrough();

type RouteContext = {
  params: Promise<{ entity: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const { entity: raw } = await context.params;
  const entity = contentEntitySchema.safeParse(raw);
  if (!entity.success) {
    return NextResponse.json(
      { error: { message: "Unknown content type." } },
      { status: 404 },
    );
  }

  const items = await listContent(entity.data);
  return NextResponse.json({ data: { items } });
}

export async function POST(request: Request, context: RouteContext) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const { entity: raw } = await context.params;
  const entity = contentEntitySchema.safeParse(raw);
  if (!entity.success) {
    return NextResponse.json(
      { error: { message: "Unknown content type." } },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body." } },
      { status: 400 },
    );
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Please check the form and try again." } },
      { status: 400 },
    );
  }

  const created = await createContent(
    entity.data,
    parsed.data,
    access.user.id,
  );

  await writeAuditLog({
    actorUserId: access.user.id,
    action: "content.create",
    entityType: entity.data,
    entityId: created.id,
    summary: `Created ${entity.data} item`,
  });

  return NextResponse.json({ data: { item: created } }, { status: 201 });
}

export async function PATCH(request: Request, context: RouteContext) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const { entity: raw } = await context.params;
  const entity = contentEntitySchema.safeParse(raw);
  if (!entity.success) {
    return NextResponse.json(
      { error: { message: "Unknown content type." } },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body." } },
      { status: 400 },
    );
  }

  const patchSchema = createSchema.extend({
    id: z.string().uuid(),
  });
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Please check the form and try again." } },
      { status: 400 },
    );
  }

  const { id, ...rest } = parsed.data;

  // Programme reports must be approved before publish (PDF extraction workflow).
  if (
    entity.data === "news_posts" &&
    rest.status === "published"
  ) {
    const existing = await getContent(entity.data, id);
    const kind = String(
      (rest.kind as string | undefined) ?? existing?.kind ?? "news",
    );
    if (kind === "report") {
      const extractionStatus = String(
        (rest.extractionStatus as string | undefined) ??
          existing?.extractionStatus ??
          "none",
      );
      if (extractionStatus !== "approved" && extractionStatus !== "none") {
        return NextResponse.json(
          {
            error: {
              message:
                "Approve this report extraction before publishing. Use Reports → Approve.",
            },
          },
          { status: 400 },
        );
      }
      // Manual reports with status none become approved on first intentional publish.
      if (extractionStatus === "none") {
        rest.extractionStatus = "approved";
      }
    }
  }

  const updated = await updateContent(entity.data, id, rest, access.user.id);
  if (!updated) {
    return NextResponse.json(
      { error: { message: "Item not found." } },
      { status: 404 },
    );
  }

  const auditAction =
    rest.status === "published"
      ? "content.publish"
      : rest.status === "archived"
        ? "content.archive"
        : rest.status === "scheduled"
          ? "content.schedule"
          : rest.programmeStatus === "cancelled"
            ? "content.event.cancel"
            : rest.programmeStatus === "postponed"
              ? "content.event.postpone"
              : "content.update";

  await writeAuditLog({
    actorUserId: access.user.id,
    action: auditAction,
    entityType: entity.data,
    entityId: id,
    summary: `Updated ${entity.data} item`,
    metadata: {
      status: rest.status ?? null,
      programmeStatus: rest.programmeStatus ?? null,
    },
  });

  return NextResponse.json({ data: { item: updated } });
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const { entity: raw } = await context.params;
  const entity = contentEntitySchema.safeParse(raw);
  if (!entity.success) {
    return NextResponse.json(
      { error: { message: "Unknown content type." } },
      { status: 404 },
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id || !z.string().uuid().safeParse(id).success) {
    return NextResponse.json(
      { error: { message: "A valid item id is required." } },
      { status: 400 },
    );
  }

  const existing = await getContent(entity.data, id);
  if (!existing) {
    return NextResponse.json(
      { error: { message: "Item not found." } },
      { status: 404 },
    );
  }

  await deleteContent(entity.data, id);
  await writeAuditLog({
    actorUserId: access.user.id,
    action: "content.delete",
    entityType: entity.data,
    entityId: id,
    summary: `Deleted ${entity.data} item`,
  });

  return NextResponse.json({ data: { ok: true } });
}
