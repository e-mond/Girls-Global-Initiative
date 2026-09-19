import { desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { auditLogs } from "@/db/schema";

export type AuditEntry = {
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
};

export type AuditLogRecord = AuditEntry & {
  id: string;
  createdAt: string;
};

const memoryAudit: AuditLogRecord[] = [];

/** Writes an immutable audit row — Neon when available, memory fallback offline. */
export async function writeAuditLog(entry: AuditEntry): Promise<void> {
  const db = getDb();
  if (db) {
    await db.insert(auditLogs).values({
      actorUserId: entry.actorUserId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId ?? null,
      summary: entry.summary,
      metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
    });
    return;
  }

  memoryAudit.unshift({
    id: `mem_${Date.now()}_${memoryAudit.length}`,
    createdAt: new Date().toISOString(),
    ...entry,
  });
  if (memoryAudit.length > 500) {
    memoryAudit.length = 500;
  }
}

export async function listAuditLogs(limit = 100): Promise<AuditLogRecord[]> {
  const db = getDb();
  if (!db) {
    return memoryAudit.slice(0, limit);
  }

  const rows = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    actorUserId: row.actorUserId,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    summary: row.summary,
    metadata: row.metadata
      ? (JSON.parse(row.metadata) as Record<string, unknown>)
      : undefined,
    createdAt: row.createdAt.toISOString(),
  }));
}

export function getMemoryAuditLogs(): AuditEntry[] {
  return memoryAudit.map(({ id: _id, createdAt: _c, ...entry }) => entry);
}
