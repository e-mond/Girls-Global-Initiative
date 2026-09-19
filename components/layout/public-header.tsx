"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Heart, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/our-story", label: "Our story" },
  { href: "/what-we-do", label: "What we do" },
  { href: "/founder", label: "Founder" },
  { href: "/team", label: "Team" },
  { href: "/communities", label: "Communities" },
] as const;

/**
 * Public header — desktop centered nav; accessible mobile drawer on small screens.
 */
export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-30 border-b border-border-default/60 bg-bg-base">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:py-4 lg:px-6">
        <Link
          href="/"
          className="relative z-10 flex min-w-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/ggi-logo.png"
            alt="Girls Global Initiative"
            width={44}
            height={44}
            className="h-10 w-10 shrink-0 rounded-full bg-brand-navy object-cover sm:h-11 sm:w-11"
            priority
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-bold leading-tight text-brand-navy sm:text-[0.95rem]">
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
              className="whitespace-nowrap rounded-md text-sm font-medium text-brand-navy hover:text-brand-magenta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-2">
          <Link
            href="/contact"
            className="hidden h-11 min-h-11 items-center justify-center rounded-xl border border-brand-navy/20 bg-bg-surface px-3 text-sm font-medium text-brand-navy hover:border-brand-navy/40 sm:inline-flex sm:px-4"
          >
            Contact us
          </Link>
          <Link
            href="/get-involved/donate"
            className="inline-flex h-11 min-h-11 items-center justify-center gap-1.5 rounded-xl bg-brand-magenta px-3 text-sm font-medium text-text-on-inverse hover:bg-brand-magenta/90 sm:px-4"
          >
            <span className="sm:hidden">Support</span>
            <span className="hidden sm:inline">Support a girl</span>
            <Heart className="h-3.5 w-3.5 fill-current" aria-hidden />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-navy/20 bg-bg-surface text-brand-navy md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={menuId}
          className="border-t border-border-default bg-bg-surface md:hidden"
        >
          <nav aria-label="Primary mobile" className="mx-auto max-w-6xl px-4 py-4">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-brand-navy hover:bg-bg-base"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-brand-navy hover:bg-bg-base sm:hidden"
                  onClick={() => setOpen(false)}
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
