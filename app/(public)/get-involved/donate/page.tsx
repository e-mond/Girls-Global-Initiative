import { PublicPageIntro } from "@/components/layout/public-page-intro";
import { DonationForm } from "@/components/donations/donation-form";

export default function DonatePage() {
  return (
    <PublicPageIntro
      eyebrow="Donate"
      title="Donate & support"
      description="Your gift helps Girls Global Initiative advance the rights, dignity, health and opportunity of girls in rural and underserved communities."
    >
      <DonationForm />
    </PublicPageIntro>
  );
}
