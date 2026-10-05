/**
 * One-shot branded email blast to confirmed newsletter subscribers
 * announcing that the GGI website is live.
 *
 * Usage: npm run announce:site-live
 *
 * Requires DATABASE_URL + SMTP_* in .env.local (or environment).
 * Prefer running this as an operator script — do not fan out from the Worker.
 *
 * Set ANNOUNCE_DRY_RUN=1 to list recipients without sending.
 * Set ANNOUNCE_LIMIT=N to cap sends (useful for smoke tests).
 */
import { config } from "dotenv";
import { and, eq, isNull } from "drizzle-orm";

config({ path: ".env.local" });
config();

import { getDb } from "../db/client";
import { newsletterSubscribers } from "../db/schema";
import { siteLiveAnnouncementEmail } from "../features/email/branded";
import { emailSiteOrigin } from "../features/email/site-origin";
import { sendAcknowledgementEmail } from "../features/submissions/email";

const CONCURRENCY = 3;
const DELAY_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const db = getDb();
  if (!db) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const dryRun =
    process.env.ANNOUNCE_DRY_RUN === "1" ||
    process.env.ANNOUNCE_DRY_RUN === "true";
  const limitRaw = process.env.ANNOUNCE_LIMIT;
  const limit = limitRaw ? Number(limitRaw) : undefined;

  const rows = await db
    .select({
      email: newsletterSubscribers.email,
      unsubscribeToken: newsletterSubscribers.unsubscribeToken,
    })
    .from(newsletterSubscribers)
    .where(
      and(
        eq(newsletterSubscribers.status, "subscribed"),
        isNull(newsletterSubscribers.unsubscribedAt),
      ),
    );

  const recipients =
    typeof limit === "number" && Number.isFinite(limit) && limit > 0
      ? rows.slice(0, limit)
      : rows;

  console.log(
    `Confirmed subscribers to notify: ${recipients.length}` +
      (dryRun ? " (dry run)" : ""),
  );

  if (recipients.length === 0) {
    return;
  }

  const origin = emailSiteOrigin();
  const newsUrl = `${origin}/news#ggi-website-is-live`;

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += CONCURRENCY) {
    const batch = recipients.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (row) => {
        const unsubscribeUrl = `${origin}/newsletter/unsubscribe?token=${row.unsubscribeToken}`;
        const mail = siteLiveAnnouncementEmail({ newsUrl, unsubscribeUrl });

        if (dryRun) {
          console.log(`[dry-run] would send to ${row.email}`);
          return;
        }

        const result = await sendAcknowledgementEmail({
          to: row.email,
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
        });

        if (result.sent) {
          sent += 1;
          console.log(`Sent: ${row.email}`);
        } else {
          failed += 1;
          console.error(
            `Failed: ${row.email} — ${result.reason ?? "unknown"}`,
          );
        }
      }),
    );

    if (i + CONCURRENCY < recipients.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(
    dryRun
      ? `Dry run complete for ${recipients.length} recipient(s).`
      : `Done. Sent=${sent} Failed=${failed}`,
  );

  if (!dryRun && failed > 0 && sent === 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
