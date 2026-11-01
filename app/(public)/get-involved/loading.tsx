import { PageSkeleton } from "@/components/layout/page-skeleton";

/** Get-involved section loading skeleton (no CMS slug soft-404 risk). */
export default function Loading() {
  return <PageSkeleton variant="public" />;
}
