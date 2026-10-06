import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.donateThanks.title,
  description: PAGE_SEO.donateThanks.description,
  path: "/get-involved/donate/thanks",
  robots: NOINDEX_ROBOTS,
});

import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import DonateThanksClient from "./thanks-client";

export default function DonateThanksPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="public" />}>
      <DonateThanksClient />
    </Suspense>
  );
}
