/**
 * Publishes (or updates) the "website is live" news post.
 * Usage: npm run db:publish-site-live-news
 *
 * Idempotent on slug `ggi-website-is-live`.
 */
import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });
config();

import { getDb } from "../db/client";
import { newsPosts } from "../db/schema";

const SLUG = "ggi-website-is-live";
const TITLE = "Girls Global Initiative's website is live";
const SUMMARY =
  "Our public website is now live at girlsglobalinitiative.org — explore our story, programmes, and ways to get involved.";
const BODY = `Girls Global Initiative's public website is now live at https://girlsglobalinitiative.org.

You can read about our work with girls in rural and underserved communities, explore our programmes, meet the team, and find ways to donate, volunteer, or partner with us.

Thank you for following along — we look forward to sharing more updates here.`;

async function main() {
  const db = getDb();
  if (!db) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const publishedOn = new Date().toISOString().slice(0, 10);
  const now = new Date();

  const [existing] = await db
    .select()
    .from(newsPosts)
    .where(eq(newsPosts.slug, SLUG))
    .limit(1);

  if (existing) {
    await db
      .update(newsPosts)
      .set({
        title: TITLE,
        summary: SUMMARY,
        body: BODY,
        publishedOn,
        status: "published",
        publishedAt: existing.publishedAt ?? now,
        updatedAt: now,
        sortOrder: 0,
      })
      .where(eq(newsPosts.id, existing.id));
    console.log(`Updated published news post: ${SLUG}`);
    return;
  }

  await db.insert(newsPosts).values({
    title: TITLE,
    slug: SLUG,
    summary: SUMMARY,
    body: BODY,
    publishedOn,
    status: "published",
    publishedAt: now,
    sortOrder: 0,
  });

  console.log(`Created published news post: ${SLUG}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
