import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
import { submissionAckEmail } from "@/features/email/branded";
import { sendAcknowledgementEmail } from "@/features/submissions/email";
import { checkRateLimit, clientIp } from "@/features/submissions/rate-limit";
import {
  contactSchema,
  partnershipSchema,
  volunteerSchema,
  type SubmissionKind,
} from "@/features/submissions/schemas";
import {
  createContact,
  createPartnership,
  createVolunteer,
} from "@/features/submissions/service";

type RouteContext = { params: Promise<{ kind: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { kind: raw } = await context.params;
  if (raw !== "volunteer" && raw !== "partnership" && raw !== "contact") {
    return NextResponse.json(
      { error: { message: "Unknown form." } },
      { status: 404 },
    );
  }
  const kind = raw as SubmissionKind;

  const limited = checkRateLimit(`submit:${kind}:${clientIp(request)}`);
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: {
          message: "Too many submissions. Please try again shortly.",
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

  let created;
  let recipientName: string;

  if (kind === "volunteer") {
    const parsed = volunteerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: "Please check the form and try again." } },
        { status: 400 },
      );
    }
    created = await createVolunteer(parsed.data);
    recipientName = parsed.data.fullName;
  } else if (kind === "partnership") {
    const parsed = partnershipSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: "Please check the form and try again." } },
        { status: 400 },
      );
    }
    created = await createPartnership(parsed.data);
    recipientName = parsed.data.requesterName;
  } else {
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: "Please check the form and try again." } },
        { status: 400 },
      );
    }
    created = await createContact(parsed.data);
    recipientName = parsed.data.fullName;
  }

  const mail = submissionAckEmail({ kind, name: recipientName });
  const emailResult = await sendAcknowledgementEmail({
    to: created.email,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });

  await writeAuditLog({
    actorUserId: null,
    action: "submission.create",
    entityType: kind,
    entityId: created.id,
    summary: `Public ${kind} submission received`,
    metadata: { emailSent: emailResult.sent },
  });

  return NextResponse.json(
    {
      data: {
        id: created.id,
        emailSent: emailResult.sent,
      },
    },
    { status: 201 },
  );
}
