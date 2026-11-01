/**
 * Upserts poster-backed events, newsletter notes and news posts.
 * Also sanitises legacy `**Label:**` markers in the breast-cancer report body.
 *
 * Usage: npx tsx --env-file=.env.local scripts/publish-poster-content.ts
 */
import { config } from "dotenv";
import { and, eq } from "drizzle-orm";

config({ path: ".env.local" });
config();

import { getDb } from "../db/client";
import { events, newsPosts } from "../db/schema";

const IMG = {
  girlBeyond: "/events/girl-beyond-the-map.jpg?v=20261101p",
  knowYourBody: "/events/know-your-body-enchi.jpg?v=20261101p",
  breastCampaign: "/news/breast-cancer-awareness-month.jpg?v=20261101p",
  happyNovember: "/news/happy-new-month-november.jpg?v=20261101p",
  nonViolence: "/news/international-day-of-non-violence.jpg?v=20261101p",
  teachers: "/news/world-teachers-day.jpg?v=20261101p",
  girlChild: "/news/international-day-of-the-girl-child.jpg?v=20261101p",
  ruralWomen: "/news/international-day-of-rural-women.jpg?v=20261101p",
} as const;

const REPORT_SLUG = "breast-cancer-awareness-enchi-october-2026";
const REPORT_PATH = `/reports/${REPORT_SLUG}`;
const EVENT_BREAST_SLUG = "breast-cancer-awareness-enchi-2026";
const EVENT_GIRL_SLUG = "the-girl-beyond-the-map";

function sanitizeReportMarkdown(body: string) {
  return body.replace(/\*\*([^*]+):\*\*/g, "**$1**:");
}

async function upsertEvent(values: {
  slug: string;
  title: string;
  summary: string;
  body: string;
  location: string;
  startsOn: string;
  endsOn: string;
  imageUrl: string;
  hostLabel: string;
  sortOrder: number;
  publishedAt: Date;
}) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");
  const now = new Date();
  const [existing] = await db
    .select()
    .from(events)
    .where(eq(events.slug, values.slug))
    .limit(1);

  const payload = {
    title: values.title,
    summary: values.summary,
    body: values.body,
    location: values.location,
    startsOn: values.startsOn,
    endsOn: values.endsOn,
    imageUrl: values.imageUrl,
    hostLabel: values.hostLabel,
    sortOrder: values.sortOrder,
    status: "published" as const,
    publishedAt: values.publishedAt,
    updatedAt: now,
  };

  if (existing) {
    await db.update(events).set(payload).where(eq(events.id, existing.id));
    console.log(`Updated event ${values.slug}`);
    return;
  }

  await db.insert(events).values({ slug: values.slug, ...payload });
  console.log(`Created event ${values.slug}`);
}

async function upsertNewsPost(values: {
  slug: string;
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  publishedOn: string;
  kind: "news" | "newsletter";
  sortOrder: number;
  publishedAt: Date;
}) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");
  const now = new Date();
  const [existing] = await db
    .select()
    .from(newsPosts)
    .where(eq(newsPosts.slug, values.slug))
    .limit(1);

  const payload = {
    title: values.title,
    summary: values.summary,
    body: values.body,
    imageUrl: values.imageUrl,
    publishedOn: values.publishedOn,
    kind: values.kind,
    sortOrder: values.sortOrder,
    status: "published" as const,
    publishedAt: values.publishedAt,
    updatedAt: now,
  };

  if (existing) {
    await db.update(newsPosts).set(payload).where(eq(newsPosts.id, existing.id));
    console.log(`Updated ${values.kind} ${values.slug}`);
    return;
  }

  await db.insert(newsPosts).values({ slug: values.slug, ...payload });
  console.log(`Created ${values.kind} ${values.slug}`);
}

async function sanitizeBreastCancerReport() {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");
  const [report] = await db
    .select()
    .from(newsPosts)
    .where(
      and(eq(newsPosts.slug, REPORT_SLUG), eq(newsPosts.kind, "report")),
    )
    .limit(1);
  if (!report) {
    console.log("Breast cancer report not found — skip body sanitize.");
    return;
  }
  const next = sanitizeReportMarkdown(report.body);
  if (next === report.body) {
    console.log("Breast cancer report body already clean.");
    return;
  }
  await db
    .update(newsPosts)
    .set({ body: next, updatedAt: new Date() })
    .where(eq(newsPosts.id, report.id));
  console.log("Sanitised breast cancer report markdown bold markers.");
}

async function main() {
  await upsertEvent({
    slug: EVENT_GIRL_SLUG,
    title: "The Girl Beyond the Map",
    summary:
      "Amplifying opportunities and voices for girls in rural communities — a virtual conversation on Sunday 11 October 2026, 3:00–4:30 p.m. on Google Meet.",
    body: `Every girl deserves the opportunity to dream, grow and shape her future, regardless of where she comes from.

Girls Global Initiative hosted The Girl Beyond the Map, a virtual conversation amplifying opportunities and voices for girls in rural communities.

Event details
- Date: Sunday, 11 October 2026
- Time: 3:00 p.m. – 4:30 p.m.
- Format: Virtual (Google Meet)
- Meet link used for the session: https://meet.google.com/roq-sqyc-ihe

Host
- Philomena Larbi — Founder & President, Girls Global Initiative | Gender & Girls' Rights Advocate

Speakers
- Miss Fonda — CEO, Fonda Impact Global
- Bernadette A. Shardow — Youth Leadership & Gender Advocate; Founder, 1st Readers Foundation

Moderators
- Miss Oparebea
- Miss Aminah Abisiba Annan

This gathering has concluded. The record remains available so partners and community members can revisit the theme and the people who shaped the conversation.

We Do It Because We Can.`,
    location: "Virtual · Google Meet",
    startsOn: "11 October 2026",
    endsOn: "3:00 p.m. – 4:30 p.m.",
    imageUrl: IMG.girlBeyond,
    hostLabel: "Girls Global Initiative",
    sortOrder: 0,
    publishedAt: new Date("2026-10-11T15:00:00.000Z"),
  });

  await upsertEvent({
    slug: EVENT_BREAST_SLUG,
    title: "Know Your Body, Protect Your Future — Breast Cancer Screening Outreach",
    summary:
      "Breast health education, awareness, early detection and screening at Enchi Presbyterian Church on Friday 23 October 2026.",
    body: `Girls Global Initiative presented Know Your Body, Protect Your Future — a breast health education, awareness, early detection and screening programme in Enchi.

Programme details
- Date: Friday, 23 October 2026
- Scheduled start: 10:00 a.m.
- Actual programme window: approximately 10:40 a.m. – 2:50 p.m.
- Venue: Enchi Presbyterian Church, Enchi, Western North Region, Ghana

The outreach brought students, teachers and nurses together for interactive learning on breast health. “Your health matters. Your life matters.”

Read the full programme report: [Breast Cancer Awareness and Screening Programme](${REPORT_PATH})

This event has concluded and remains in the event archive.`,
    location: "Enchi Presbyterian Church, Enchi, Western North Region, Ghana",
    startsOn: "23 October 2026",
    endsOn: "Scheduled 10:00 a.m. · Programme approx. 10:40 a.m. – 2:50 p.m.",
    imageUrl: IMG.knowYourBody,
    hostLabel: "Girls Global Initiative",
    sortOrder: 5,
    publishedAt: new Date("2026-10-23T10:00:00.000Z"),
  });

  await upsertNewsPost({
    slug: "international-day-of-non-violence-2026",
    kind: "newsletter",
    title: "International Day of Non-Violence",
    publishedOn: "2 October 2026",
    publishedAt: new Date("2026-10-02T08:00:00.000Z"),
    sortOrder: 40,
    imageUrl: IMG.nonViolence,
    summary:
      "Choose peace. Reject violence. A commemorative note for a world where every woman and girl can live free from violence, fear and abuse.",
    body: `Today we mark the International Day of Non-Violence.

Choose peace. Reject violence.

Girls Global Initiative stands for a world where every woman and girl can live free from violence, fear and abuse. Every voice deserves to be heard, every life deserves dignity, and every girl deserves the freedom to thrive.

This note is a commemorative message. It is not an announcement of a separate GGI-hosted event.

We Do It Because We Can.`,
  });

  await upsertNewsPost({
    slug: "world-teachers-day-2026",
    kind: "newsletter",
    title: "World Teachers' Day",
    publishedOn: "5 October 2026",
    publishedAt: new Date("2026-10-05T08:00:00.000Z"),
    sortOrder: 35,
    imageUrl: IMG.teachers,
    summary:
      "Thanking the teachers who inspire, guide and give hope through education — their impact reaches far beyond the classroom.",
    body: `On World Teachers' Day, Girls Global Initiative honours the educators who walk with girls every day.

To the teachers who inspire, guide and give hope through education, your impact reaches far beyond the classroom. Thank you for shaping futures.

GGI’s work with schools depends on teachers who open doors for learning, dignity and opportunity. This commemorative note celebrates that partnership — it is not a claim that GGI hosted a separate Teachers’ Day programme.

We Do It Because We Can.`,
  });

  await upsertNewsPost({
    slug: "international-day-of-the-girl-child-2026",
    kind: "newsletter",
    title: "International Day of the Girl Child",
    publishedOn: "11 October 2026",
    publishedAt: new Date("2026-10-11T08:00:00.000Z"),
    sortOrder: 30,
    imageUrl: IMG.girlChild,
    summary:
      "Celebrating every girl — and the future she will help shape — with a call to keep dreaming, believing and reaching for the best.",
    body: `As we celebrate every girl today, we are also celebrating the future she will help shape. The girls we nurture, educate and empower today will become the women who build our communities and shape tomorrow.

To every young girl out there, keep dreaming, keep believing, and keep reaching for the very best. Your future is worth pursuing.

On the same day, GGI hosted the virtual conversation [The Girl Beyond the Map](/events/${EVENT_GIRL_SLUG}). This newsletter note is the commemorative Day of the Girl Child message; the event page holds the programme details.

We Do It Because We Can.`,
  });

  await upsertNewsPost({
    slug: "international-day-of-rural-women-2026",
    kind: "newsletter",
    title: "International Day of Rural Women",
    publishedOn: "15 October 2026",
    publishedAt: new Date("2026-10-15T08:00:00.000Z"),
    sortOrder: 25,
    imageUrl: IMG.ruralWomen,
    summary:
      "Empowering rural women, strengthening communities, building a better future — honouring strength, resilience and contribution.",
    body: `Empowering rural women, strengthening communities, building a better future.

Today we celebrate the women who work quietly at the heart of our communities and economies. From agriculture to the management of natural resources, rural women contribute immensely to the livelihoods and development of our societies.

Though their work may often go unseen and uncelebrated, we see them, we value them, and we appreciate them.

Today, and every day, we honour their strength, resilience and contribution.

This is a commemorative observance message aligned with GGI’s commitment to girls and women in rural communities. It is not an announcement of a separate hosted event.

We Do It Because We Can.`,
  });

  await upsertNewsPost({
    slug: "breast-cancer-awareness-month-2026",
    kind: "newsletter",
    title: "Breast Cancer Awareness Month",
    publishedOn: "October 2026",
    publishedAt: new Date("2026-10-01T08:00:00.000Z"),
    sortOrder: 20,
    imageUrl: IMG.breastCampaign,
    summary:
      "Welcome to October — Breast Cancer Awareness Month. We stand for health, wellness and legacy. Here is your reminder to go for checkup.",
    body: `Welcome to October — Breast Cancer Awareness Month.

Girls Global Initiative stands for health, wellness and legacy. This campaign note is a reminder to go for checkup, and to keep conversations about breast health open for girls, families and communities.

The wider awareness campaign helped set the context for GGI’s Enchi outreach:

- Event: [Know Your Body, Protect Your Future — Breast Cancer Screening Outreach](/events/${EVENT_BREAST_SLUG})
- Report: [Breast Cancer Awareness and Screening Programme](${REPORT_PATH})

Campaign and outreach remain related but distinct: this newsletter marks the month-long awareness message; the event and report document the Enchi programme.

We Do It Because We Can.`,
  });

  await upsertNewsPost({
    slug: "breast-cancer-awareness-month-october-launch",
    kind: "news",
    title: "Breast Cancer Awareness Month — October launch",
    publishedOn: "October 2026",
    publishedAt: new Date("2026-10-01T09:00:00.000Z"),
    sortOrder: 15,
    imageUrl: IMG.breastCampaign,
    summary:
      "GGI opens October with a breast cancer awareness message for girls’ health and wellbeing — leading into the Enchi screening outreach.",
    body: `October is Breast Cancer Awareness Month. Girls Global Initiative opened the month with a clear message: we stand for health, wellness and legacy — and a practical reminder to go for checkup.

Breast health education matters for the girls and communities GGI walks with. Awareness creates room for questions, early detection and care, especially where access to reliable information can be limited.

Follow the full chain of this work:

- Campaign note: [Breast Cancer Awareness Month](/news/breast-cancer-awareness-month-2026)
- Outreach event: [Know Your Body, Protect Your Future](/events/${EVENT_BREAST_SLUG})
- Programme report: [Breast Cancer Awareness and Screening Programme](${REPORT_PATH})

This news update introduces the month’s awareness focus. It does not replace the newsletter campaign note, the event record, or the official report.

We Do It Because We Can.`,
  });

  await upsertNewsPost({
    slug: "happy-new-month-november-2026",
    kind: "news",
    title: "Happy New Month — November",
    publishedOn: "1 November 2026",
    publishedAt: new Date("2026-11-01T08:00:00.000Z"),
    sortOrder: 10,
    imageUrl: IMG.happyNovember,
    summary:
      "New month, new smiles, fresh hope and beautiful beginnings. Keep shining!",
    body: `Happy New Month — November.

New month, new smiles, fresh hope, and beautiful beginnings. Keep shining!

Girls Global Initiative greets November with warmth for every girl still learning, leading and hoping. This is a seasonal greeting — not an announcement of a new programme.

We Do It Because We Can.`,
  });

  await sanitizeBreastCancerReport();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
