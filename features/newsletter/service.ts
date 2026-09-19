import { randomBytes, randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newsletterSubscribers } from "@/db/schema";
import type { SubscriberStatus } from "@/features/newsletter/schemas";

export type SubscriberRecord = {
  id: string;
  email: string;
  status: SubscriberStatus;
  confirmToken: string | null;
  unsubscribeToken: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
};

type MemoryStore = { items: SubscriberRecord[] };

const globalStore = globalThis as typeof globalThis & {
  __ggiSubscribers?: MemoryStore;
};

function store(): MemoryStore {
  if (!globalStore.__ggiSubscribers) {
    globalStore.__ggiSubscribers = { items: [] };
  }
  return globalStore.__ggiSubscribers;
}

function token(): string {
  return randomBytes(24).toString("hex");
}

function serialize(row: {
  id: string;
  email: string;
  status: SubscriberStatus;
  confirmToken: string | null;
  unsubscribeToken: string;
  confirmedAt: Date | null;
  unsubscribedAt: Date | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}): SubscriberRecord {
  return {
    id: row.id,
    email: row.email,
    status: row.status,
    confirmToken: row.confirmToken,
    unsubscribeToken: row.unsubscribeToken,
    confirmedAt: row.confirmedAt ? row.confirmedAt.toISOString() : null,
    unsubscribedAt: row.unsubscribedAt
      ? row.unsubscribedAt.toISOString()
      : null,
    source: row.source,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function requestSubscribe(
  email: string,
): Promise<{ record: SubscriberRecord; confirmToken: string }> {
  const normalised = email.trim().toLowerCase();
  const db = getDb();
  const now = new Date();
  const confirmToken = token();
  const unsubscribeToken = token();

  if (!db) {
    const existing = store().items.find((item) => item.email === normalised);
    if (existing?.status === "subscribed") {
      return { record: existing, confirmToken: existing.confirmToken ?? confirmToken };
    }
    if (existing) {
      existing.status = "pending";
      existing.confirmToken = confirmToken;
      existing.unsubscribeToken = unsubscribeToken;
      existing.unsubscribedAt = null;
      existing.updatedAt = now.toISOString();
      return { record: existing, confirmToken };
    }
    const record: SubscriberRecord = {
      id: randomUUID(),
      email: normalised,
      status: "pending",
      confirmToken,
      unsubscribeToken,
      confirmedAt: null,
      unsubscribedAt: null,
      source: "public",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    store().items.unshift(record);
    return { record, confirmToken };
  }

  const [existing] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, normalised))
    .limit(1);

  if (existing?.status === "subscribed") {
    return {
      record: serialize(existing as never),
      confirmToken: existing.confirmToken ?? confirmToken,
    };
  }

  if (existing) {
    const [row] = await db
      .update(newsletterSubscribers)
      .set({
        status: "pending",
        confirmToken,
        unsubscribeToken,
        unsubscribedAt: null,
        updatedAt: now,
      })
      .where(eq(newsletterSubscribers.id, existing.id))
      .returning();
    return { record: serialize(row as never), confirmToken };
  }

  const [row] = await db
    .insert(newsletterSubscribers)
    .values({
      email: normalised,
      status: "pending",
      confirmToken,
      unsubscribeToken,
      source: "public",
    })
    .returning();

  return { record: serialize(row as never), confirmToken };
}

export async function confirmSubscribe(
  confirmToken: string,
): Promise<SubscriberRecord | null> {
  const db = getDb();
  const now = new Date();

  if (!db) {
    const found = store().items.find(
      (item) => item.confirmToken === confirmToken,
    );
    if (!found) return null;
    found.status = "subscribed";
    found.confirmedAt = now.toISOString();
    found.confirmToken = null;
    found.updatedAt = now.toISOString();
    return found;
  }

  const [existing] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.confirmToken, confirmToken))
    .limit(1);
  if (!existing) return null;

  const [row] = await db
    .update(newsletterSubscribers)
    .set({
      status: "subscribed",
      confirmedAt: now,
      confirmToken: null,
      updatedAt: now,
    })
    .where(eq(newsletterSubscribers.id, existing.id))
    .returning();

  return serialize(row as never);
}

export async function unsubscribeByToken(
  unsubscribeToken: string,
): Promise<SubscriberRecord | null> {
  const db = getDb();
  const now = new Date();

  if (!db) {
    const found = store().items.find(
      (item) => item.unsubscribeToken === unsubscribeToken,
    );
    if (!found) return null;
    found.status = "unsubscribed";
    found.unsubscribedAt = now.toISOString();
    found.updatedAt = now.toISOString();
    return found;
  }

  const [existing] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.unsubscribeToken, unsubscribeToken))
    .limit(1);
  if (!existing) return null;

  const [row] = await db
    .update(newsletterSubscribers)
    .set({
      status: "unsubscribed",
      unsubscribedAt: now,
      updatedAt: now,
    })
    .where(eq(newsletterSubscribers.id, existing.id))
    .returning();

  return serialize(row as never);
}

export async function listSubscribers(): Promise<SubscriberRecord[]> {
  const db = getDb();
  if (!db) {
    return [...store().items];
  }
  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt));
  return rows.map((row) => serialize(row as never));
}

export async function adminCreateSubscriber(input: {
  email: string;
  status: SubscriberStatus;
}): Promise<SubscriberRecord> {
  const normalised = input.email.trim().toLowerCase();
  const db = getDb();
  const now = new Date();
  const unsubscribeToken = token();

  if (!db) {
    const existing = store().items.find((item) => item.email === normalised);
    if (existing) {
      existing.status = input.status;
      existing.confirmedAt =
        input.status === "subscribed" ? now.toISOString() : existing.confirmedAt;
      existing.unsubscribedAt =
        input.status === "unsubscribed"
          ? now.toISOString()
          : existing.unsubscribedAt;
      existing.updatedAt = now.toISOString();
      existing.source = "admin";
      return existing;
    }
    const record: SubscriberRecord = {
      id: randomUUID(),
      email: normalised,
      status: input.status,
      confirmToken: null,
      unsubscribeToken,
      confirmedAt:
        input.status === "subscribed" ? now.toISOString() : null,
      unsubscribedAt:
        input.status === "unsubscribed" ? now.toISOString() : null,
      source: "admin",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    store().items.unshift(record);
    return record;
  }

  const [existing] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, normalised))
    .limit(1);

  if (existing) {
    const [row] = await db
      .update(newsletterSubscribers)
      .set({
        status: input.status,
        confirmedAt:
          input.status === "subscribed" ? now : existing.confirmedAt,
        unsubscribedAt:
          input.status === "unsubscribed" ? now : existing.unsubscribedAt,
        source: "admin",
        updatedAt: now,
      })
      .where(eq(newsletterSubscribers.id, existing.id))
      .returning();
    return serialize(row as never);
  }

  const [row] = await db
    .insert(newsletterSubscribers)
    .values({
      email: normalised,
      status: input.status,
      confirmToken: null,
      unsubscribeToken,
      confirmedAt: input.status === "subscribed" ? now : null,
      unsubscribedAt: input.status === "unsubscribed" ? now : null,
      source: "admin",
    })
    .returning();

  return serialize(row as never);
}

export async function adminSetStatus(
  id: string,
  status: SubscriberStatus,
): Promise<SubscriberRecord | null> {
  const db = getDb();
  const now = new Date();

  if (!db) {
    const found = store().items.find((item) => item.id === id);
    if (!found) return null;
    found.status = status;
    found.confirmedAt =
      status === "subscribed" ? now.toISOString() : found.confirmedAt;
    found.unsubscribedAt =
      status === "unsubscribed" ? now.toISOString() : null;
    found.updatedAt = now.toISOString();
    return found;
  }

  const [existing] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.id, id))
    .limit(1);
  if (!existing) return null;

  const [row] = await db
    .update(newsletterSubscribers)
    .set({
      status,
      confirmedAt: status === "subscribed" ? now : existing.confirmedAt,
      unsubscribedAt: status === "unsubscribed" ? now : null,
      updatedAt: now,
    })
    .where(eq(newsletterSubscribers.id, id))
    .returning();

  return serialize(row as never);
}

export function siteOrigin(): string {
  return (
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
