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

import { getDb } from "../db/client";
import { events, galleryItems, newsPosts } from "../db/schema";

const PAGES_OF_HOPE = {
  slug: "pages-of-hope-rural-girls-education-2026",
  title: "Pages of Hope: Rural girls' education — March 2026 report",
  publishedOn: "2026-03-31",
  sortOrder: 20,
  imageUrl: "/news/pages-of-hope-card.jpg",
  summary:
    "GGI visited 10 schools and engaged about 150 girls across Nyankamam, Tekyikrom, Tekyiman, Yaakasi and Enchi, plus a parent engagement in Tekyikrom.",
  body: `Girls Global Initiative implemented its 2026 Pages of Hope: Rural Girls' Education project to improve educational opportunity, strengthen girls' wellbeing, and listen carefully to barriers faced by girls in rural and underserved communities.

## Reach
During the reporting period (March 2026), GGI visited **10 schools** and directly engaged approximately **150 girls** in the Western North Region of Ghana — in Nyankamam, Tekyikrom, Tekyiman, Yaakasi and Enchi. Alongside the school visits, GGI held a community engagement with parents in Tekyikrom.

## What we heard
Girls and school communities described interconnected challenges: lack of educational materials, household poverty, tattered school uniforms, inadequate parental care and support, inadequate toilet facilities, lack of potable water in schools, inadequate teachers, and feeding-related challenges.

These findings reinforce that improving girls' education requires more than encouraging attendance. Girls need learning resources, supportive families, safe school facilities, teaching support, food, water and sanitation.

## What comes next
GGI will use this community-level information to guide future programmes, advocacy, partnerships and fundraising focused on girls' education and wellbeing — staying in touch with participating schools, documenting needs, and developing partnerships that respond to what girls told us.

Every girl deserves not only a place in a classroom, but the support to remain there, learn, thrive and build the future she dreams of.

[Download the full programme report (PDF)](/reports/pages-of-hope-2026.pdf)`,
};

const BREAST_CANCER = {
  slug: "breast-cancer-awareness-enchi-october-2026",
  title: "Know Your Body, Protect Your Future — Breast cancer awareness in Enchi",
  publishedOn: "2026-10-23",
  sortOrder: 10,
  imageUrl: "/news/breast-cancer-card.jpg",
  summary:
    "On 23 October 2026, GGI brought 100 students, nine teachers and three nurses together at Enchi Presbyterian Church for breast health education under the theme Know Your Body, Protect Your Future.",
  body: `Girls Global Initiative organised a Breast Cancer Awareness and Screening Programme on **Friday, 23 October 2026** at the Enchi Presbyterian Church, Western North Region, Ghana.

The programme ran under the theme **“Know Your Body, Protect Your Future”** — educating young girls on breast health, promoting awareness of breast cancer, encouraging early detection, and empowering participants to take responsibility for their wellbeing.

## Participation
GGI planned for 80 students and welcomed **100 students**, plus **nine teachers** and **three nurses**. Transportation support helped girls from neighbouring Takyikrom take part.

Sessions opened with prayer and introductions from the GGI team, including an opening address by Founder and President Philomena Ofori Larbi. Nurses facilitated interactive health education on breast cancer, early detection and self-awareness, followed by questions, refreshments and closing.

## Outcomes
The day exceeded its attendance target, brought schools across Enchi and surrounding communities together, and created space for girls and teachers to learn from health professionals. A power outage and generator logistics delayed the start from 10:00 a.m. to about 10:40 a.m.; the team adapted and completed the programme successfully.

GGI remains committed to health education that helps girls in underserved communities protect their futures.

[Download the full activity report (PDF)](/reports/breast-cancer-awareness-2026.pdf)`,
};

const BREAST_CANCER_EVENT = {
  slug: "breast-cancer-awareness-enchi-2026",
  title: "Breast Cancer Awareness — Know Your Body, Protect Your Future",
  summary:
    "Breast health education with nurses for girls from Enchi and surrounding communities.",
  body: `GGI hosted a breast cancer awareness and health education programme at Enchi Presbyterian Church under the theme Know Your Body, Protect Your Future.

Students, teachers and nurses took part in interactive sessions on breast health and early detection. Read the full activity report on our news page.`,
  location: "Enchi Presbyterian Church, Enchi, Western North Region, Ghana",
  startsOn: "23 October 2026",
  endsOn: "10:40 a.m. – 2:50 p.m.",
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

async function upsertNews(post: typeof PAGES_OF_HOPE) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");
  const now = new Date();
  const publishedAt = new Date(`${post.publishedOn}T12:00:00.000Z`);

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
        status: "published",
        publishedAt: existing.publishedAt ?? publishedAt,
        updatedAt: now,
        sortOrder: post.sortOrder,
      })
      .where(eq(newsPosts.id, existing.id));
    console.log(`Updated news: ${post.slug}`);
    return;
  }

  await db.insert(newsPosts).values({
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    body: post.body,
    imageUrl: post.imageUrl,
    publishedOn: post.publishedOn,
    status: "published",
    publishedAt,
    sortOrder: post.sortOrder,
  });
  console.log(`Created news: ${post.slug}`);
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
  await upsertNews(PAGES_OF_HOPE);
  await upsertNews(BREAST_CANCER);
  await upsertEvent();
  await upsertGallery();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
