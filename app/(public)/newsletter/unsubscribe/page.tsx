import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import NewsletterUnsubscribeClient from "./unsubscribe-client";

export default function NewsletterUnsubscribePage() {
  return (
    <Suspense fallback={<PageSkeleton variant="public" />}>
      <NewsletterUnsubscribeClient />
    </Suspense>
  );
}
