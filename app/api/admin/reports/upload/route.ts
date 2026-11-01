import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdminSession } from "@/features/governance/require-admin";
import { saveReportPdfUpload } from "@/features/reports/save-pdf-upload";

export const runtime = "nodejs";

/** Upload a report source PDF from the staff device. */
export async function POST(request: Request) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid upload." } },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: { message: "Please choose a PDF file to upload." } },
      { status: 400 },
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const saved = await saveReportPdfUpload({
      filename: file.name,
      mimeType: file.type || "application/pdf",
      bytes,
    });

    await writeAuditLog({
      actorUserId: access.user.id,
      action: "reports.pdf_upload",
      entityType: "news_posts",
      entityId: null,
      summary: `Uploaded report source PDF ${saved.filename}`,
    });

    return NextResponse.json(
      { data: { url: saved.url, filename: saved.filename } },
      { status: 201 },
    );
  } catch (error) {
    console.error("[admin/reports/upload] failed", error);
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Could not upload the PDF. Check the file type and size, then try again.",
        },
      },
      { status: 400 },
    );
  }
}
