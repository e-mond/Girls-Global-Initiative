import { PageSkeleton } from "@/components/layout/page-skeleton";

/** Gallery list loading skeleton (kept off CMS [slug] parents to preserve hard 404s). */
export default function Loading() {
  return <PageSkeleton variant="public" />;
}
