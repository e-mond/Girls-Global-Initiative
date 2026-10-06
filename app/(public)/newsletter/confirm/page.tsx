import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.newsletterConfirm.title,
  description: PAGE_SEO.newsletterConfirm.description,
  path: "/newsletter/confirm",
  robots: NOINDEX_ROBOTS,
});

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
