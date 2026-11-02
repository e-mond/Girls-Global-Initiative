/**
 * Aggregates real operational attention items for the admin notification panel.
 * No fabricated counts — empty when nothing needs attention.
 */

import { and, desc, eq, gte, inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import { auditLogs } from "@/db/schema";
import { listDonations } from "@/features/donations/service";
import { listSubmissions } from "@/features/submissions/service";

export type AttentionItem = {
  id: string;
  title: string;
  href: string;
  createdAt: string;
  kind: "submission" | "donation" | "account";
};

function relativeLabel(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return mins <= 1 ? "Just now" : `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

async function listActorAccountNotices(
  actorUserId: string,
  limit = 8,
): Promise<AttentionItem[]> {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const actions = ["user.role_changed", "user.disabled", "user.reenabled"] as const;
  const db = getDb();

  if (!db) {
    return [];
  }

  const rows = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      summary: auditLogs.summary,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(
      and(
        eq(auditLogs.actorUserId, actorUserId),
        inArray(auditLogs.action, [...actions]),
        gte(auditLogs.createdAt, since),
      ),
    )
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);

  return rows.map((row) => {
    let title = row.summary;
    if (row.action === "user.role_changed") {
      title = `You changed a staff role — ${row.summary}`;
    } else if (row.action === "user.disabled") {
      title = `You disabled a staff account — ${row.summary}`;
    } else if (row.action === "user.reenabled") {
      title = `You re-enabled a staff account — ${row.summary}`;
    }
    return {
      id: `acct-${row.id}`,
      title,
      href: "/admin/users",
      createdAt: row.createdAt.toISOString(),
      kind: "account" as const,
    };
  });
}

export async function listAttentionItems(
  limit = 12,
  options?: { actorUserId?: string },
): Promise<(AttentionItem & { when: string })[]> {
  const [volunteer, partnership, contact, donations, accountItems] =
    await Promise.all([
      listSubmissions("volunteer"),
      listSubmissions("partnership"),
      listSubmissions("contact"),
      listDonations(),
      options?.actorUserId
        ? listActorAccountNotices(options.actorUserId)
        : Promise.resolve([] as AttentionItem[]),
    ]);

  const submissionItems: AttentionItem[] = [
    ...volunteer
      .filter((item) => item.status === "new")
      .map((item) => ({
        id: `vol-${item.id}`,
        title: "New volunteer submission",
        href: "/admin/submissions",
        createdAt: item.createdAt,
        kind: "submission" as const,
      })),
    ...partnership
      .filter((item) => item.status === "new")
      .map((item) => ({
        id: `part-${item.id}`,
        title: "New partnership request",
        href: "/admin/submissions",
        createdAt: item.createdAt,
        kind: "submission" as const,
      })),
    ...contact
      .filter((item) => item.status === "new")
      .map((item) => ({
        id: `con-${item.id}`,
        title: "New contact enquiry",
        href: "/admin/submissions",
        createdAt: item.createdAt,
        kind: "submission" as const,
      })),
  ];

  const donationItems: AttentionItem[] = donations
    .filter((item) => {
      if (item.status !== "success" && item.status !== "pending") return false;
      const age = Date.now() - new Date(item.createdAt).getTime();
      return age <= 14 * 24 * 60 * 60 * 1000;
    })
    .slice(0, 8)
    .map((item) => ({
      id: `don-${item.id}`,
      title:
        item.status === "success" ? "Donation received" : "Donation pending",
      href: "/admin/donations",
      createdAt: item.createdAt,
      kind: "donation" as const,
    }));

  return [...accountItems, ...submissionItems, ...donationItems]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit)
    .map((item) => ({ ...item, when: relativeLabel(item.createdAt) }));
}
