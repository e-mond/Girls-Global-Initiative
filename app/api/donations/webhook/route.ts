import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import {
  findDonationByReference,
  markDonationOutcome,
  markDonationSuccess,
  sendDonationThankYou,
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

  const reference = event.data?.reference;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  const existing = await findDonationByReference(reference);
  if (!existing) {
    return NextResponse.json({ received: true });
  }

  if (event.event === "charge.success") {
    if (existing.status === "success") {
      if (existing.donorEmail && !existing.emailSentAt) {
        await sendDonationThankYou(existing);
      }
      return NextResponse.json({ received: true, duplicate: true });
    }

    const updated = await markDonationSuccess({
      reference,
      paystackEventId: event.data?.id != null ? String(event.data.id) : null,
      channel: event.data?.channel ?? null,
      paidAt: event.data?.paid_at ? new Date(event.data.paid_at) : new Date(),
    });

    if (updated) {
      await sendDonationThankYou(updated);
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

  if (event.event === "charge.failed") {
    if (existing.status === "success") {
      return NextResponse.json({ received: true, ignored: true });
    }

    const updated = await markDonationOutcome({
      reference,
      status: "failed",
      channel: event.data?.channel ?? null,
    });

    await writeAuditLog({
      actorUserId: null,
      action: "donation.webhook_failed",
      entityType: "donation",
      entityId: updated?.id ?? existing.id,
      summary: "Paystack charge.failed applied",
      metadata: { reference },
    });

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
