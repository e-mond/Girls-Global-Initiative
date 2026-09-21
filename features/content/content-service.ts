import { randomUUID } from "crypto";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  advocacyContent,
  challengeTags,
  events,
  galleryItems,
  newsPosts,
  pillars,
  teamMembers,
  testimonials,
} from "@/db/schema";
import type { ContentEntity, ContentStatus } from "@/features/governance/rbac";

export type ContentRecord = {
  id: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  [key: string]: unknown;
};

type MemoryStore = Record<ContentEntity, ContentRecord[]>;

const globalStore = globalThis as typeof globalThis & {
  __ggiContentStore?: MemoryStore;
};

function store(): MemoryStore {
  if (!globalStore.__ggiContentStore) {
    globalStore.__ggiContentStore = {
      pillars: seedPillars(),
      team_members: [],
      challenge_tags: seedTags(),
      gallery_items: [],
      testimonials: [],
      advocacy_content: [],
      news_posts: [],
      events: [],
    };
  }
  return globalStore.__ggiContentStore;
}

function seedPillars(): ContentRecord[] {
  const now = new Date().toISOString();
  return [
    {
      id: randomUUID(),
      slug: "rights-dignity",
      title: "Rights & dignity",
      description:
        "Helping girls understand their rights and speak up for dignity in their homes, schools and communities.",
      detail: "",
      icon: "sparkles",
      colour: "navy",
      sortOrder: 1,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    },
    {
      id: randomUUID(),
      slug: "health-wellbeing",
      title: "Health & wellbeing",
      description:
        "Opening space for menstrual health, reproductive knowledge and emotional wellbeing without shame.",
      detail: "",
      icon: "heart",
      colour: "magenta",
      sortOrder: 2,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    },
    {
      id: randomUUID(),
      slug: "confidence-growth",
      title: "Confidence & growth",
      description:
        "Building confidence through learning, leadership practice and safe spaces to grow.",
      detail: "",
      icon: "target",
      colour: "sky",
      sortOrder: 3,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    },
    {
      id: randomUUID(),
      slug: "mentorship-opportunity",
      title: "Mentorship & opportunity",
      description:
        "Connecting girls with mentors and pathways toward education and opportunity.",
      detail: "",
      icon: "users",
      colour: "cream",
      sortOrder: 4,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    },
  ];
}

function seedTags(): ContentRecord[] {
  const now = new Date().toISOString();
  const labels = [
    ["Poverty", "calendar"],
    ["Early pregnancy", "globe"],
    ["School dropout", "book"],
    ["Menstrual health", "droplet"],
    ["Lack of guidance", "check"],
    ["Limited opportunities", "briefcase"],
  ] as const;
  return labels.map(([label, icon], index) => ({
    id: randomUUID(),
    label,
    icon,
    sortOrder: index + 1,
    status: "draft" as const,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  }));
}

function tableFor(entity: ContentEntity) {
  switch (entity) {
    case "pillars":
      return pillars;
    case "team_members":
      return teamMembers;
    case "challenge_tags":
      return challengeTags;
    case "gallery_items":
      return galleryItems;
    case "testimonials":
      return testimonials;
    case "advocacy_content":
      return advocacyContent;
    case "news_posts":
      return newsPosts;
    case "events":
      return events;
  }
}

function serializeRow(row: Record<string, unknown>): ContentRecord {
  return {
    ...row,
    id: String(row.id),
    status: row.status as ContentStatus,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
    updatedAt:
      row.updatedAt instanceof Date
        ? row.updatedAt.toISOString()
        : String(row.updatedAt),
    publishedAt:
      row.publishedAt instanceof Date
        ? row.publishedAt.toISOString()
        : row.publishedAt
          ? String(row.publishedAt)
          : null,
  };
}

export async function listContent(
  entity: ContentEntity,
): Promise<ContentRecord[]> {
  const db = getDb();
  if (!db) {
    return [...store()[entity]].sort(
      (a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0),
    );
  }

  const table = tableFor(entity);
  const rows = await db.select().from(table).orderBy(asc(table.sortOrder));
  return rows.map((row) => serializeRow(row as Record<string, unknown>));
}

export async function getContent(
  entity: ContentEntity,
  id: string,
): Promise<ContentRecord | null> {
  const db = getDb();
  if (!db) {
    return store()[entity].find((item) => item.id === id) ?? null;
  }

  const table = tableFor(entity);
  const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
  return row ? serializeRow(row as Record<string, unknown>) : null;
}

export async function createContent(
  entity: ContentEntity,
  input: Record<string, unknown>,
  actorId: string | null,
): Promise<ContentRecord> {
  const now = new Date();
  const payload = {
    ...input,
    status: (input.status as ContentStatus) ?? "draft",
    createdById: actorId,
    updatedById: actorId,
    publishedAt: input.status === "published" ? now : null,
    createdAt: now,
    updatedAt: now,
  };

  const db = getDb();
  if (!db) {
    const record: ContentRecord = {
      id: randomUUID(),
      ...payload,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      publishedAt: payload.publishedAt
        ? (payload.publishedAt as Date).toISOString()
        : null,
      status: payload.status as ContentStatus,
    };
    store()[entity].push(record);
    return record;
  }

  const table = tableFor(entity);
  const [row] = await db.insert(table).values(payload as never).returning();
  return serializeRow(row as Record<string, unknown>);
}

export async function updateContent(
  entity: ContentEntity,
  id: string,
  input: Record<string, unknown>,
  actorId: string | null,
): Promise<ContentRecord | null> {
  const existing = await getContent(entity, id);
  if (!existing) {
    return null;
  }

  const nextStatus = (input.status as ContentStatus | undefined) ?? existing.status;
  const now = new Date();
  const publishedAt =
    nextStatus === "published"
      ? existing.publishedAt
        ? new Date(existing.publishedAt)
        : now
      : null;

  const db = getDb();
  if (!db) {
    const updated: ContentRecord = {
      ...existing,
      ...input,
      status: nextStatus,
      updatedAt: now.toISOString(),
      publishedAt: publishedAt ? publishedAt.toISOString() : null,
    };
    store()[entity] = store()[entity].map((item) =>
      item.id === id ? updated : item,
    );
    return updated;
  }

  const table = tableFor(entity);
  const [row] = await db
    .update(table)
    .set({
      ...input,
      status: nextStatus,
      updatedById: actorId,
      publishedAt,
      updatedAt: now,
    } as never)
    .where(eq(table.id, id))
    .returning();

  return row ? serializeRow(row as Record<string, unknown>) : null;
}

export async function deleteContent(
  entity: ContentEntity,
  id: string,
): Promise<boolean> {
  const db = getDb();
  if (!db) {
    const before = store()[entity].length;
    store()[entity] = store()[entity].filter((item) => item.id !== id);
    return store()[entity].length < before;
  }

  const table = tableFor(entity);
  const deleted = await db.delete(table).where(eq(table.id, id)).returning();
  return deleted.length > 0;
}

/** Published rows only, for public surfaces. Soft-fails offline/unreachable DB. */
export async function listPublishedContent(
  entity: ContentEntity,
): Promise<ContentRecord[]> {
  try {
    const items = await listContent(entity);
    return items.filter((item) => item.status === "published");
  } catch {
    return [];
  }
}
