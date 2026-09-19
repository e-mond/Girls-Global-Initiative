import { Suspense } from "react";
import NewsletterConfirmClient from "./confirm-client";

export default function NewsletterConfirmPage() {
  return (
    <Suspense
      fallback={
        <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-text-muted">
          Confirming your subscription…
        </p>
      }
    >
      <NewsletterConfirmClient />
    </Suspense>
  );
}
