"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeroCompact } from "@/components/layout/public-page-intro";

export default function DonateFailedClient() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") ?? searchParams.get("trxref") ?? "";

  return (
    <PageHeroCompact
      eyebrow="Donate"
      title="Payment not completed"
      description="Your Paystack checkout did not finish successfully. You can try again or send a mobile-money transfer instead."
    >
      <div
        className="space-y-4 rounded-3xl border border-border-default bg-bg-surface p-6"
        role="alert"
      >
        <p className="text-sm font-semibold text-brand-navy">
          No charge was confirmed for this attempt
        </p>
        <p className="text-sm leading-relaxed text-text-muted">
          If money left your account but this page still shows a failure, keep
          your receipt and contact Girls Global Initiative with the reference
          below. Otherwise, you can restart checkout or use MoMo.
        </p>
        {reference ? (
          <p className="text-xs text-text-muted">Reference: {reference}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Link
            href="/get-involved/donate"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-magenta px-4 text-sm font-medium text-text-on-inverse hover:bg-brand-magenta/90"
          >
            Try Paystack again
          </Link>
          <Link
            href="/get-involved/donate?method=direct"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-default px-4 text-sm font-medium text-brand-navy hover:border-brand-navy/40"
          >
            Pay with MoMo
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-default px-4 text-sm font-medium text-brand-navy hover:border-brand-navy/40"
          >
            Contact GGI
          </Link>
        </div>
      </div>
    </PageHeroCompact>
  );
}
