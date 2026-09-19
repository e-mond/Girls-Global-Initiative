import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  contactMessages,
  partnershipRequests,
  volunteerApplications,
} from "@/db/schema";
import type {
  SubmissionKind,
  SubmissionStatus,
} from "@/features/submissions/schemas";

export type SubmissionRecord = {
  id: string;
  kind: SubmissionKind;
  status: SubmissionStatus;
  email: string;
  createdAt: string;
  updatedAt: string;
  summary: string;
  payload: Record<string, unknown>;
};

type MemoryStore = Record<SubmissionKind, SubmissionRecord[]>;

const globalStore = globalThis as typeof globalThis & {
  __ggiSubmissions?: MemoryStore;
};

function store(): MemoryStore {
  if (!globalStore.__ggiSubmissions) {
    globalStore.__ggiSubmissions = {
      volunteer: [],
      partnership: [],
      contact: [],
    };
  }
  return globalStore.__ggiSubmissions;
}

function serialize(
  kind: SubmissionKind,
  row: Record<string, unknown>,
  summary: string,
): SubmissionRecord {
  return {
    id: String(row.id),
    kind,
    status: row.status as SubmissionStatus,
    email: String(row.email),
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
    updatedAt:
      row.updatedAt instanceof Date
        ? row.updatedAt.toISOString()
        : String(row.updatedAt),
    summary,
    payload: row,
  };
}

export async function createVolunteer(
  input: Record<string, unknown>,
): Promise<SubmissionRecord> {
  const db = getDb();
  const now = new Date();
  if (!db) {
    const record: SubmissionRecord = {
      id: randomUUID(),
      kind: "volunteer",
      status: "new",
      email: String(input.email),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      summary: String(input.fullName),
      payload: { ...input, status: "new", id: undefined },
    };
    record.payload.id = record.id;
    store().volunteer.unshift(record);
    return record;
  }

  const [row] = await db
    .insert(volunteerApplications)
    .values({
      fullName: String(input.fullName),
      email: String(input.email),
      phone: String(input.phone ?? "") || null,
      city: String(input.city ?? "") || null,
      interestArea: String(input.interestArea),
      skills: String(input.skills),
      availability: String(input.availability),
      message: String(input.message ?? ""),
    })
    .returning();

  return serialize("volunteer", row as Record<string, unknown>, row.fullName);
}

export async function createPartnership(
  input: Record<string, unknown>,
): Promise<SubmissionRecord> {
  const db = getDb();
  const now = new Date();
  if (!db) {
    const record: SubmissionRecord = {
      id: randomUUID(),
      kind: "partnership",
      status: "new",
      email: String(input.email),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      summary: `${input.organisation} — ${input.requesterName}`,
      payload: { ...input, status: "new" },
    };
    record.payload.id = record.id;
    store().partnership.unshift(record);
    return record;
  }

  const [row] = await db
    .insert(partnershipRequests)
    .values({
      requesterName: String(input.requesterName),
      email: String(input.email),
      roleTitle: String(input.roleTitle),
      organisation: String(input.organisation),
      location: String(input.location),
      message: String(input.message),
    })
    .returning();

  return serialize(
    "partnership",
    row as Record<string, unknown>,
    `${row.organisation} — ${row.requesterName}`,
  );
}

export async function createContact(
  input: Record<string, unknown>,
): Promise<SubmissionRecord> {
  const db = getDb();
  const now = new Date();
  if (!db) {
    const record: SubmissionRecord = {
      id: randomUUID(),
      kind: "contact",
      status: "new",
      email: String(input.email),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      summary: String(input.subject),
      payload: { ...input, status: "new" },
    };
    record.payload.id = record.id;
    store().contact.unshift(record);
    return record;
  }

  const [row] = await db
    .insert(contactMessages)
    .values({
      fullName: String(input.fullName),
      email: String(input.email),
      subject: String(input.subject),
      message: String(input.message),
    })
    .returning();

  return serialize("contact", row as Record<string, unknown>, row.subject);
}

export async function listSubmissions(
  kind: SubmissionKind,
): Promise<SubmissionRecord[]> {
  const db = getDb();
  if (!db) {
    return [...store()[kind]];
  }

  if (kind === "volunteer") {
    const rows = await db
      .select()
      .from(volunteerApplications)
      .orderBy(desc(volunteerApplications.createdAt));
    return rows.map((row) =>
      serialize("volunteer", row as Record<string, unknown>, row.fullName),
    );
  }

  if (kind === "partnership") {
    const rows = await db
      .select()
      .from(partnershipRequests)
      .orderBy(desc(partnershipRequests.createdAt));
    return rows.map((row) =>
      serialize(
        "partnership",
        row as Record<string, unknown>,
        `${row.organisation} — ${row.requesterName}`,
      ),
    );
  }

  const rows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));
  return rows.map((row) =>
    serialize("contact", row as Record<string, unknown>, row.subject),
  );
}

export async function updateSubmissionStatus(
  kind: SubmissionKind,
  id: string,
  status: SubmissionStatus,
  actorId: string | null,
): Promise<SubmissionRecord | null> {
  const db = getDb();
  const now = new Date();

  if (!db) {
    const list = store()[kind];
    const index = list.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }
    const updated = {
      ...list[index],
      status,
      updatedAt: now.toISOString(),
      payload: { ...list[index].payload, status },
    };
    list[index] = updated;
    return updated;
  }

  if (kind === "volunteer") {
    const [row] = await db
      .update(volunteerApplications)
      .set({
        status,
        statusUpdatedAt: now,
        statusUpdatedById: actorId,
        updatedAt: now,
      })
      .where(eq(volunteerApplications.id, id))
      .returning();
    return row
      ? serialize("volunteer", row as Record<string, unknown>, row.fullName)
      : null;
  }

  if (kind === "partnership") {
    const [row] = await db
      .update(partnershipRequests)
      .set({
        status,
        statusUpdatedAt: now,
        statusUpdatedById: actorId,
        updatedAt: now,
      })
      .where(eq(partnershipRequests.id, id))
      .returning();
    return row
      ? serialize(
          "partnership",
          row as Record<string, unknown>,
          `${row.organisation} — ${row.requesterName}`,
        )
      : null;
  }

  const [row] = await db
    .update(contactMessages)
    .set({
      status,
      statusUpdatedAt: now,
      statusUpdatedById: actorId,
      updatedAt: now,
    })
    .where(eq(contactMessages.id, id))
    .returning();
  return row
    ? serialize("contact", row as Record<string, unknown>, row.subject)
    : null;
}
