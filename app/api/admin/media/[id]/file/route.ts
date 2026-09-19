import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getMedia } from "@/features/content/media-service";
import { requireAdminSession } from "@/features/governance/require-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** Serves locally stored media binaries to authenticated staff only. */
export async function GET(_request: Request, context: RouteContext) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const { id } = await context.params;
  const media = await getMedia(id);
  if (!media) {
    return NextResponse.json(
      { error: { message: "Media not found." } },
      { status: 404 },
    );
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "storage",
      "media",
      media.storageKey,
    );
    const bytes = await readFile(filePath);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": media.mimeType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: { message: "Media file is unavailable." } },
      { status: 404 },
    );
  }
}
