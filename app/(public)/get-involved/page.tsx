import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { getInvolvedCards } from "@/features/content/mock-home";

export default function GetInvolvedPage() {
  return (
    <PublicPageIntro
      eyebrow="Get involved"
      title="There's a place for you in her story."
      description="Choose how you want to support girls — donate, volunteer, or raise your voice."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {getInvolvedCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl border border-border-default bg-bg-surface p-5 hover:border-brand-sky"
          >
            <p className="font-display text-lg font-bold text-brand-navy">
              {card.title}
            </p>
            <p className="mt-2 text-sm text-text-muted">{card.body}</p>
            <p className="mt-4 text-sm font-semibold text-brand-magenta">
              {card.cta}
            </p>
          </Link>
        ))}
      </div>
    </PublicPageIntro>
  );
}
