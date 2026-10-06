import Link from "next/link";
import {
  PolicyPage,
  PolicySection,
} from "@/components/layout/policy-page";
import { CONTACT_EMAIL } from "@/content/contact-details";
import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.terms.title,
  description: PAGE_SEO.terms.description,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Use"
      intro="These terms outline how visitors may use the Girls Global Initiative website. Official legal terms are not fully approved yet; sections that need confirmation are marked clearly."
    >
      <PolicySection title="Website use">
        <p>
          You may browse public pages for information about Girls Global
          Initiative and use published forms to contact us, apply, subscribe or
          donate. Do not misuse the site, attempt unauthorised access to staff
          areas, or disrupt services.
        </p>
      </PolicySection>

      <PolicySection title="Acceptable use" awaiting>
        <p>
          Detailed acceptable-use rules are awaiting official GGI confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Intellectual property" awaiting>
        <p>
          Ownership of GGI branding, text and media, and permissions for reuse,
          are awaiting official GGI confirmation. Do not copy site materials for
          commercial use without permission.
        </p>
      </PolicySection>

      <PolicySection title="User submissions">
        <p>
          When you submit forms, you confirm that the information is accurate to
          the best of your knowledge and that you are authorised to provide it.
          See the{" "}
          <Link
            href="/privacy"
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          for how submissions are handled technically.
        </p>
      </PolicySection>

      <PolicySection title="Donations">
        <p>
          Online card and mobile-money payments are processed by Paystack.
          Direct bank transfers use organisation account details when published.
          Donation acknowledgements are transactional; tax or gift-aid treatment
          is awaiting official GGI confirmation where applicable.
        </p>
      </PolicySection>

      <PolicySection title="External links">
        <p>
          The site may link to third-party websites (including social networks
          and Paystack). GGI is not responsible for external content or
          practices.
        </p>
      </PolicySection>

      <PolicySection title="Availability">
        <p>
          We aim to keep the website available but do not guarantee
          uninterrupted access. Features may change as the platform develops.
        </p>
      </PolicySection>

      <PolicySection title="Limitation of liability" awaiting>
        <p>
          Limitation of liability wording is awaiting official GGI confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Governing law" awaiting>
        <p>
          Governing law and jurisdiction are awaiting official GGI confirmation.
          Do not treat any placeholder as a chosen jurisdiction.
        </p>
      </PolicySection>

      <PolicySection title="Contact">
        <p>
          Questions about these terms:{" "}
          <a
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
