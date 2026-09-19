import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
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
  const emailResult = await sendAcknowledgementEmail({
    to: record.email,
    subject: "Confirm your GGI newsletter subscription",
    text: `Hello,\n\nPlease confirm your subscription to Letters for her future by opening this link:\n\n${confirmUrl}\n\nIf you did not request this, you can ignore this email.\n\nTo unsubscribe later: ${unsubscribeUrl}\n\nGirls Global Initiative`,
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
