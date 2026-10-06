import Link from "next/link";
import {
  PolicyPage,
  PolicySection,
} from "@/components/layout/policy-page";
import { CONTACT_EMAIL } from "@/content/contact-details";
import { PAGE_SEO } from "@/content/page-seo";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.accessibility.title,
  description: PAGE_SEO.accessibility.description,
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <PolicyPage
      title="Accessibility"
      intro="Girls Global Initiative is committed to making this website accessible and usable by as many people as possible. The website is being developed with WCAG 2.2 AA accessibility principles in mind."
    >
      <PolicySection title="Our commitment">
        <p>
          We aim to support keyboard use, screen readers, clear language,
          visible focus, meaningful labels, and respectful colour contrast
          within the GGI brand. We do not claim that this website is fully
          accessible or that every page has completed a formal audit.
        </p>
      </PolicySection>

      <PolicySection title="Standards we target">
        <p>
          Development targets{" "}
          <strong className="text-brand-navy">WCAG 2.2 Level AA</strong>{" "}
          principles. Automated checks and manual keyboard testing support this
          work; they do not replace a comprehensive evaluation.
        </p>
      </PolicySection>

      <PolicySection title="Supported ways to use the site">
        <ul className="list-disc space-y-2 pl-5">
          <li>Keyboard navigation (Tab, Enter/Space, Escape for menus)</li>
          <li>Screen readers via semantic headings, landmarks and labels</li>
          <li>Mobile, tablet and desktop layouts</li>
          <li>Browser zoom and text resizing where the layout allows</li>
          <li>
            Reduced motion preferences (`prefers-reduced-motion`) for decorative
            animation
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Known limitations" awaiting>
        <p>
          Some content images, complex admin tables, and third-party checkout
          pages (Paystack) may present residual barriers. A published list of
          known limitations and remediation timelines is awaiting official GGI
          confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Updates to this statement" awaiting>
        <p>
          This accessibility statement may be updated as the website improves.
          The “Last updated” date at the top will change when revisions are
          published. Formal review cadence is awaiting official GGI confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Report an accessibility barrier">
        <p>
          If you experience a barrier, contact us with the page URL, what you
          were trying to do, and the assistive technology or browser you use if
          you can share it:
        </p>
        <p className="mt-3">
          <a
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
            href={`mailto:${CONTACT_EMAIL}?subject=Accessibility%20barrier`}
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-3">
          Or use the{" "}
          <Link
            href="/contact"
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
          >
            contact form
          </Link>
          .
        </p>
      </PolicySection>

      <PolicySection title="Related">
        <p>
          <Link
            href="/privacy"
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          {" · "}
          <Link
            href="/terms"
            className="font-medium text-brand-sky underline-offset-2 hover:underline"
          >
            Terms of Use
          </Link>
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
