import { NextResponse } from "next/server";
import { listAuditLogs } from "@/features/audit/write-audit";
import { requireAdministratorSession } from "@/features/governance/require-admin";

export async function GET(request: Request) {
  const access = await requireAdministratorSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase();
  const items = await listAuditLogs(200);
  const filtered = q
    ? items.filter(
        (item) =>
          item.summary.toLowerCase().includes(q) ||
          item.action.toLowerCase().includes(q) ||
          item.entityType.toLowerCase().includes(q),
      )
    : items;

  return NextResponse.json({ data: { items: filtered } });
}
