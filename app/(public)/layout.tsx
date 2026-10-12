import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

/**
 * Keep public HTML off the default Next.js `s-maxage=31536000` CDN cache.
 * Year-long HTML caching after deploys leaves pages pointing at deleted
 * `/_next/static/*` hashes (CSS/JS MIME errors / ChunkLoadError).
 */
export const revalidate = 60;

/** Public marketing chrome shared by visitor-facing routes. */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-navy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-text-on-inverse"
      >
        Skip to main content
      </a>
      <PublicHeader />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-brand-navy/25 to-transparent"
      />
      <PublicFooter />
    </div>
  );
}
