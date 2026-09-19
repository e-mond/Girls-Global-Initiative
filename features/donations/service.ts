import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { donations } from "@/db/schema";
import type {
  DonationFrequency,
  DonationStatus,
} from "@/features/donations/schemas";

export type DonationRecord = {
  id: string;
  reference: string;
  paystackEventId: string | null;
  amountMinor: number;
  currency: string;
  frequency: DonationFrequency;
  status: DonationStatus;
  donorName: string | null;
  donorEmail: string | null;
  isAnonymous: boolean;
  channel: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type MemoryStore = { items: DonationRecord[] };

const globalStore = globalThis as typeof globalThis & {
  __ggiDonations?: MemoryStore;
};

function store(): MemoryStore {
  if (!globalStore.__ggiDonations) {
    globalStore.__ggiDonations = { items: [] };
  }
  return globalStore.__ggiDonations;
}

function serialize(row: {
  id: string;
  reference: string;
  paystackEventId: string | null;
  amountMinor: number;
  currency: string;
  frequency: DonationFrequency;
  status: DonationStatus;
  donorName: string | null;
  donorEmail: string | null;
  isAnonymous: boolean;
  channel: string | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): DonationRecord {
  return {
    id: row.id,
    reference: row.reference,
    paystackEventId: row.paystackEventId,
    amountMinor: row.amountMinor,
    currency: row.currency,
    frequency: row.frequency,
    status: row.status,
    donorName: row.donorName,
    donorEmail: row.donorEmail,
    isAnonymous: row.isAnonymous,
    channel: row.channel,
    paidAt: row.paidAt ? row.paidAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function paystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

export function siteOrigin(): string {
  return (
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function createReference(): string {
  return `ggi_${Date.now().toString(36)}_${randomUUID().slice(0, 8)}`;
}

export function organisationTransferDetails(): {
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  mobileMoney: string | null;
  notes: string | null;
  configured: boolean;
} {
  const bankName = process.env.ORG_BANK_NAME?.trim() || null;
  const accountName = process.env.ORG_ACCOUNT_NAME?.trim() || null;
  const accountNumber = process.env.ORG_ACCOUNT_NUMBER?.trim() || null;
  const mobileMoney = process.env.ORG_MOBILE_MONEY?.trim() || null;
  const notes = process.env.ORG_TRANSFER_NOTES?.trim() || null;
  return {
    bankName,
    accountName,
    accountNumber,
    mobileMoney,
    notes,
    configured: Boolean(bankName || accountNumber || mobileMoney),
  };
}

export async function createDonation(input: {
  reference: string;
  amountMinor: number;
  frequency: DonationFrequency;
  donorName: string | null;
  donorEmail: string | null;
  isAnonymous: boolean;
  status?: DonationStatus;
}): Promise<DonationRecord> {
  const db = getDb();
  const now = new Date();
  const status = input.status ?? "pending";

  if (!db) {
    const record: DonationRecord = {
      id: randomUUID(),
      reference: input.reference,
      paystackEventId: null,
      amountMinor: input.amountMinor,
      currency: "GHS",
      frequency: input.frequency,
      status,
      donorName: input.donorName,
      donorEmail: input.donorEmail,
      isAnonymous: input.isAnonymous,
      channel: null,
      paidAt: status === "success" ? now.toISOString() : null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    store().items.unshift(record);
    return record;
  }

  const [row] = await db
    .insert(donations)
    .values({
      reference: input.reference,
      amountMinor: input.amountMinor,
      frequency: input.frequency,
      donorName: input.donorName,
      donorEmail: input.donorEmail,
      isAnonymous: input.isAnonymous,
      status,
      paidAt: status === "success" ? now : null,
    })
    .returning();

  return serialize(row as never);
}

export async function findDonationByReference(
  reference: string,
): Promise<DonationRecord | null> {
  const db = getDb();
  if (!db) {
    return store().items.find((item) => item.reference === reference) ?? null;
  }
  const [row] = await db
    .select()
    .from(donations)
    .where(eq(donations.reference, reference))
    .limit(1);
  return row ? serialize(row as never) : null;
}

export async function markDonationSuccess(input: {
  reference: string;
  paystackEventId?: string | null;
  channel?: string | null;
  paidAt?: Date | null;
}): Promise<DonationRecord | null> {
  const db = getDb();
  const now = input.paidAt ?? new Date();

  if (!db) {
    const found = store().items.find(
      (item) => item.reference === input.reference,
    );
    if (!found) return null;
    if (found.status === "success") return found;
    found.status = "success";
    found.paystackEventId = input.paystackEventId ?? found.paystackEventId;
    found.channel = input.channel ?? found.channel;
    found.paidAt = now.toISOString();
    found.updatedAt = now.toISOString();
    return found;
  }

  const existing = await findDonationByReference(input.reference);
  if (!existing) return null;
  if (existing.status === "success") return existing;

  const [row] = await db
    .update(donations)
    .set({
      status: "success",
      paystackEventId: input.paystackEventId ?? existing.paystackEventId,
      channel: input.channel ?? existing.channel,
      paidAt: now,
      updatedAt: now,
    })
    .where(eq(donations.reference, input.reference))
    .returning();

  return serialize(row as never);
}

export async function listDonations(): Promise<DonationRecord[]> {
  const db = getDb();
  if (!db) return [...store().items];
  const rows = await db
    .select()
    .from(donations)
    .orderBy(desc(donations.createdAt));
  return rows.map((row) => serialize(row as never));
}

export function verifyPaystackSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret =
    process.env.PAYSTACK_WEBHOOK_SECRET?.trim() ||
    process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret || !signature) return false;
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  try {
    const a = Buffer.from(hash);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountMinor: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<{ authorizationUrl: string } | { error: string }> {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) {
    return { error: "Paystack is not configured yet." };
  }

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: input.email,
          amount: String(input.amountMinor),
          currency: "GHS",
          reference: input.reference,
          callback_url: input.callbackUrl,
          metadata: input.metadata,
        }),
      },
    );
    const json = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string };
    };
    if (!response.ok || !json.status || !json.data?.authorization_url) {
      return {
        error: "Could not start checkout. Please try again or use transfer.",
      };
    }
    return { authorizationUrl: json.data.authorization_url };
  } catch {
    return {
      error: "Could not reach Paystack. Please try again or use transfer.",
    };
  }
}

export async function verifyPaystackTransaction(
  reference: string,
): Promise<{ success: boolean; channel?: string; paidAt?: string }> {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) return { success: false };

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
      },
    );
    const json = (await response.json()) as {
      data?: { status?: string; channel?: string; paid_at?: string };
    };
    if (json.data?.status === "success") {
      return {
        success: true,
        channel: json.data.channel,
        paidAt: json.data.paid_at,
      };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}
