import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import NewsletterConfirmClient from "./confirm-client";

export default function NewsletterConfirmPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="public" />}>
      <NewsletterConfirmClient />
    </Suspense>
  );
}
