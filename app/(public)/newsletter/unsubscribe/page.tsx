import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.newsletterUnsubscribe.title,
  description: PAGE_SEO.newsletterUnsubscribe.description,
  path: "/newsletter/unsubscribe",
  robots: NOINDEX_ROBOTS,
});

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
