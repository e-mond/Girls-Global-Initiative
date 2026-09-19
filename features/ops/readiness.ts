import { getDb } from "@/db/client";
import { sql } from "drizzle-orm";

export type CheckStatus = "ok" | "missing" | "error" | "skipped";

export type ReadinessReport = {
  status: "ready" | "not_ready";
  checks: {
    database: CheckStatus;
    authSecret: CheckStatus;
    paystack: CheckStatus;
    smtp: CheckStatus;
  };
};

function present(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

/**
 * Production readiness checks — never includes secret values.
 * Critical for ready: AUTH_SECRET + DATABASE_URL connectivity in production.
 * Paystack/SMTP are reported but do not block readiness (transfer/email degrade).
 */
export async function evaluateReadiness(): Promise<ReadinessReport> {
  const isProduction = process.env.NODE_ENV === "production";

  const authSecret: CheckStatus = present(process.env.AUTH_SECRET)
    ? "ok"
    : "missing";

  const paystack: CheckStatus = present(process.env.PAYSTACK_SECRET_KEY)
    ? "ok"
    : "missing";

  const smtp: CheckStatus =
    present(process.env.SMTP_HOST) && present(process.env.SMTP_FROM)
      ? "ok"
      : "missing";

  let database: CheckStatus = "missing";
  if (!present(process.env.DATABASE_URL)) {
    database = isProduction ? "missing" : "skipped";
  } else {
    try {
      const db = getDb();
      if (!db) {
        database = "missing";
      } else {
        await db.execute(sql`select 1`);
        database = "ok";
      }
    } catch {
      database = "error";
    }
  }

  const criticalOk =
    authSecret === "ok" &&
    (database === "ok" || (!isProduction && database === "skipped"));

  return {
    status: criticalOk ? "ready" : "not_ready",
    checks: {
      database,
      authSecret,
      paystack,
      smtp,
    },
  };
}
