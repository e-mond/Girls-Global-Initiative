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
      intro="These terms outline how visitors may use the Girls Global Initiative website. Several sections still need official organisational or legal confirmation and are marked clearly."
    >
      <PolicySection title="Acceptance of these terms" awaiting>
        <p>
          By accessing or using this website, you agree to these Terms of Use
          and to our{" "}
          <Link
            href="/privacy"
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          . If you do not agree, please do not use the site. Final acceptance
          wording is awaiting official GGI confirmation.
        </p>
      </PolicySection>

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
          Detailed acceptable-use rules — including prohibited content, scraping,
          automated abuse and safeguarding expectations — are awaiting official
          GGI confirmation.
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
          Donation acknowledgements are transactional; tax treatment and related
          donation terms are awaiting official GGI confirmation where applicable.
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

      <PolicySection title="Disclaimer" awaiting>
        <p>
          Website content is provided for general information about GGI’s work.
          It is not professional advice (including legal, medical or financial
          advice). Full disclaimer wording is awaiting official GGI confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Limitation of liability" awaiting>
        <p>
          To the fullest extent permitted by applicable law, detailed limits on
          GGI’s liability for use of this website — including indirect or
          consequential loss — are awaiting official GGI confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Changes to these terms" awaiting>
        <p>
          GGI may update these Terms of Use from time to time. The “Last
          updated” date at the top of this page will change when revisions are
          published. How material changes are communicated is awaiting official
          GGI confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Governing law">
        <p>
          These Terms of Use are intended to be governed by the laws of{" "}
          <strong className="text-brand-navy">Ghana</strong>, as confirmed for
          this website.
        </p>
        <p className="rounded-lg bg-bg-sky/40 px-3 py-2 text-sm text-brand-navy">
          Awaiting official GGI confirmation — venue, dispute-resolution process
          and any additional jurisdictional wording still need organisational or
          legal approval.
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
