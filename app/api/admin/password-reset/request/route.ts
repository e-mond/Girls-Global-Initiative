import { NextResponse } from "next/server";
import { z } from "zod";
import { requestStaffPasswordReset } from "@/features/governance/password-reset";
import { checkRateLimit, clientIp } from "@/features/submissions/rate-limit";

const bodySchema = z.object({
  email: z.string().email().max(320),
});

export async function POST(request: Request) {
  const limited = checkRateLimit(`password-reset:${clientIp(request)}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: {
          message: "Too many reset requests. Please wait and try again.",
          retryAfterSec: limited.retryAfterSec,
        },
      },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid request body." } },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Enter a valid staff email address." } },
      { status: 400 },
    );
  }

  await requestStaffPasswordReset(parsed.data.email);
  return NextResponse.json({
    data: {
      message:
        "If that email matches a staff account, we sent a new link. Check inbox and spam/junk — invitation links last 72 hours; password resets last 1 hour. If nothing arrives in a few minutes, ask an administrator to resend from Users.",
    },
  });
}
