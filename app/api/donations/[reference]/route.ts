import { NextResponse } from "next/server";
import {
  findDonationByReference,
  markDonationSuccess,
  verifyPaystackTransaction,
} from "@/features/donations/service";

type RouteContext = { params: Promise<{ reference: string }> };

/** Soft verify used by the thanks page when webhook is delayed. */
export async function GET(_request: Request, context: RouteContext) {
  const { reference } = await context.params;
  if (!reference) {
    return NextResponse.json(
      { error: { message: "Reference required." } },
      { status: 400 },
    );
  }

  let record = await findDonationByReference(reference);
  if (!record) {
    return NextResponse.json(
      { error: { message: "Donation not found." } },
      { status: 404 },
    );
  }

  if (record.status !== "success" && record.frequency === "one_time") {
    const verified = await verifyPaystackTransaction(reference);
    if (verified.success) {
      record =
        (await markDonationSuccess({
          reference,
          channel: verified.channel ?? null,
          paidAt: verified.paidAt ? new Date(verified.paidAt) : new Date(),
        })) ?? record;
    }
  }

  return NextResponse.json({
    data: {
      reference: record.reference,
      status: record.status,
      amountMinor: record.amountMinor,
      currency: record.currency,
      frequency: record.frequency,
      isAnonymous: record.isAnonymous,
      donorName: record.isAnonymous ? null : record.donorName,
    },
  });
}
