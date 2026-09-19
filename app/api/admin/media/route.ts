import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/features/audit/write-audit";
import {
  deleteMedia,
  getMedia,
  listMedia,
  saveMediaUpload,
} from "@/features/content/media-service";
import { requireAdminSession } from "@/features/governance/require-admin";

export async function GET() {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const items = await listMedia();
  return NextResponse.json({ data: { items } });
}

export async function POST(request: Request) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  const altText = String(form.get("altText") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: { message: "Please choose an image to upload." } },
      { status: 400 },
    );
  }

  if (!altText) {
    return NextResponse.json(
      { error: { message: "Alt text is required for accessibility." } },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    const item = await saveMediaUpload({
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      bytes,
      altText,
      uploadedById: access.user.id,
    });

    await writeAuditLog({
      actorUserId: access.user.id,
      action: "media.upload",
      entityType: "media_assets",
      entityId: item.id,
      summary: `Uploaded media ${item.filename}`,
    });

    return NextResponse.json({ data: { item } }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Upload failed. Please try again.";
    return NextResponse.json({ error: { message } }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !z.string().uuid().safeParse(id).success) {
    return NextResponse.json(
      { error: { message: "A valid media id is required." } },
      { status: 400 },
    );
  }

  const existing = await getMedia(id);
  if (!existing) {
    return NextResponse.json(
      { error: { message: "Media not found." } },
      { status: 404 },
    );
  }

  await deleteMedia(id);
  await writeAuditLog({
    actorUserId: access.user.id,
    action: "media.delete",
    entityType: "media_assets",
    entityId: id,
    summary: `Deleted media ${existing.filename}`,
  });

  return NextResponse.json({ data: { ok: true } });
}
