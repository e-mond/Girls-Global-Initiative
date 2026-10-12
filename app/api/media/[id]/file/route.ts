import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getMedia } from "@/features/content/media-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Public image serve for locally stored media (dev / non-Cloudinary).
 * Prefer Cloudinary HTTPS URLs in production so Workers never stream binaries.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const media = await getMedia(id);
  if (!media) {
    return NextResponse.json(
      { error: { message: "Media not found." } },
      { status: 404 },
    );
  }

  if (media.url.startsWith("http")) {
    return NextResponse.redirect(media.url, 302);
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
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json(
      { error: { message: "Media file is unavailable." } },
      { status: 404 },
    );
  }
}
