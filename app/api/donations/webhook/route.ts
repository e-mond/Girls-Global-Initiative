import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { sendAcknowledgementEmail } from "@/features/submissions/email";
import {
  findDonationByReference,
  markDonationSuccess,
  verifyPaystackSignature,
} from "@/features/donations/service";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json(
      { error: { message: "Invalid signature." } },
      { status: 401 },
    );
  }

  let event: {
    event?: string;
    data?: {
      id?: number | string;
      reference?: string;
      channel?: string;
      paid_at?: string;
      customer?: { email?: string };
    };
  };

  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid payload." } },
      { status: 400 },
    );
  }

  // Always acknowledge quickly; only process charge.success for records.
  if (event.event !== "charge.success" || !event.data?.reference) {
    return NextResponse.json({ received: true });
  }

  const reference = event.data.reference;
  const existing = await findDonationByReference(reference);
  if (!existing) {
    return NextResponse.json({ received: true });
  }

  if (existing.status === "success") {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const updated = await markDonationSuccess({
    reference,
    paystackEventId: event.data.id != null ? String(event.data.id) : null,
    channel: event.data.channel ?? null,
    paidAt: event.data.paid_at ? new Date(event.data.paid_at) : new Date(),
  });

  if (updated?.donorEmail) {
    await sendAcknowledgementEmail({
      to: updated.donorEmail,
      subject: "Thank you for your donation — Girls Global Initiative",
      text: `Hello${updated.donorName ? ` ${updated.donorName}` : ""},\n\nThank you for supporting Girls Global Initiative with GHS ${(updated.amountMinor / 100).toFixed(2)}. Your gift helps girls in rural and underserved communities.\n\nReference: ${updated.reference}\n\nWith gratitude,\nGirls Global Initiative`,
    });
  }

  await writeAuditLog({
    actorUserId: null,
    action: "donation.webhook_success",
    entityType: "donation",
    entityId: updated?.id ?? existing.id,
    summary: "Paystack charge.success applied",
    metadata: { reference, duplicate: false },
  });

  return NextResponse.json({ received: true });
}
