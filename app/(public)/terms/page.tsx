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
      intro="These Terms of Use set out the rules for using the Girls Global Initiative website."
    >
      <PolicySection title="Acceptance of these terms">
        <p>
          By accessing or using this website, you agree to these Terms of Use
          and to our{" "}
          <Link
            href="/privacy"
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          . If you do not agree, please do not use the site.
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

      <PolicySection title="Acceptable use">
        <p>
          You agree not to use this website to post or transmit harmful, abusive,
          unlawful or misleading content; to harass others; to attempt to breach
          security; to scrape or overload the service in a way that harms
          availability; or to use the site in any way that puts girls, families
          or communities at risk. GGI may restrict access where these rules are
          breached.
        </p>
      </PolicySection>

      <PolicySection title="Intellectual property">
        <p>
          Unless otherwise stated, Girls Global Initiative owns or controls the
          branding, text, images and other materials on this website. You may
          view and share pages for personal, non-commercial purposes with
          attribution. You may not copy, adapt or use site materials for
          commercial purposes without prior written permission from GGI.
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
          for how submissions are handled.
        </p>
      </PolicySection>

      <PolicySection title="Donations">
        <p>
          Online card and mobile-money payments are processed by Paystack.
          Direct bank transfers use organisation account details when published.
          Donation acknowledgements are transactional. Tax treatment of gifts,
          where applicable, follows the rules of the relevant authority and any
          additional guidance GGI publishes.
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

      <PolicySection title="Disclaimer">
        <p>
          Website content is provided for general information about GGI&apos;s
          work. It is not professional advice (including legal, medical or
          financial advice). You should seek appropriate advice for your own
          circumstances.
        </p>
      </PolicySection>

      <PolicySection title="Limitation of liability">
        <p>
          To the fullest extent permitted by applicable law, Girls Global
          Initiative is not liable for indirect, incidental or consequential
          loss arising from your use of, or inability to use, this website. Nothing
          in these terms excludes liability that cannot be excluded under the
          laws of Ghana.
        </p>
      </PolicySection>

      <PolicySection title="Changes to these terms">
        <p>
          GGI may update these Terms of Use from time to time. The “Last
          updated” date at the top of this page will change when revisions are
          published. Continued use of the website after an update means you
          accept the revised terms.
        </p>
      </PolicySection>

      <PolicySection title="Governing law">
        <p>
          These Terms of Use are governed by the laws of{" "}
          <strong className="text-brand-navy">Ghana</strong>. Any dispute arising
          from these terms or use of this website shall be subject to the
          courts of Ghana, unless mandatory law requires otherwise.
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
