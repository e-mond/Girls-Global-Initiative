import { SOCIAL_LINKS, type SocialPlatformId } from "@/content/social-links";
import { cn } from "@/lib/utils";

function BrandIcon({
  id,
  className,
}: {
  id: SocialPlatformId;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
  };

  switch (id) {
    case "instagram":
      return (
        <svg {...common}>
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M16.6 5.82A4.43 4.43 0 0 1 15.6 3h-3.17v12.33a2.59 2.59 0 1 1-2.59-2.5c.2 0 .39.02.58.05V9.6a5.72 5.72 0 0 0-.58-.03A5.67 5.67 0 1 0 14.9 15.3V9.1a7.86 7.86 0 0 0 4.37 1.32V7.27a4.45 4.45 0 0 1-2.67-1.45" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.09 16.06 2 14.89 2 12.3 2 10.5 3.7 10.5 6.61V9.5H8v4h2.5V22h3.5z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Shared social icon group — Footer and Contact must use this component.
 */
export function SocialLinks({
  variant = "onLight",
  className,
}: {
  variant?: "onLight" | "onDark";
  className?: string;
}) {
  const linkClass =
    variant === "onDark"
      ? "text-white/80 hover:text-brand-sky focus-visible:outline-brand-sky"
      : "text-brand-navy/80 hover:text-brand-sky focus-visible:outline-brand-sky";

  return (
    <ul
      className={cn("flex flex-wrap items-center gap-2", className)}
      aria-label="Social media"
    >
      {SOCIAL_LINKS.map((link) => (
        <li key={link.id}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.accessibleName}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              linkClass,
            )}
          >
            <BrandIcon id={link.id} className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
