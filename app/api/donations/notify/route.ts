import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { manualDonationNotifyEmail } from "@/features/email/branded";
import { sendAcknowledgementEmail } from "@/features/submissions/email";
import { checkRateLimit, clientIp } from "@/features/submissions/rate-limit";
import { manualDonationNotifySchema } from "@/features/donations/schemas";
import {
  createDonation,
  createReference,
  markDonationEmailResult,
  organisationTransferDetails,
} from "@/features/donations/service";

/** Optional donor notification after a direct bank / MoMo transfer. */
export async function POST(request: Request) {
  const limited = checkRateLimit(`donation:notify:${clientIp(request)}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: { message: "Too many requests. Please try again shortly." } },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  if (!organisationTransferDetails().configured) {
    return NextResponse.json(
      {
        error: {
          message:
            "Direct payment details are not published yet. Contact GGI if you have already transferred.",
        },
      },
      { status: 503 },
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

  const parsed = manualDonationNotifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: "Enter a valid amount. Email must be a real address if provided.",
        },
      },
      { status: 400 },
    );
  }

  const amountMinor = Math.round(parsed.data.amountGhs * 100);
  const reference = createReference("ggi_direct");
  const noteParts = [
    parsed.data.transferredOn
      ? `Transferred on: ${parsed.data.transferredOn}`
      : null,
    parsed.data.donorNote || null,
  ].filter(Boolean);

  const record = await createDonation({
    reference,
    amountMinor,
    frequency: "one_time",
    donorName: parsed.data.donorName || null,
    donorEmail: parsed.data.donorEmail || null,
    isAnonymous: !parsed.data.donorName && !parsed.data.donorEmail,
    status: "pending_verification",
    method: "direct",
    channel: "direct_transfer",
    transferReference: parsed.data.transferReference || null,
    donorNote: noteParts.length ? noteParts.join("\n") : null,
  });

  if (parsed.data.donorEmail) {
    const amountLabel = `GHS ${(amountMinor / 100).toFixed(2)}`;
    const mail = manualDonationNotifyEmail({
      donorName: parsed.data.donorName || null,
      amountLabel,
      reference: record.reference,
    });
    const sent = await sendAcknowledgementEmail({
      to: parsed.data.donorEmail,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    await markDonationEmailResult({
      id: record.id,
      sent: sent.sent,
      error: sent.reason,
    });
  }

  await writeAuditLog({
    actorUserId: null,
    action: "donation.manual_notify",
    entityType: "donation",
    entityId: record.id,
    summary: "Direct transfer notification submitted (pending verification)",
  });

  return NextResponse.json(
    {
      data: {
        reference: record.reference,
        status: record.status,
        message:
          "Thank you. Your notification is pending verification by the GGI team. This does not confirm payment by itself.",
      },
    },
    { status: 201 },
  );
}
