import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { founderSpotlight } from "@/features/content/mock-home";

export default function TeamPage() {
  return (
    <PublicPageIntro
      eyebrow="Team"
      title="Meet the team"
      description="GGI’s public leadership and programme voices will be listed here from CMS-managed team profiles."
    >
      <div className="rounded-3xl border border-border-default bg-bg-surface p-6">
        <p className="font-display text-lg font-bold text-brand-navy">
          {founderSpotlight.name}
        </p>
        <p className="mt-1 text-sm text-text-muted">{founderSpotlight.role}</p>
        <p className="mt-4 text-sm text-text-muted">
          Additional team members will appear once profiles are published in the
          back-office. No placeholder names have been invented for this page.
        </p>
        <Link
          href="/founder"
          className="mt-6 inline-flex text-sm font-semibold text-brand-sky hover:underline"
        >
          Read the founder spotlight
        </Link>
      </div>
    </PublicPageIntro>
  );
}
