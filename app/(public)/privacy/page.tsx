import Link from "next/link";
import {
  PolicyPage,
  PolicySection,
} from "@/components/layout/policy-page";
import { CONTACT_EMAIL } from "@/content/contact-details";
import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.privacy.title,
  description: PAGE_SEO.privacy.description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="This Privacy Policy explains how Girls Global Initiative (GGI) collects, uses, shares and protects personal information when you use this website."
    >
      <PolicySection title="Who we are">
        <p>
          Girls Global Initiative operates this website to share our work and to
          receive enquiries, applications, newsletter subscriptions and
          donations. Contact:{" "}
          <a
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="Information we collect through this website">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-brand-navy">Contact form:</strong> name,
            email, message and any other fields you submit.
          </li>
          <li>
            <strong className="text-brand-navy">Volunteer applications:</strong>{" "}
            details you provide in the volunteer form.
          </li>
          <li>
            <strong className="text-brand-navy">Partnership enquiries:</strong>{" "}
            details you provide in the partnership form.
          </li>
          <li>
            <strong className="text-brand-navy">Newsletter:</strong> email
            address (double opt-in confirmation before subscription is active).
          </li>
          <li>
            <strong className="text-brand-navy">Donations:</strong> donor name
            and email when provided; payment card data is handled by Paystack on
            their hosted checkout and is not stored by GGI. Direct-transfer
            notifications may include a transfer reference and optional note.
          </li>
          <li>
            <strong className="text-brand-navy">Staff administration:</strong>{" "}
            staff account details for authorised administrators and editors only.
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="How we use information">
        <p>
          We use submitted information to respond to your enquiry, process
          applications, send confirmed newsletter messages, acknowledge
          donations, improve our services, meet legal obligations, and operate
          the staff back-office securely.
        </p>
      </PolicySection>

      <PolicySection title="Information sharing">
        <p>
          GGI does not sell personal information collected through this website.
          Information may be shared with trusted service providers who help
          operate the platform (for example hosting, email delivery, payment
          processing or media storage) only as needed to provide those services.
        </p>
        <p>
          We may also share information where required by law, to protect
          people&apos;s safety and safeguarding interests, or with your consent.
          Where providers process data outside Ghana, they do so under their
          applicable terms and protections.
        </p>
      </PolicySection>

      <PolicySection title="Third-party services">
        <p>
          Depending on configuration, the platform may use Neon (database),
          SMTP email delivery, Paystack (donations), Cloudinary (media) and
          Cloudflare hosting. Those providers process data under their own
          terms when used.
        </p>
      </PolicySection>

      <PolicySection title="Cookies">
        <p>
          This website uses essential Auth.js cookies for staff sign-in (session,
          CSRF protection and post-login redirect). There is no marketing or
          analytics cookie programme in the current application. A consent banner
          is not shown for essential authentication cookies alone.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Session token — staff authentication (essential)</li>
          <li>CSRF token — Auth.js security (essential)</li>
          <li>Callback URL — post-login redirect (essential)</li>
        </ul>
      </PolicySection>

      <PolicySection title="Data security">
        <p>
          Technical measures on this website include staff authentication, role
          checks, input validation, signed Paystack webhooks and security
          headers. Access to staff tools is limited to authorised accounts.
        </p>
        <p>
          No website or transmission method can guarantee absolute security. We
          take reasonable steps to protect personal information and will act
          promptly if we become aware of a security incident affecting this
          website.
        </p>
      </PolicySection>

      <PolicySection title="Retention">
        <p>
          We keep personal information only for as long as needed for the purpose
          it was collected — for example to respond to an enquiry, manage a
          subscription, record a donation acknowledgement, or meet legal and
          accounting requirements — and then delete or anonymise it where
          practical.
        </p>
      </PolicySection>

      <PolicySection title="Your rights">
        <p>
          You may ask GGI to access, correct or delete personal information we
          hold about you, or to stop sending you newsletter messages (via the
          unsubscribe link or by contacting us). We will respond to reasonable
          requests as promptly as practical.
        </p>
        <p>
          Contact{" "}
          <a
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>{" "}
          to exercise these rights.
        </p>
      </PolicySection>

      <PolicySection title="Updates to this Privacy Policy">
        <p>
          GGI may update this Privacy Policy from time to time. When changes are
          published on this page, the “Last updated” date at the top will change.
          Continued use of the website after an update means you accept the
          revised policy.
        </p>
      </PolicySection>

      <PolicySection title="Related pages">
        <p>
          <Link
            href="/terms"
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
          >
            Terms of Use
          </Link>
          {" · "}
          <Link
            href="/accessibility"
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
          >
            Accessibility
          </Link>
          {" · "}
          <Link
            href="/contact"
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
          >
            Contact
          </Link>
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
