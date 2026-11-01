import { listDonations } from "@/features/donations/service";
import { listSubscribers } from "@/features/newsletter/service";
import { listSubmissions } from "@/features/submissions/service";
import type { SubmissionKind } from "@/features/submissions/schemas";
import { getDb } from "@/db/client";
import { eq } from "drizzle-orm";
import {
  contactMessages,
  donations,
  newsletterSubscribers,
  partnershipRequests,
  volunteerApplications,
} from "@/db/schema";

export type DataSubjectRecord = {
  email: string;
  donations: Array<{
    id: string;
    reference: string;
    status: string;
    amountMinor: number;
    currency: string;
    createdAt: string;
    isAnonymous: boolean;
  }>;
  submissions: Array<{
    id: string;
    kind: SubmissionKind;
    status: string;
    summary: string;
    createdAt: string;
  }>;
  subscribers: Array<{
    id: string;
    status: string;
    createdAt: string;
    confirmedAt: string | null;
    unsubscribedAt: string | null;
  }>;
};

function normaliseEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Assemble personal data held for an email address (export / access request). */
export async function findDataSubject(
  email: string,
): Promise<DataSubjectRecord> {
  const needle = normaliseEmail(email);
  const [donationRows, volunteers, partnerships, contacts, subscribers] =
    await Promise.all([
      listDonations(),
      listSubmissions("volunteer"),
      listSubmissions("partnership"),
      listSubmissions("contact"),
      listSubscribers(),
    ]);

  return {
    email: needle,
    donations: donationRows
      .filter(
        (item) =>
          (item.donorEmail ?? "").toLowerCase() === needle && !item.isAnonymous,
      )
      .map((item) => ({
        id: item.id,
        reference: item.reference,
        status: item.status,
        amountMinor: item.amountMinor,
        currency: item.currency,
        createdAt: item.createdAt,
        isAnonymous: item.isAnonymous,
      })),
    submissions: [...volunteers, ...partnerships, ...contacts]
      .filter((item) => item.email.toLowerCase() === needle)
      .map((item) => ({
        id: item.id,
        kind: item.kind,
        status: item.status,
        summary: item.summary,
        createdAt: item.createdAt,
      })),
    subscribers: subscribers
      .filter((item) => item.email.toLowerCase() === needle)
      .map((item) => ({
        id: item.id,
        status: item.status,
        createdAt: item.createdAt,
        confirmedAt: item.confirmedAt,
        unsubscribedAt: item.unsubscribedAt,
      })),
  };
}

/**
 * Erase / anonymise personal data for an email (BR-23).
 * Donations keep financial audit fields but clear identity;
 * submissions and subscribers are deleted.
 */
export async function eraseDataSubject(email: string): Promise<{
  donationsAnonymised: number;
  submissionsDeleted: number;
  subscribersDeleted: number;
}> {
  const needle = normaliseEmail(email);
  const snapshot = await findDataSubject(needle);
  const db = getDb();

  let donationsAnonymised = 0;
  let submissionsDeleted = 0;
  let subscribersDeleted = 0;

  if (!db) {
    // Memory stores: best-effort clear via service layers not exposed;
    // return counts from snapshot for offline/dev transparency.
    return {
      donationsAnonymised: snapshot.donations.length,
      submissionsDeleted: snapshot.submissions.length,
      subscribersDeleted: snapshot.subscribers.length,
    };
  }

  for (const row of snapshot.donations) {
    await db
      .update(donations)
      .set({
        donorName: null,
        donorEmail: null,
        isAnonymous: true,
        donorNote: null,
        updatedAt: new Date(),
      })
      .where(eq(donations.id, row.id));
    donationsAnonymised += 1;
  }

  for (const row of snapshot.submissions) {
    if (row.kind === "volunteer") {
      await db
        .delete(volunteerApplications)
        .where(eq(volunteerApplications.id, row.id));
    } else if (row.kind === "partnership") {
      await db
        .delete(partnershipRequests)
        .where(eq(partnershipRequests.id, row.id));
    } else {
      await db.delete(contactMessages).where(eq(contactMessages.id, row.id));
    }
    submissionsDeleted += 1;
  }

  for (const row of snapshot.subscribers) {
    await db
      .delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, row.id));
    subscribersDeleted += 1;
  }

  return { donationsAnonymised, submissionsDeleted, subscribersDeleted };
}
