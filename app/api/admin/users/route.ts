import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdministratorSession } from "@/features/governance/require-admin";
import {
  createStaffUserSchema,
  updateStaffUserSchema,
} from "@/features/settings/schemas";
import {
  inviteStaffUser,
  listStaffUsers,
  resendStaffInvite,
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
          message: "Provide name, email, and a staff role.",
        },
      },
      { status: 400 },
    );
  }

  const result = await inviteStaffUser(parsed.data);
  if ("error" in result) {
    return NextResponse.json(
      { error: { message: result.error } },
      { status: 400 },
    );
  }

  await writeAuditLog({
    actorUserId: access.user.id,
    action: "user.invited",
    entityType: "user",
    entityId: result.id,
    summary: `Invited staff user ${result.email} (${result.role})`,
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

  if (parsed.data.resendInvite) {
    const result = await resendStaffInvite(parsed.data.id);
    if ("error" in result) {
      return NextResponse.json(
        { error: { message: result.error } },
        { status: 400 },
      );
    }
    await writeAuditLog({
      actorUserId: access.user.id,
      action: "user.invite_resent",
      entityType: "user",
      entityId: result.id,
      summary: `Resent staff invitation to ${result.email}`,
    });
    return NextResponse.json({ data: { item: result } });
  }

  const { resendInvite: _resend, ...update } = parsed.data;
  void _resend;

  const previousStatus = (
    await listStaffUsers()
  ).find((item) => item.id === update.id)?.status;

  const result = await updateStaffUser({
    ...update,
    actorUserId: access.user.id,
  });
  if ("error" in result) {
    return NextResponse.json(
      { error: { message: result.error } },
      { status: 400 },
    );
  }

  let action = "user.update";
  let summary = `Updated staff user ${result.email}`;
  if (update.status === "disabled") {
    action = "user.disabled";
    summary = `Disabled staff user ${result.email}`;
  } else if (update.status === "active" && previousStatus === "disabled") {
    action = "user.reenabled";
    summary = `Re-enabled staff user ${result.email}`;
  }

  await writeAuditLog({
    actorUserId: access.user.id,
    action,
    entityType: "user",
    entityId: result.id,
    summary,
  });

  return NextResponse.json({ data: { item: result } });
}
