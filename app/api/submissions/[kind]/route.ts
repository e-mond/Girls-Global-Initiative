import { NextResponse } from "next/server";
import { writeAuditLog } from "@/features/audit/write-audit";
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

const ACK: Record<
  SubmissionKind,
  { subject: string; text: (name: string) => string }
> = {
  volunteer: {
    subject: "We received your volunteer application — Girls Global Initiative",
    text: (name) =>
      `Hello ${name},\n\nThank you for offering your time to Girls Global Initiative. Our team will review your application and follow up soon.\n\nWith appreciation,\nGirls Global Initiative`,
  },
  partnership: {
    subject: "We received your partnership request — Girls Global Initiative",
    text: (name) =>
      `Hello ${name},\n\nThank you for reaching out about partnering with Girls Global Initiative. We will review your request and respond shortly.\n\nWith appreciation,\nGirls Global Initiative`,
  },
  contact: {
    subject: "We received your message — Girls Global Initiative",
    text: (name) =>
      `Hello ${name},\n\nThank you for contacting Girls Global Initiative. We have received your message and will reply as soon as we can.\n\nWith appreciation,\nGirls Global Initiative`,
  },
};

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

  const emailResult = await sendAcknowledgementEmail({
    to: created.email,
    subject: ACK[kind].subject,
    text: ACK[kind].text(recipientName),
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
