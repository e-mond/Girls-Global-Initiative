import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/auth";

/**
 * Auth.js handlers with a JSON safety net.
 * Cloudflare Worker overloads can still return HTML 503 before this runs;
 * when our code throws, return JSON so next-auth/react does not parse HTML.
 */
async function withJsonFallback(
  handler: (req: NextRequest) => Promise<Response>,
  request: NextRequest,
): Promise<Response> {
  try {
    return await handler(request);
  } catch (error) {
    console.error("[auth] handler failed", error);
    return NextResponse.json(
      {
        error:
          "Staff sign-in is temporarily unavailable. Please try again in a moment.",
      },
      { status: 503 },
    );
  }
}

export async function GET(request: NextRequest) {
  return withJsonFallback(handlers.GET, request);
}

export async function POST(request: NextRequest) {
  return withJsonFallback(handlers.POST, request);
}
