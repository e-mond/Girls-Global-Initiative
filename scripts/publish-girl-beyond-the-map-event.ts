/**
 * Publishes (or updates) The Girl Beyond the Map event (11 Oct 2026).
 * Usage: npx tsx --env-file=.env.local scripts/publish-girl-beyond-the-map-event.ts
 */
import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });
config();

import { getDb } from "../db/client";
import { events } from "../db/schema";

const SLUG = "the-girl-beyond-the-map";
const TITLE =
  "The Girl Beyond the Map: Amplifying Opportunities and Voices for Girls in Rural Communities";
const SUMMARY =
  "A virtual conversation exploring opportunities, challenges and voices of girls in rural and underserved communities — Sunday 11 October 2026, 3:00–4:30 PM GMT.";
const BODY = `Every girl deserves the opportunity to dream, grow and shape her future, regardless of where she comes from.

Join Girls Global Initiative (GGI) for The Girl Beyond the Map, an engaging virtual conversation exploring the opportunities, challenges and voices of girls in rural and underserved communities.

The conversation will bring together passionate speakers and advocates to highlight the barriers girls face, the importance of representation, and the need to create opportunities that allow every girl to realise her potential.

Our speakers:
- Miss Fonda – CEO, Fonda Impact Global
- Bernadette A. Shardow – Youth Leadership and Gender Advocate; Founder, Ed-Nate Foundation

Moderator: Miss Oparebea – Entrepreneur

Host: Philomena Larbi – Founder and Executive Director, Girls Global Initiative

Event details
- Date: Sunday, 11 October 2026
- Time: 3:00 PM – 4:30 PM GMT
- Format: Virtual

At GGI, we believe a girl's future should never be determined by her geographical location. Her voice matters, her potential matters, and her opportunities should extend beyond the map.

We Do It Because We Can.`;

const IMAGE_URL = "/events/girl-beyond-the-map.jpg?v=20261101";
const STARTS_ON = "11 October 2026";
const ENDS_ON = "3:00 PM – 4:30 PM GMT";
const LOCATION = "Virtual";
/** Backdated publishedAt to when the event happened. */
const PUBLISHED_AT = new Date("2026-10-11T15:00:00.000Z");

async function main() {
  const db = getDb();
  if (!db) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const now = new Date();
  const [existing] = await db
    .select()
    .from(events)
    .where(eq(events.slug, SLUG))
    .limit(1);

  if (existing) {
    await db
      .update(events)
      .set({
        title: TITLE,
        summary: SUMMARY,
        body: BODY,
        location: LOCATION,
        startsOn: STARTS_ON,
        endsOn: ENDS_ON,
        imageUrl: IMAGE_URL,
        sortOrder: 0,
        status: "published",
        publishedAt: PUBLISHED_AT,
        updatedAt: now,
      })
      .where(eq(events.id, existing.id));
    console.log(`Updated published event: ${SLUG}`);
    return;
  }

  await db.insert(events).values({
    title: TITLE,
    slug: SLUG,
    summary: SUMMARY,
    body: BODY,
    location: LOCATION,
    startsOn: STARTS_ON,
    endsOn: ENDS_ON,
    imageUrl: IMAGE_URL,
    sortOrder: 0,
    status: "published",
    publishedAt: PUBLISHED_AT,
  });

  console.log(`Created published event: ${SLUG} (publishedAt 2026-10-11)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
