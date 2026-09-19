import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

const NAV_LINKS = [
  { href: "/our-story", label: "Our story" },
  { href: "/what-we-do", label: "What we do" },
  { href: "/founder", label: "Founder" },
  { href: "/communities", label: "Communities" },
] as const;

/**
 * Public header matching the approved homepage reference:
 * left brand, centered navy text links, right Contact outline + magenta Support CTA.
 */
export function PublicHeader() {
  return (
    <header className="relative z-20 bg-bg-base">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
        <Link href="/" className="relative z-10 flex min-w-0 items-center gap-3">
          <Image
            src="/brand/ggi-logo.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full bg-brand-navy object-cover"
            priority
          />
          <span className="min-w-0">
            <span className="block font-display text-sm font-bold leading-tight text-brand-navy sm:text-[0.95rem]">
              Girls Global Initiative
            </span>
            <span className="mt-0.5 hidden text-xs text-text-muted sm:block">
              Rights · Health · Potential
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 lg:gap-8 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-brand-navy hover:text-brand-magenta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-brand-navy/20 bg-bg-surface px-3 text-sm font-medium text-brand-navy hover:border-brand-navy/40 sm:px-4"
          >
            Contact us
          </Link>
          <Link
            href="/get-involved/donate"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-brand-magenta px-3 text-sm font-medium text-text-on-inverse hover:bg-brand-magenta/90 sm:px-4"
          >
            Support a girl
            <Heart className="h-3.5 w-3.5 fill-current" aria-hidden />
          </Link>
        </div>
      </div>

      <nav
        aria-label="Primary mobile"
        className="flex gap-4 overflow-x-auto border-t border-border-default/70 px-4 py-3 md:hidden"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-sm font-medium text-brand-navy hover:text-brand-magenta"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
