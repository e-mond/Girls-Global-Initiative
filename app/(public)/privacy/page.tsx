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
      intro="This page explains how personal information may be handled when you use the Girls Global Initiative (GGI) website. Where organisational or legal details are not yet confirmed, sections are clearly marked."
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

      <PolicySection title="How we use information" awaiting>
        <p>
          Submitted information is used to respond to your enquiry, process
          applications, send confirmed newsletter messages, acknowledge
          donations, or operate the staff back-office. Additional purposes and
          legal bases are awaiting official GGI confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Information sharing" awaiting>
        <p>
          GGI does not sell personal information collected through this website.
          Information may be shared with service providers who help operate the
          platform (for example hosting, email delivery, payment processing or
          media storage) only as needed to provide those services.
        </p>
        <p>
          Broader sharing rules — including partners, regulators, safeguarding
          disclosures and any international transfers — are awaiting official
          GGI confirmation.
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
          No website or transmission method can guarantee absolute security.
          Organisational security policies, breach-notification procedures and
          staff handling rules are awaiting official GGI confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Retention" awaiting>
        <p>
          Retention periods for submissions, donation records, newsletter lists
          and audit logs are awaiting official GGI confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Your rights" awaiting>
        <p>
          How to access, correct or delete personal information held by GGI —
          including response times and any rights under applicable Ghanaian or
          other law — is awaiting official GGI confirmation. You may contact{" "}
          <a
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>{" "}
          in the meantime.
        </p>
      </PolicySection>

      <PolicySection title="Updates to this Privacy Policy" awaiting>
        <p>
          GGI may update this Privacy Policy from time to time. When changes are
          published on this page, the “Last updated” date at the top will change.
          Material changes and how visitors will be notified are awaiting
          official GGI confirmation.
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
