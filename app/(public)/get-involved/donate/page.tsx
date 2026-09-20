import Link from "next/link";
import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { ContentSection } from "@/components/layout/content-section";
import { DonationForm } from "@/components/donations/donation-form";
import { TAGLINE } from "@/content/site-copy";

export default function DonatePage() {
  return (
    <>
      <PublicPageIntro
        eyebrow="Donate"
        title="Donate & support"
        description={`${TAGLINE} Your gift helps Girls Global Initiative advance the rights, dignity, health and opportunity of girls in rural and underserved communities.`}
      />

      <ContentSection
        tone="navy"
        narrow
        title="Give toward education, health, mentorship and rural girl empowerment."
        description="One-time gifts process through Paystack when configured. You can also use organisation transfer details on this page. Monthly giving is captured as interest until recurring billing launches."
      />

      <ContentSection tone="base" narrow>
        <DonationForm />
        <p className="mt-6 text-sm text-text-muted">
          Want to give time instead?{" "}
          <Link
            href="/get-involved/volunteer"
            className="font-semibold text-brand-sky hover:underline"
          >
            Volunteer or mentor
          </Link>
          .
        </p>
      </ContentSection>
    </>
  );
}
