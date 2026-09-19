import { Suspense } from "react";
import DonateThanksClient from "./thanks-client";

export default function DonateThanksPage() {
  return (
    <Suspense
      fallback={
        <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-text-muted">
          Confirming your donation…
        </p>
      }
    >
      <DonateThanksClient />
    </Suspense>
  );
}
