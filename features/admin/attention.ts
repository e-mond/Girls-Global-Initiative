/**
 * Aggregates real operational attention items for the admin notification panel.
 * No fabricated counts — empty when nothing needs attention.
 */

import { listDonations } from "@/features/donations/service";
import { listSubmissions } from "@/features/submissions/service";

export type AttentionItem = {
  id: string;
  title: string;
  href: string;
  createdAt: string;
  kind: "submission" | "donation";
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

export async function listAttentionItems(
  limit = 12,
): Promise<(AttentionItem & { when: string })[]> {
  const [volunteer, partnership, contact, donations] = await Promise.all([
    listSubmissions("volunteer"),
    listSubmissions("partnership"),
    listSubmissions("contact"),
    listDonations(),
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

  return [...submissionItems, ...donationItems]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit)
    .map((item) => ({ ...item, when: relativeLabel(item.createdAt) }));
}
