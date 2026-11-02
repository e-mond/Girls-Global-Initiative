import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdministratorSession } from "@/features/governance/require-admin";
import { STAFF_ROLE_GUIDE } from "@/features/governance/rbac";
import {
  createStaffUserSchema,
  updateStaffUserSchema,
} from "@/features/settings/schemas";
import { notifyStaffAccountChange } from "@/features/users/notify-account-change";
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
    const issue = parsed.error.issues[0];
    const field = issue?.path[0];
    const message =
      field === "email"
        ? "Enter a valid email address."
        : field === "name"
          ? "Enter a full name (at least 2 characters)."
          : field === "role"
            ? "Choose a staff role (Editor or Administrator)."
            : "Provide name, email, and a staff role.";
    return NextResponse.json({ error: { message } }, { status: 400 });
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

  const previous = (await listStaffUsers()).find(
    (item) => item.id === update.id,
  );

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
  let notifyKind: "role_changed" | "disabled" | "reenabled" | null = null;
  let actorNotice = `Updated ${result.name}.`;

  if (update.role && previous && update.role !== previous.role) {
    action = "user.role_changed";
    summary = `Changed ${result.email} role from ${previous.role} to ${update.role}`;
    notifyKind = "role_changed";
    actorNotice = `You changed ${result.name}'s role to ${STAFF_ROLE_GUIDE[update.role].label}. They were emailed about the change.`;
  } else if (update.status === "disabled") {
    action = "user.disabled";
    summary = `Disabled staff user ${result.email}`;
    notifyKind = "disabled";
    actorNotice = `You disabled ${result.name}'s staff access. They were emailed about the change.`;
  } else if (update.status === "active" && previous?.status === "disabled") {
    action = "user.reenabled";
    summary = `Re-enabled staff user ${result.email}`;
    notifyKind = "reenabled";
    actorNotice = `You re-enabled ${result.name}'s staff access. They were emailed about the change.`;
  }

  await writeAuditLog({
    actorUserId: access.user.id,
    action,
    entityType: "user",
    entityId: result.id,
    summary,
    metadata: {
      previousRole: previous?.role ?? null,
      nextRole: result.role,
      previousStatus: previous?.status ?? null,
      nextStatus: result.status,
    },
  });

  let emailSent = false;
  let emailWarning: string | null = null;
  if (notifyKind) {
    const mail = await notifyStaffAccountChange({
      toEmail: result.email,
      toName: result.name,
      actorName: access.user.name || access.user.email,
      kind: notifyKind,
      role: notifyKind === "role_changed" ? result.role : undefined,
    });
    emailSent = mail.sent;
    if (!mail.sent) {
      emailWarning =
        mail.reason ??
        "The account was updated, but the notification email could not be sent.";
      actorNotice = `${actorNotice.replace(
        " They were emailed about the change.",
        "",
      )} The notification email could not be sent.`;
    }
  }

  return NextResponse.json({
    data: {
      item: result,
      notice: {
        forActor: actorNotice,
        emailSent,
        emailWarning,
      },
    },
  });
}
