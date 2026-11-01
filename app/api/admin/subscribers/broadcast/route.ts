import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdministratorSession } from "@/features/governance/require-admin";
import { sendNewsletterBroadcastBatch } from "@/features/newsletter/broadcast";

const bodySchema = z.object({
  subject: z.string().trim().min(3).max(180),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(10).max(8000),
  offset: z.number().int().min(0).optional(),
});

/**
 * Administrator-only batch send for Letters for her future.
 * Caps each request (Worker-safe). Repeat with nextOffset until remaining=0.
 * Prefer local `npm run announce:site-live` for very large lists.
 */
export async function POST(request: Request) {
  const access = await requireAdministratorSession();
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

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: "Enter a subject, title and message body (min 10 characters).",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await sendNewsletterBroadcastBatch({
      subject: parsed.data.subject,
      title: parsed.data.title,
      body: parsed.data.body,
      offset: parsed.data.offset ?? 0,
    });

    await writeAuditLog({
      actorUserId: access.user.id,
      action: "newsletter.broadcast_batch",
      entityType: "newsletter_subscriber",
      summary: `Broadcast batch sent=${result.sent} failed=${result.failed} remaining=${result.remaining}`,
      metadata: {
        attempted: result.attempted,
        nextOffset: result.nextOffset,
      },
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[admin/subscribers/broadcast] failed", error);
    return NextResponse.json(
      { error: { message: "Could not send this batch. Try again shortly." } },
      { status: 500 },
    );
  }
}
