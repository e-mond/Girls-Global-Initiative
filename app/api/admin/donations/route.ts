import { NextResponse } from "next/server";
import { toCsv } from "@/features/exports/csv";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdminSession } from "@/features/governance/require-admin";
import {
  FREQUENCY_LABELS,
  STATUS_LABELS,
} from "@/features/donations/schemas";
import { listDonations } from "@/features/donations/service";

export async function GET(request: Request) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  const { searchParams } = new URL(request.url);
  const items = await listDonations();
  const q = searchParams.get("q")?.trim().toLowerCase();
  const status = searchParams.get("status");
  const filtered = items.filter((item) => {
    if (status && item.status !== status) return false;
    if (!q) return true;
    return (
      item.reference.toLowerCase().includes(q) ||
      (item.donorEmail ?? "").toLowerCase().includes(q) ||
      (item.donorName ?? "").toLowerCase().includes(q)
    );
  });

  if (searchParams.get("format") === "csv") {
    const limited = filtered.slice(0, 500);
    const csv = toCsv(
      [
        "id",
        "reference",
        "status",
        "frequency",
        "amountGhs",
        "currency",
        "donorName",
        "donorEmail",
        "isAnonymous",
        "paidAt",
        "createdAt",
      ],
      limited.map((item) => [
        item.id,
        item.reference,
        item.status,
        item.frequency,
        (item.amountMinor / 100).toFixed(2),
        item.currency,
        item.isAnonymous ? "" : item.donorName,
        item.isAnonymous ? "" : item.donorEmail,
        item.isAnonymous ? "yes" : "no",
        item.paidAt,
        item.createdAt,
      ]),
    );
    await writeAuditLog({
      actorUserId: access.user.id,
      action: "donation.export",
      entityType: "donation",
      summary: `Exported ${limited.length} donations`,
    });
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="donations.csv"',
      },
    });
  }

  return NextResponse.json({
    data: {
      items: filtered.map((item) => ({
        id: item.id,
        reference: item.reference,
        status: item.status,
        statusLabel: STATUS_LABELS[item.status],
        frequency: item.frequency,
        frequencyLabel: FREQUENCY_LABELS[item.frequency],
        amountMinor: item.amountMinor,
        currency: item.currency,
        donorName: item.isAnonymous ? null : item.donorName,
        donorEmail: item.isAnonymous ? null : item.donorEmail,
        isAnonymous: item.isAnonymous,
        channel: item.channel,
        paidAt: item.paidAt,
        createdAt: item.createdAt,
      })),
    },
  });
}
