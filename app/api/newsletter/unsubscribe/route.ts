import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { checkRateLimit, clientIp } from "@/features/submissions/rate-limit";
import { unsubscribeByToken } from "@/features/newsletter/service";

export async function POST(request: Request) {
  const limited = checkRateLimit(`newsletter:unsubscribe:${clientIp(request)}`);
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
      { error: { message: "An unsubscribe token is required." } },
      { status: 400 },
    );
  }

  const record = await unsubscribeByToken(token);
  if (!record) {
    return NextResponse.json(
      { error: { message: "This unsubscribe link is invalid." } },
      { status: 404 },
    );
  }

  await writeAuditLog({
    actorUserId: null,
    action: "newsletter.unsubscribe",
    entityType: "newsletter_subscriber",
    entityId: record.id,
    summary: "Newsletter unsubscribe completed",
  });

  return NextResponse.json({
    data: { status: record.status },
  });
}
