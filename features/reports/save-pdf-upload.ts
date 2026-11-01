import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  cloudinaryConfigured,
  uploadRawToCloudinary,
} from "@/lib/cloudinary";

const MAX_PDF_BYTES = 25 * 1024 * 1024;

export function isAllowedReportPdf(
  mimeType: string,
  byteSize: number,
  filename: string,
): string | null {
  const lower = filename.toLowerCase();
  const okType =
    mimeType === "application/pdf" ||
    mimeType === "application/x-pdf" ||
    lower.endsWith(".pdf");
  if (!okType) {
    return "Only PDF files are allowed for report sources.";
  }
  if (byteSize > MAX_PDF_BYTES) {
    return "PDF files must be 25MB or smaller.";
  }
  return null;
}

/**
 * Persist a staff-uploaded report source PDF.
 * Prefers Cloudinary raw storage in production; falls back to public/reports/uploads locally.
 */
export async function saveReportPdfUpload(input: {
  filename: string;
  mimeType: string;
  bytes: Buffer;
}): Promise<{ url: string; filename: string }> {
  const validationError = isAllowedReportPdf(
    input.mimeType,
    input.bytes.byteLength,
    input.filename,
  );
  if (validationError) {
    throw new Error(validationError);
  }

  const safeBase =
    input.filename
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "report";
  const filename = safeBase.endsWith(".pdf") ? safeBase : `${safeBase}.pdf`;

  if (cloudinaryConfigured()) {
    const uploaded = await uploadRawToCloudinary({
      bytes: input.bytes,
      filename,
      mimeType: "application/pdf",
      folder: "ggi/reports",
    });
    return { url: uploaded.url, filename };
  }

  const id = randomUUID().slice(0, 8);
  const storedName = `${id}-${filename}`;
  const dir = path.join(process.cwd(), "public", "reports", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, storedName), input.bytes);
  return { url: `/reports/uploads/${storedName}`, filename: storedName };
}
