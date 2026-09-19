import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";

export type MediaRecord = {
  id: string;
  filename: string;
  storageKey: string;
  mimeType: string;
  byteSize: number;
  altText: string;
  url: string;
  uploadedById: string | null;
  createdAt: string;
};

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 5 * 1024 * 1024;

const globalMedia = globalThis as typeof globalThis & {
  __ggiMediaStore?: MediaRecord[];
};

function memoryMedia(): MediaRecord[] {
  if (!globalMedia.__ggiMediaStore) {
    globalMedia.__ggiMediaStore = [];
  }
  return globalMedia.__ggiMediaStore;
}

function localStorageRoot() {
  return path.join(process.cwd(), "storage", "media");
}

export function isAllowedImage(mimeType: string, byteSize: number): string | null {
  if (!ALLOWED_MIME.has(mimeType)) {
    return "Only JPEG, PNG, WebP or GIF images are allowed.";
  }
  if (byteSize > MAX_BYTES) {
    return "Images must be 5MB or smaller.";
  }
  return null;
}

export async function listMedia(): Promise<MediaRecord[]> {
  const db = getDb();
  if (!db) {
    return [...memoryMedia()];
  }

  const rows = await db.select().from(mediaAssets);
  return rows.map((row) => ({
    id: row.id,
    filename: row.filename,
    storageKey: row.storageKey,
    mimeType: row.mimeType,
    byteSize: row.byteSize,
    altText: row.altText,
    url: row.url,
    uploadedById: row.uploadedById,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function saveMediaUpload(input: {
  filename: string;
  mimeType: string;
  bytes: Buffer;
  altText: string;
  uploadedById: string | null;
}): Promise<MediaRecord> {
  const validationError = isAllowedImage(input.mimeType, input.bytes.byteLength);
  if (validationError) {
    throw new Error(validationError);
  }

  const id = randomUUID();
  const ext = extensionFor(input.mimeType);
  const storageKey = `${id}.${ext}`;
  const root = localStorageRoot();
  await mkdir(root, { recursive: true });
  await writeFile(path.join(root, storageKey), input.bytes);

  const url = `/api/admin/media/${id}/file`;
  const now = new Date();
  const record: MediaRecord = {
    id,
    filename: input.filename,
    storageKey,
    mimeType: input.mimeType,
    byteSize: input.bytes.byteLength,
    altText: input.altText.trim(),
    url,
    uploadedById: input.uploadedById,
    createdAt: now.toISOString(),
  };

  const db = getDb();
  if (!db) {
    memoryMedia().unshift(record);
    return record;
  }

  await db.insert(mediaAssets).values({
    id,
    filename: record.filename,
    storageKey: record.storageKey,
    mimeType: record.mimeType,
    byteSize: record.byteSize,
    altText: record.altText,
    url: record.url,
    uploadedById: input.uploadedById,
  });

  return record;
}

export async function getMedia(id: string): Promise<MediaRecord | null> {
  const db = getDb();
  if (!db) {
    return memoryMedia().find((item) => item.id === id) ?? null;
  }

  const [row] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    filename: row.filename,
    storageKey: row.storageKey,
    mimeType: row.mimeType,
    byteSize: row.byteSize,
    altText: row.altText,
    url: row.url,
    uploadedById: row.uploadedById,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function deleteMedia(id: string): Promise<boolean> {
  const existing = await getMedia(id);
  if (!existing) {
    return false;
  }

  try {
    await unlink(path.join(localStorageRoot(), existing.storageKey));
  } catch {
    // File may already be missing in offline resets.
  }

  const db = getDb();
  if (!db) {
    globalMedia.__ggiMediaStore = memoryMedia().filter((item) => item.id !== id);
    return true;
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  return true;
}

function extensionFor(mimeType: string): string {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}
