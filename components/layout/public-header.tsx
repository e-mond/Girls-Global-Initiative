"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { href: "/our-story", label: "Our story" },
  { href: "/what-we-do", label: "What we do" },
  { href: "/get-involved", label: "Get involved" },
  { href: "/contact", label: "Contact" },
] as const;

const ABOUT_LINKS = [
  { href: "/founder", label: "Founder" },
  { href: "/team", label: "Team" },
  { href: "/communities", label: "Communities" },
  { href: "/gallery", label: "Gallery" },
] as const;

function linkIsActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Public header: floating sticky nav with compact primary links and About dropdown.
 */
export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const menuId = useId();
  const aboutMenuId = useId();
  const aboutRef = useRef<HTMLDivElement>(null);

  const aboutActive = ABOUT_LINKS.some((link) =>
    linkIsActive(pathname, link.href),
  );

  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);
  }, [pathname]);

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

  useEffect(() => {
    if (!aboutOpen) {
      return;
    }
    const onPointer = (event: MouseEvent) => {
      if (
        aboutRef.current &&
        !aboutRef.current.contains(event.target as Node)
      ) {
        setAboutOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAboutOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [aboutOpen]);

  return (
    <header className="pointer-events-none sticky top-0 z-40 bg-transparent px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-border-default/70 bg-bg-surface/80 px-3 py-2.5 shadow-sm backdrop-blur-md sm:gap-4 sm:px-4 sm:py-3">
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
          className="absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:gap-2 md:flex"
        >
          {PRIMARY_LINKS.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky",
                linkIsActive(pathname, link.href)
                  ? "bg-bg-base text-brand-magenta"
                  : "text-brand-navy hover:bg-bg-base hover:text-brand-magenta",
              )}
              aria-current={
                linkIsActive(pathname, link.href) ? "page" : undefined
              }
            >
              {link.label}
            </Link>
          ))}

          <div className="relative" ref={aboutRef}>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky",
                aboutActive || aboutOpen
                  ? "bg-bg-base text-brand-magenta"
                  : "text-brand-navy hover:bg-bg-base hover:text-brand-magenta",
              )}
              aria-expanded={aboutOpen}
              aria-controls={aboutMenuId}
              aria-haspopup="menu"
              onClick={() => setAboutOpen((value) => !value)}
            >
              About
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  aboutOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            {aboutOpen ? (
              <ul
                id={aboutMenuId}
                role="menu"
                aria-label="About"
                className="absolute left-1/2 top-full z-20 mt-2 min-w-[11rem] -translate-x-1/2 rounded-xl border border-border-default bg-bg-surface p-1.5 shadow-md"
              >
                {ABOUT_LINKS.map((link) => (
                  <li key={link.href} role="none">
                    <Link
                      role="menuitem"
                      href={link.href}
                      className={cn(
                        "flex min-h-10 items-center rounded-lg px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky",
                        linkIsActive(pathname, link.href)
                          ? "bg-bg-base text-brand-magenta"
                          : "text-brand-navy hover:bg-bg-base",
                      )}
                      aria-current={
                        linkIsActive(pathname, link.href) ? "page" : undefined
                      }
                      onClick={() => setAboutOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {PRIMARY_LINKS.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky",
                linkIsActive(pathname, link.href)
                  ? "bg-bg-base text-brand-magenta"
                  : "text-brand-navy hover:bg-bg-base hover:text-brand-magenta",
              )}
              aria-current={
                linkIsActive(pathname, link.href) ? "page" : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-2">
          <Link
            href="/get-involved/donate"
            className="inline-flex h-11 min-h-11 items-center justify-center gap-1.5 rounded-xl bg-brand-magenta px-3 text-sm font-medium text-text-on-inverse hover:bg-brand-magenta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2 sm:px-4"
          >
            <span className="sm:hidden">Support</span>
            <span className="hidden sm:inline">Support a girl</span>
            <Heart className="h-3.5 w-3.5 fill-current" aria-hidden />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-navy/20 bg-bg-base text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky md:hidden"
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
          className="pointer-events-auto mt-2 rounded-2xl border border-border-default bg-bg-surface shadow-md md:hidden"
        >
          <nav aria-label="Primary mobile" className="px-3 py-3">
            <ul className="flex flex-col gap-1">
              {PRIMARY_LINKS.slice(0, 2).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex min-h-11 items-center rounded-xl px-3 text-base font-medium",
                      linkIsActive(pathname, link.href)
                        ? "bg-bg-base text-brand-magenta"
                        : "text-brand-navy hover:bg-bg-base",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="px-3 pt-2 text-xs font-bold uppercase tracking-wide text-text-muted">
                About
              </li>
              {ABOUT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex min-h-11 items-center rounded-xl px-3 text-base font-medium",
                      linkIsActive(pathname, link.href)
                        ? "bg-bg-base text-brand-magenta"
                        : "text-brand-navy hover:bg-bg-base",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {PRIMARY_LINKS.slice(2).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex min-h-11 items-center rounded-xl px-3 text-base font-medium",
                      linkIsActive(pathname, link.href)
                        ? "bg-bg-base text-brand-magenta"
                        : "text-brand-navy hover:bg-bg-base",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
