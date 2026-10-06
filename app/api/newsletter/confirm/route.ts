import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { newsletterWelcomeEmail } from "@/features/email/branded";
import { emailSiteOrigin } from "@/features/email/site-origin";
import { sendAcknowledgementEmail } from "@/features/submissions/email";
import { checkRateLimit, clientIp } from "@/features/submissions/rate-limit";
import { confirmSubscribe } from "@/features/newsletter/service";

export async function POST(request: Request) {
  const limited = checkRateLimit(`newsletter:confirm:${clientIp(request)}`);
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

  const token =
    typeof body === "object" && body && "token" in body
      ? String((body as { token?: string }).token ?? "")
      : "";
  if (!token) {
    return NextResponse.json(
      { error: { message: "A confirmation token is required." } },
      { status: 400 },
    );
  }

  const record = await confirmSubscribe(token);
  if (!record) {
    return NextResponse.json(
      { error: { message: "This confirmation link is invalid or expired." } },
      { status: 404 },
    );
  }

  const unsubscribeUrl = `${emailSiteOrigin()}/newsletter/unsubscribe?token=${record.unsubscribeToken}`;
  const mail = newsletterWelcomeEmail({ unsubscribeUrl });
  await sendAcknowledgementEmail({
    to: record.email,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    listUnsubscribeUrl: unsubscribeUrl,
  });

  await writeAuditLog({
    actorUserId: null,
    action: "newsletter.confirm",
    entityType: "newsletter_subscriber",
    entityId: record.id,
    summary: "Newsletter subscription confirmed",
  });

  return NextResponse.json({
    data: { status: record.status },
  });
}
