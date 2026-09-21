import Link from "next/link";
import Image from "next/image";
import { CONTACT_EMAIL } from "@/content/contact-details";
import { SocialLinks } from "@/components/layout/social-links";
import { getSiteSettings } from "@/features/settings/service";

const EXPLORE_LINKS = [
  { href: "/our-story", label: "Our story" },
  { href: "/what-we-do", label: "What we do" },
  { href: "/programmes", label: "Programmes" },
  { href: "/impact", label: "Impact" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/founder", label: "Founder" },
  { href: "/team", label: "Team" },
  { href: "/communities", label: "Communities" },
] as const;

const SUPPORT_LINKS = [
  { href: "/get-involved", label: "Get involved" },
  { href: "/get-involved/donate", label: "Donate" },
  { href: "/get-involved/volunteer", label: "Volunteer" },
  { href: "/get-involved/advocate", label: "Raise your voice" },
  { href: "/partner", label: "Partner with us" },
  { href: "/contact", label: "Contact" },
] as const;

/** Public site footer: responsive columns and accessible link lists. */
export async function PublicFooter() {
  const settings = await getSiteSettings();
  const contactEmail = settings.footerContactEmail.trim() || CONTACT_EMAIL;

  return (
    <footer className="mt-auto border-t border-white/15 bg-brand-navy text-text-on-inverse">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/ggi-logo.png"
              alt="Girls Global Initiative"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full bg-bg-surface"
            />
            <span className="font-display font-semibold">
              Girls Global Initiative
            </span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/80">
            Advancing the rights, dignity, health, wellbeing and education of
            girls in rural, remote and underserved communities.
          </p>
          <SocialLinks variant="onDark" />
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <nav aria-label="Explore">
            <p className="mb-3 font-semibold">Explore</p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center text-white/80 hover:text-brand-sky"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Support">
            <p className="mb-3 font-semibold">Support</p>
            <ul className="space-y-1">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={
                      link.href === "/get-involved/donate"
                        ? settings.ctaDonateUrl || link.href
                        : link.href === "/get-involved/volunteer"
                          ? settings.ctaVolunteerUrl || link.href
                          : link.href === "/partner"
                            ? settings.ctaPartnerUrl || link.href
                            : link.href
                    }
                    className="inline-flex min-h-10 items-center text-white/80 hover:text-brand-sky"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold">Questions? Say hello</p>
          <p className="text-white/80">
            <a
              href={`mailto:${contactEmail}`}
              className="hover:text-brand-sky"
            >
              {contactEmail}
            </a>
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/contact"
              className="inline-flex h-11 min-h-11 items-center justify-center rounded-lg bg-brand-magenta px-4 font-medium text-text-on-inverse hover:bg-brand-magenta/90"
            >
              Contact us
            </Link>
            <Link
              href="/#newsletter"
              className="inline-flex h-11 min-h-11 items-center justify-center rounded-lg border border-white/30 px-4 font-medium text-text-on-inverse hover:border-brand-sky hover:text-brand-sky"
            >
              Newsletter
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60 sm:px-6">
        © {new Date().getFullYear()} Girls Global Initiative. All rights
        reserved.
      </div>
    </footer>
  );
}
