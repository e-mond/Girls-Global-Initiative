import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdministratorSession } from "@/features/governance/require-admin";
import {
  eraseDataSubject,
  findDataSubject,
} from "@/features/privacy/data-subject";

const emailSchema = z.string().trim().email().max(200);

export async function GET(request: Request) {
  const access = await requireAdministratorSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const email = new URL(request.url).searchParams.get("email") ?? "";
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Enter a valid email address." } },
      { status: 400 },
    );
  }

  try {
    const record = await findDataSubject(parsed.data);
    await writeAuditLog({
      actorUserId: access.user.id,
      action: "privacy.data_subject_export",
      entityType: "privacy",
      summary: `Exported data-subject package for ${parsed.data}`,
    });
    return NextResponse.json({ data: { record } });
  } catch (error) {
    console.error("[admin/privacy/data-subject] GET failed", error);
    return NextResponse.json(
      { error: { message: "Could not look up this email." } },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const access = await requireAdministratorSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
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

  const parsed = z
    .object({
      email: emailSchema,
      confirm: z.literal(true),
    })
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message:
            "Confirm erase with a valid email and confirm: true. This cannot be undone.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await eraseDataSubject(parsed.data.email);
    await writeAuditLog({
      actorUserId: access.user.id,
      action: "privacy.data_subject_erase",
      entityType: "privacy",
      summary: `Erased/anonymised data for ${parsed.data.email}`,
      metadata: result,
    });
    return NextResponse.json({ data: { result } });
  } catch (error) {
    console.error("[admin/privacy/data-subject] DELETE failed", error);
    return NextResponse.json(
      { error: { message: "Could not erase this record set." } },
      { status: 500 },
    );
  }
}
