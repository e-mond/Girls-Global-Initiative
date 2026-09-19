import { NextResponse } from "next/server";
import { z } from "zod";
import {
  contentEntitySchema,
  contentStatusSchema,
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
  const updated = await updateContent(entity.data, id, rest, access.user.id);
  if (!updated) {
    return NextResponse.json(
      { error: { message: "Item not found." } },
      { status: 404 },
    );
  }

  await writeAuditLog({
    actorUserId: access.user.id,
    action: rest.status === "published" ? "content.publish" : "content.update",
    entityType: entity.data,
    entityId: id,
    summary: `Updated ${entity.data} item`,
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
