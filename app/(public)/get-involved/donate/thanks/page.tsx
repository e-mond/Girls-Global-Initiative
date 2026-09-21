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
