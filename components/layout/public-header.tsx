import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/our-story", label: "Our story" },
  { href: "/what-we-do", label: "What we do" },
  { href: "/founder", label: "Founder" },
  { href: "/communities", label: "Communities" },
  { href: "/contact", label: "Contact us" },
] as const;

/** Public site header matching the approved homepage navigation. */
export function PublicHeader() {
  return (
    <header className="border-b border-border-default bg-bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/ggi-logo.png"
            alt="Girls Global Initiative"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
            priority
          />
          <span className="font-display text-sm font-semibold text-brand-navy sm:text-base">
            Girls Global Initiative
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-primary hover:text-brand-sky"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/get-involved/donate"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-magenta px-4 text-sm font-medium text-text-on-inverse hover:bg-brand-magenta/90"
        >
          Support a girl
        </Link>
      </div>

      <nav
        aria-label="Primary mobile"
        className="flex gap-3 overflow-x-auto border-t border-border-default px-4 py-3 md:hidden"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-sm text-text-muted hover:text-brand-sky"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
