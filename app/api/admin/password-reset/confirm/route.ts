import { NextResponse } from "next/server";
import { z } from "zod";
import {
  inspectStaffPasswordResetToken,
  resetStaffPasswordWithToken,
} from "@/features/governance/password-reset";
import { checkRateLimit, clientIp } from "@/features/submissions/rate-limit";

const bodySchema = z.object({
  token: z.string().min(20).max(200),
  password: z.string().min(8).max(200),
});

export async function GET(request: Request) {
  const limited = checkRateLimit(
    `password-reset-inspect:${clientIp(request)}`,
    20,
    60_000,
  );
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: {
          message: "Too many attempts. Please wait and try again.",
          retryAfterSec: limited.retryAfterSec,
        },
      },
      { status: 429 },
    );
  }

  const token = new URL(request.url).searchParams.get("token") ?? "";
  const result = await inspectStaffPasswordResetToken(token);
  if (!result.ok) {
    return NextResponse.json(
      {
        data: {
          valid: false,
          reason: result.reason,
          message: result.message,
        },
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    data: {
      valid: true,
      kind: result.kind,
      message:
        result.kind === "invite"
          ? "Invitation link is valid. Choose a password to activate your account."
          : "Reset link is valid. Choose a new password.",
    },
  });
}

export async function POST(request: Request) {
  const limited = checkRateLimit(`password-reset-confirm:${clientIp(request)}`, 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: {
          message: "Too many attempts. Please wait and try again.",
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
      {
        error: {
          message:
            "Enter a valid reset link and a password of at least 8 characters.",
        },
      },
      { status: 400 },
    );
  }

  const result = await resetStaffPasswordWithToken(parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { error: { message: result.message } },
      { status: 400 },
    );
  }

  return NextResponse.json({
    data: { message: "Password updated. You can sign in with your new password." },
  });
}
