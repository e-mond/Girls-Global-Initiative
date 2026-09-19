import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdministratorSession } from "@/features/governance/require-admin";
import { siteSettingsSchema } from "@/features/settings/schemas";
import {
  getSiteSettings,
  upsertSiteSettings,
} from "@/features/settings/service";

export async function GET() {
  const access = await requireAdministratorSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const settings = await getSiteSettings();
  return NextResponse.json({ data: { settings } });
}

export async function PUT(request: Request) {
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

  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Please check the settings and try again." } },
      { status: 400 },
    );
  }

  const settings = await upsertSiteSettings(parsed.data, access.user.id);
  await writeAuditLog({
    actorUserId: access.user.id,
    action: "settings.update",
    entityType: "site_settings",
    summary: "Updated global site settings",
  });

  return NextResponse.json({ data: { settings } });
}
