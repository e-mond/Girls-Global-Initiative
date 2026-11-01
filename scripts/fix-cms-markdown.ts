/**
 * Normalize escaped Markdown link syntax in CMS news/event bodies.
 * Run: npx tsx scripts/fix-cms-markdown.ts
 */
import { getDb } from "@/db/client";
import { events, newsPosts } from "@/db/schema";
import { normalizeCmsMarkdown } from "@/lib/content/safe-markdown";
import { eq } from "drizzle-orm";

async function fixTable(
  label: string,
  rows: Array<{ id: string; body: string; summary: string }>,
  update: (id: string, body: string, summary: string) => Promise<void>,
) {
  let changed = 0;
  for (const row of rows) {
    const nextBody = normalizeCmsMarkdown(row.body ?? "");
    const nextSummary = normalizeCmsMarkdown(row.summary ?? "");
    if (nextBody === (row.body ?? "").trim() && nextSummary === (row.summary ?? "").trim()) {
      continue;
    }
    await update(row.id, nextBody, nextSummary);
    changed += 1;
    console.log(`Updated ${label} ${row.id}`);
  }
  console.log(`${label}: ${changed} row(s) updated`);
}

async function main() {
  const db = getDb();
  if (!db) {
    throw new Error("DATABASE_URL is required.");
  }

  const news = await db
    .select({
      id: newsPosts.id,
      body: newsPosts.body,
      summary: newsPosts.summary,
    })
    .from(newsPosts);
  await fixTable("news_posts", news, async (id, body, summary) => {
    await db
      .update(newsPosts)
      .set({ body, summary, updatedAt: new Date() })
      .where(eq(newsPosts.id, id));
  });

  const eventRows = await db
    .select({
      id: events.id,
      body: events.body,
      summary: events.summary,
    })
    .from(events);
  await fixTable("events", eventRows, async (id, body, summary) => {
    await db
      .update(events)
      .set({ body, summary, updatedAt: new Date() })
      .where(eq(events.id, id));
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
