import { NextResponse } from "next/server";
import { evaluateReadiness } from "@/features/ops/readiness";

/**
 * Readiness probe — fail-closed for critical auth/database config.
 * Does not expose secret values or infrastructure internals.
 */
export async function GET() {
  const report = await evaluateReadiness();
  return NextResponse.json(
    { data: report },
    { status: report.status === "ready" ? 200 : 503 },
  );
}
