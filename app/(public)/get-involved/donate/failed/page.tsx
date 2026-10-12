import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.donateFailed.title,
  description: PAGE_SEO.donateFailed.description,
  path: "/get-involved/donate/failed",
  robots: NOINDEX_ROBOTS,
});

import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import DonateFailedClient from "./failed-client";

export default function DonateFailedPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="public" />}>
      <DonateFailedClient />
    </Suspense>
  );
}
