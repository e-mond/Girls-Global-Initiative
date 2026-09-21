import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { newsletterConfirmEmail } from "@/features/email/branded";
import { sendAcknowledgementEmail } from "@/features/submissions/email";
import { checkRateLimit, clientIp } from "@/features/submissions/rate-limit";
import { subscribeSchema } from "@/features/newsletter/schemas";
import {
  requestSubscribe,
  siteOrigin,
} from "@/features/newsletter/service";

export async function POST(request: Request) {
  const limited = checkRateLimit(`newsletter:subscribe:${clientIp(request)}`);
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: {
          message: "Too many requests. Please try again shortly.",
        },
      },
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

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Enter a valid email address." } },
      { status: 400 },
    );
  }

  const { record, confirmToken } = await requestSubscribe(parsed.data.email);

  // Already subscribed — do not reveal status beyond a generic success message.
  if (record.status === "subscribed") {
    return NextResponse.json({
      data: {
        message:
          "If this address can receive mail, you’ll get a confirmation shortly.",
      },
    });
  }

  const confirmUrl = `${siteOrigin()}/newsletter/confirm?token=${confirmToken}`;
  const unsubscribeUrl = `${siteOrigin()}/newsletter/unsubscribe?token=${record.unsubscribeToken}`;
  const mail = newsletterConfirmEmail({ confirmUrl, unsubscribeUrl });
  const emailResult = await sendAcknowledgementEmail({
    to: record.email,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });

  await writeAuditLog({
    actorUserId: null,
    action: "newsletter.subscribe_request",
    entityType: "newsletter_subscriber",
    entityId: record.id,
    summary: "Newsletter signup requested",
    metadata: { emailSent: emailResult.sent },
  });

  return NextResponse.json({
    data: {
      message:
        "Check your inbox for a confirmation link to finish subscribing.",
      emailSent: emailResult.sent,
    },
  });
}
