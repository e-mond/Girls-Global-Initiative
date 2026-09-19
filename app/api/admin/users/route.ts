import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdministratorSession } from "@/features/governance/require-admin";
import {
  createStaffUserSchema,
  updateStaffUserSchema,
} from "@/features/settings/schemas";
import {
  createStaffUser,
  listStaffUsers,
  updateStaffUser,
} from "@/features/users/service";

export async function GET() {
  const access = await requireAdministratorSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const items = await listStaffUsers();
  return NextResponse.json({ data: { items } });
}

export async function POST(request: Request) {
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

  const parsed = createStaffUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message:
            "Provide name, email, role, and a password of at least 8 characters.",
        },
      },
      { status: 400 },
    );
  }

  const result = await createStaffUser(parsed.data);
  if ("error" in result) {
    return NextResponse.json(
      { error: { message: result.error } },
      { status: 400 },
    );
  }

  await writeAuditLog({
    actorUserId: access.user.id,
    action: "user.create",
    entityType: "user",
    entityId: result.id,
    summary: `Created staff user ${result.email} (${result.role})`,
  });

  return NextResponse.json({ data: { item: result } }, { status: 201 });
}

export async function PATCH(request: Request) {
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

  const parsed = updateStaffUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Invalid staff user update." } },
      { status: 400 },
    );
  }

  const result = await updateStaffUser(parsed.data);
  if ("error" in result) {
    return NextResponse.json(
      { error: { message: result.error } },
      { status: 400 },
    );
  }

  await writeAuditLog({
    actorUserId: access.user.id,
    action: "user.update",
    entityType: "user",
    entityId: result.id,
    summary: `Updated staff user ${result.email}`,
  });

  return NextResponse.json({ data: { item: result } });
}
