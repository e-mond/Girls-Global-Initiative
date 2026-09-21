import { NextResponse } from "next/server";
import { listAttentionItems } from "@/features/admin/attention";
import { requireAdminSession } from "@/features/governance/require-admin";

/** Staff attention feed for the admin notification panel. */
export async function GET() {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  try {
    const items = await listAttentionItems();
    return NextResponse.json({ data: { items } });
  } catch {
    return NextResponse.json(
      { error: { message: "Could not load notifications." } },
      { status: 500 },
    );
  }
}
