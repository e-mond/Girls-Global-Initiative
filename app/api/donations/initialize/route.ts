import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { monthlyIntentEmail } from "@/features/email/branded";
import { sendAcknowledgementEmail } from "@/features/submissions/email";
import { checkRateLimit, clientIp } from "@/features/submissions/rate-limit";
import { initializeDonationSchema } from "@/features/donations/schemas";
import {
  createDonation,
  createReference,
  initializePaystackTransaction,
  organisationTransferDetails,
  paystackConfigured,
  siteOrigin,
} from "@/features/donations/service";

export async function GET() {
  return NextResponse.json({
    data: {
      paystackConfigured: paystackConfigured(),
      publicKey: process.env.PAYSTACK_PUBLIC_KEY?.trim() || null,
      transfer: organisationTransferDetails(),
    },
  });
}

export async function POST(request: Request) {
  const limited = checkRateLimit(`donation:init:${clientIp(request)}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: { message: "Too many requests. Please try again shortly." } },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
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

  const parsed = initializeDonationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: "Please check the donation details and try again.",
        },
      },
      { status: 400 },
    );
  }

  const amountMinor = Math.round(parsed.data.amountGhs * 100);
  const reference = createReference();
  const donorEmail = parsed.data.isAnonymous
    ? parsed.data.donorEmail || "anonymous@ggi.local"
    : (parsed.data.donorEmail as string);
  const donorName = parsed.data.isAnonymous
    ? null
    : parsed.data.donorName || null;

  if (parsed.data.frequency === "monthly_intent") {
    const record = await createDonation({
      reference,
      amountMinor,
      frequency: "monthly_intent",
      donorName,
      donorEmail: parsed.data.isAnonymous ? null : donorEmail,
      isAnonymous: Boolean(parsed.data.isAnonymous),
      status: "success",
    });

    if (parsed.data.donorEmail) {
      const amountLabel = `GHS ${(amountMinor / 100).toFixed(2)}`;
      const mail = monthlyIntentEmail({
        donorName,
        amountLabel,
      });
      await sendAcknowledgementEmail({
        to: parsed.data.donorEmail,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });
    }

    await writeAuditLog({
      actorUserId: null,
      action: "donation.monthly_intent",
      entityType: "donation",
      entityId: record.id,
      summary: "Monthly donation intent captured",
    });

    return NextResponse.json({
      data: {
        mode: "monthly_intent",
        reference: record.reference,
        redirectUrl: `${siteOrigin()}/get-involved/donate/thanks?reference=${record.reference}&mode=monthly`,
      },
    });
  }

  if (!paystackConfigured()) {
    return NextResponse.json(
      {
        error: {
          message:
            "Card/mobile-money checkout is not available yet. Please use the organisation transfer details on this page.",
        },
      },
      { status: 503 },
    );
  }

  const record = await createDonation({
    reference,
    amountMinor,
    frequency: "one_time",
    donorName,
    donorEmail: parsed.data.isAnonymous ? null : donorEmail,
    isAnonymous: Boolean(parsed.data.isAnonymous),
  });

  const paystack = await initializePaystackTransaction({
    email: donorEmail,
    amountMinor,
    reference,
    callbackUrl: `${siteOrigin()}/get-involved/donate/thanks?reference=${reference}`,
    metadata: {
      donationId: record.id,
      frequency: "one_time",
      isAnonymous: record.isAnonymous,
    },
  });

  if ("error" in paystack) {
    return NextResponse.json(
      { error: { message: paystack.error } },
      { status: 502 },
    );
  }

  await writeAuditLog({
    actorUserId: null,
    action: "donation.initialize",
    entityType: "donation",
    entityId: record.id,
    summary: "Paystack checkout initialized",
  });

  return NextResponse.json({
    data: {
      mode: "paystack",
      reference,
      authorizationUrl: paystack.authorizationUrl,
    },
  });
}
