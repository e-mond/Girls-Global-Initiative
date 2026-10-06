"use client";

import Link from "next/link";

/** Short factual notice linking to Privacy (and optionally Terms). */
export function FormPrivacyNotice({
  includeTerms = false,
}: {
  includeTerms?: boolean;
}) {
  return (
    <p className="text-xs leading-relaxed text-text-muted">
      By submitting, you send the details on this form to Girls Global
      Initiative so we can respond. See our{" "}
      <Link
        href="/privacy"
        className="font-medium text-brand-sky underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky"
      >
        Privacy Policy
      </Link>
      {includeTerms ? (
        <>
          {" "}
          and{" "}
          <Link
            href="/terms"
            className="font-medium text-brand-sky underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky"
          >
            Terms of Use
          </Link>
        </>
      ) : null}
      .
    </p>
  );
}
