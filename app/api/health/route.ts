import { NextResponse } from "next/server";

/**
 * Liveness probe for local Docker and future uptime monitoring.
 * Does not expose infrastructure details.
 */
export async function GET() {
  return NextResponse.json({
    data: {
      status: "ok",
    },
  });
}
