import { NextResponse } from "next/server";
import { toCsv } from "@/features/exports/csv";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdminSession } from "@/features/governance/require-admin";
import {
  FREQUENCY_LABELS,
  METHOD_LABELS,
  STATUS_LABELS,
  adminDonationActionSchema,
} from "@/features/donations/schemas";
import {
  findDonationById,
  listDonations,
  sendDonationThankYou,
  setDonationVerification,
} from "@/features/donations/service";

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
        "method",
        "status",
        "frequency",
        "amountGhs",
        "currency",
        "donorName",
        "donorEmail",
        "isAnonymous",
        "emailSentAt",
        "paidAt",
        "createdAt",
      ],
      limited.map((item) => [
        item.id,
        item.reference,
        item.method,
        item.status,
        item.frequency,
        (item.amountMinor / 100).toFixed(2),
        item.currency,
        item.isAnonymous ? "" : item.donorName,
        item.isAnonymous ? "" : item.donorEmail,
        item.isAnonymous ? "yes" : "no",
        item.emailSentAt,
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
        method: item.method,
        methodLabel: METHOD_LABELS[item.method],
        frequency: item.frequency,
        frequencyLabel: FREQUENCY_LABELS[item.frequency],
        amountMinor: item.amountMinor,
        currency: item.currency,
        donorName: item.isAnonymous ? null : item.donorName,
        donorEmail: item.isAnonymous ? null : item.donorEmail,
        isAnonymous: item.isAnonymous,
        channel: item.channel,
        transferReference: item.transferReference,
        donorNote: item.donorNote,
        emailSentAt: item.emailSentAt,
        emailLastError: item.emailLastError,
        paidAt: item.paidAt,
        createdAt: item.createdAt,
      })),
    },
  });
}

export async function PATCH(request: Request) {
  const access = await requireAdminSession();
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

  const parsed = adminDonationActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Invalid donation action." } },
      { status: 400 },
    );
  }

  if (parsed.data.action === "resend_email") {
    const record = await findDonationById(parsed.data.id);
    if (!record) {
      return NextResponse.json(
        { error: { message: "Donation not found." } },
        { status: 404 },
      );
    }
    if (record.status !== "success") {
      return NextResponse.json(
        {
          error: {
            message: "Confirmation can only be resent for successful donations.",
          },
        },
        { status: 400 },
      );
    }
    if (!record.donorEmail) {
      return NextResponse.json(
        { error: { message: "This donation has no email address." } },
        { status: 400 },
      );
    }

    const result = await sendDonationThankYou(record, { force: true });
    await writeAuditLog({
      actorUserId: access.user.id,
      action: "donation.resend_email",
      entityType: "donation",
      entityId: record.id,
      summary: `Resend confirmation ${result.sent ? "sent" : "failed"}`,
    });
    if (!result.sent) {
      return NextResponse.json(
        {
          error: {
            message: result.reason ?? "Could not send confirmation email.",
          },
        },
        { status: 502 },
      );
    }
    const fresh = await findDonationById(record.id);
    return NextResponse.json({ data: { item: fresh } });
  }

  const nextStatus =
    parsed.data.action === "verify" ? ("success" as const) : ("rejected" as const);
  const result = await setDonationVerification({
    id: parsed.data.id,
    status: nextStatus,
  });
  if ("error" in result) {
    return NextResponse.json(
      { error: { message: result.error } },
      { status: 400 },
    );
  }

  if (parsed.data.action === "verify" && result.donorEmail) {
    await sendDonationThankYou(result, { force: true });
  }

  await writeAuditLog({
    actorUserId: access.user.id,
    action:
      parsed.data.action === "verify"
        ? "donation.verified"
        : "donation.rejected",
    entityType: "donation",
    entityId: result.id,
    summary: `${parsed.data.action === "verify" ? "Verified" : "Rejected"} direct transfer ${result.reference}`,
  });

  return NextResponse.json({ data: { item: result } });
}
