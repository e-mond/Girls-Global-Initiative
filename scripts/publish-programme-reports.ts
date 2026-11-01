/**
 * Publishes Pages of Hope + Breast Cancer Awareness reports as news posts,
 * seeds gallery items from public/gallery/programme, and upserts the
 * breast-cancer awareness event. Backdates publishedOn to report dates.
 *
 * Usage: npx tsx --env-file=.env.local scripts/publish-programme-reports.ts
 */
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { readdirSync } from "fs";
import path from "path";

config({ path: ".env.local" });
config();

import {
  BREAST_CANCER_BODY,
  PAGES_OF_HOPE_BODY,
} from "../content/programme-report-bodies";
import { getDb } from "../db/client";
import { events, galleryItems, newsPosts } from "../db/schema";

const PAGES_OF_HOPE = {
  slug: "pages-of-hope-rural-girls-education-2026",
  title: "Pages of Hope: Rural girls' education — March 2026 report",
  publishedOn: "March 2026",
  sortOrder: 20,
  imageUrl: "/news/pages-of-hope-card.jpg",
  kind: "report" as const,
  attachmentUrl: "/reports/pages-of-hope-2026.pdf",
  summary:
    "GGI visited 10 schools and engaged about 150 girls across Nyankamam, Tekyikrom, Tekyiman, Yaakasi and Enchi, plus a parent engagement in Tekyikrom.",
  body: PAGES_OF_HOPE_BODY,
};

const BREAST_CANCER = {
  slug: "breast-cancer-awareness-enchi-october-2026",
  title: "Know Your Body, Protect Your Future — Breast cancer awareness in Enchi",
  publishedOn: "23 October 2026",
  sortOrder: 10,
  imageUrl: "/news/breast-cancer-card.jpg",
  kind: "report" as const,
  attachmentUrl: "/reports/breast-cancer-awareness-2026.pdf",
  summary:
    "On 23 October 2026, GGI brought 100 students, nine teachers and three nurses together at Enchi Presbyterian Church for breast health education under the theme Know Your Body, Protect Your Future.",
  body: BREAST_CANCER_BODY,
};

const BREAST_CANCER_EVENT = {
  slug: "breast-cancer-awareness-enchi-2026",
  title: "Breast Cancer Awareness — Know Your Body, Protect Your Future",
  summary:
    "Breast health education with nurses for girls from Enchi and surrounding communities.",
  body: `GGI hosted a breast cancer awareness and health education programme at Enchi Presbyterian Church under the theme Know Your Body, Protect Your Future.

Students, teachers and nurses took part in interactive sessions on breast health and early detection. Read the full activity report under Reports.`,
  location: "Enchi Presbyterian Church, Enchi, Western North Region, Ghana",
  startsOn: "23 October 2026",
  endsOn: "10:40 a.m. – 2:50 p.m.",
  hostLabel: "Girls Global Initiative",
  imageUrl: "/news/breast-cancer-card.jpg",
  sortOrder: 5,
};

const GALLERY_META: Array<{
  file: string;
  title: string;
  caption: string;
  location: string | null;
  badge: string;
}> = [
  {
    file: "ggi-field-01.jpg",
    title: "Know Your Body team portrait",
    caption: "GGI and partners gather for Breast Cancer Awareness in Enchi.",
    location: "Enchi",
    badge: "Health",
  },
  {
    file: "ggi-field-02.jpg",
    title: "Awareness banner moment",
    caption: "Volunteers stand with the Know Your Body, Protect Your Future banner.",
    location: "Enchi",
    badge: "Health",
  },
  {
    file: "ggi-field-12.jpg",
    title: "Listening in the hall",
    caption: "Students gather for GGI health education and outreach.",
    location: "Enchi",
    badge: "Outreach",
  },
  {
    file: "ggi-field-15.jpg",
    title: "Session with nurses",
    caption: "Interactive breast health education with nurses and teachers.",
    location: "Enchi",
    badge: "Health",
  },
  {
    file: "ggi-field-20.jpg",
    title: "Girls in attendance",
    caption: "Students from Enchi and neighbouring schools join the programme.",
    location: "Enchi",
    badge: "Community",
  },
  {
    file: "ggi-field-21.jpg",
    title: "Pages of Hope engagement",
    caption: "School and community engagement supporting rural girls' education.",
    location: "Western North",
    badge: "Education",
  },
  {
    file: "ggi-field-22.jpg",
    title: "Learning together",
    caption: "Girls take part in GGI school and community programmes.",
    location: "Western North",
    badge: "Education",
  },
  {
    file: "ggi-field-23.jpg",
    title: "Community gathering",
    caption: "Moments from GGI outreach with girls and local partners.",
    location: "Western North",
    badge: "Community",
  },
  {
    file: "ggi-field-24.jpg",
    title: "Field engagement",
    caption: "GGI continues school visits and safe conversations with girls.",
    location: "Western North",
    badge: "Outreach",
  },
  {
    file: "ggi-field-25.jpg",
    title: "Shared space",
    caption: "Girls and organisers during a GGI community programme day.",
    location: "Western North",
    badge: "Community",
  },
];

async function upsertNews(
  post: typeof PAGES_OF_HOPE,
  publishedAtIso: string,
) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");
  const now = new Date();
  const publishedAt = new Date(publishedAtIso);

  const [existing] = await db
    .select()
    .from(newsPosts)
    .where(eq(newsPosts.slug, post.slug))
    .limit(1);

  if (existing) {
    await db
      .update(newsPosts)
      .set({
        title: post.title,
        summary: post.summary,
        body: post.body,
        imageUrl: post.imageUrl,
        publishedOn: post.publishedOn,
        kind: post.kind,
        attachmentUrl: post.attachmentUrl,
        status: "published",
        publishedAt: existing.publishedAt ?? publishedAt,
        updatedAt: now,
        sortOrder: post.sortOrder,
      })
      .where(eq(newsPosts.id, existing.id));
    console.log(`Updated report: ${post.slug}`);
    return;
  }

  await db.insert(newsPosts).values({
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    body: post.body,
    imageUrl: post.imageUrl,
    publishedOn: post.publishedOn,
    kind: post.kind,
    attachmentUrl: post.attachmentUrl,
    status: "published",
    publishedAt,
    sortOrder: post.sortOrder,
  });
  console.log(`Created report: ${post.slug}`);
}

async function upsertEvent() {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");
  const now = new Date();
  const publishedAt = new Date("2026-10-23T12:00:00.000Z");
  const e = BREAST_CANCER_EVENT;

  const [existing] = await db
    .select()
    .from(events)
    .where(eq(events.slug, e.slug))
    .limit(1);

  if (existing) {
    await db
      .update(events)
      .set({
        ...e,
        status: "published",
        publishedAt: existing.publishedAt ?? publishedAt,
        updatedAt: now,
      })
      .where(eq(events.id, existing.id));
    console.log(`Updated event: ${e.slug}`);
    return;
  }

  await db.insert(events).values({
    ...e,
    status: "published",
    publishedAt,
  });
  console.log(`Created event: ${e.slug}`);
}

async function upsertGallery() {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");
  const dir = path.join(process.cwd(), "public", "gallery", "programme");
  const available = new Set(readdirSync(dir));
  const now = new Date();
  let order = 10;

  for (const meta of GALLERY_META) {
    if (!available.has(meta.file)) {
      console.warn(`Skip missing gallery file: ${meta.file}`);
      continue;
    }
    const imageUrl = `/gallery/programme/${meta.file}`;
    const [existing] = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.imageUrl, imageUrl))
      .limit(1);

    const values = {
      title: meta.title,
      caption: meta.caption,
      location: meta.location,
      badge: meta.badge,
      imageUrl,
      sortOrder: order,
      status: "published" as const,
      publishedAt: now,
      updatedAt: now,
    };
    order += 1;

    if (existing) {
      await db
        .update(galleryItems)
        .set(values)
        .where(eq(galleryItems.id, existing.id));
      console.log(`Updated gallery: ${meta.file}`);
    } else {
      await db.insert(galleryItems).values(values);
      console.log(`Created gallery: ${meta.file}`);
    }
  }

  // Publish remaining programme images not listed in GALLERY_META.
  const named = new Set(GALLERY_META.map((item) => item.file));
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".jpg")).sort()) {
    if (named.has(file)) continue;
    const imageUrl = `/gallery/programme/${file}`;
    const [existing] = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.imageUrl, imageUrl))
      .limit(1);
    if (existing) continue;
    await db.insert(galleryItems).values({
      title: "GGI programme moment",
      caption: "From Girls Global Initiative school and community programmes.",
      location: "Western North",
      badge: "Field",
      imageUrl,
      sortOrder: order,
      status: "published",
      publishedAt: now,
    });
    order += 1;
    console.log(`Created gallery: ${file}`);
  }
}

async function main() {
  await upsertNews(PAGES_OF_HOPE, "2026-03-31T12:00:00.000Z");
  await upsertNews(BREAST_CANCER, "2026-10-23T12:00:00.000Z");
  await upsertEvent();
  await upsertGallery();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
