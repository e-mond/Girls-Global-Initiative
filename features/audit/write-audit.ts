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

const memoryAudit: AuditEntry[] = [];

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

  memoryAudit.unshift({ ...entry });
  if (memoryAudit.length > 500) {
    memoryAudit.length = 500;
  }
}

export function getMemoryAuditLogs(): AuditEntry[] {
  return [...memoryAudit];
}
