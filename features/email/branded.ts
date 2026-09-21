import { emailSiteOrigin } from "@/features/email/site-origin";

export type BrandedEmailContent = {
  subject: string;
  text: string;
  html: string;
  preheader?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphHtml(text: string) {
  return text
    .split(/\n\n+/)
    .map((block) => {
      const withBreaks = escapeHtml(block).replace(/\n/g, "<br />");
      return `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#334155;">${withBreaks}</p>`;
    })
    .join("");
}

function ctaButton(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
  <tr>
    <td style="border-radius:12px;background:#e00286;">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">
        ${escapeHtml(label)}
      </a>
    </td>
  </tr>
</table>`;
}

/**
 * Wraps body HTML in a GGI-branded transactional layout (navy / magenta / cream).
 * Uses table layout for broad email-client compatibility.
 */
export function renderBrandedEmail(input: {
  title: string;
  bodyHtml: string;
  preheader?: string;
  footerNote?: string;
}): string {
  const origin = emailSiteOrigin();
  const logoUrl = `${origin}/brand/ggi-logo.png`;
  const preheader = input.preheader ?? "";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e8e2d9;">
          <tr>
            <td style="background:#041b4b;padding:28px 28px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="52" valign="middle">
                    <img src="${logoUrl}" width="44" height="44" alt="Girls Global Initiative" style="display:block;border-radius:999px;background:#041b4b;" />
                  </td>
                  <td valign="middle" style="padding-left:12px;">
                    <p style="margin:0;font-size:16px;font-weight:700;color:#ffffff;font-family:Georgia,'Times New Roman',serif;">Girls Global Initiative</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#a8c7e8;">Rights · Health · Potential</p>
                  </td>
                </tr>
              </table>
              <p style="margin:22px 0 0;font-size:22px;line-height:1.3;font-weight:700;color:#ffffff;font-family:Georgia,'Times New Roman',serif;">${escapeHtml(input.title)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${input.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background:#f7f4ef;padding:20px 28px;border-top:1px solid #e8e2d9;">
              <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#64748b;">
                ${escapeHtml(input.footerNote ?? "Girls Global Initiative — advancing the rights, dignity, health, wellbeing and potential of girls.")}
              </p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                <a href="${origin}" style="color:#00b0f2;text-decoration:none;">Visit our website</a>
                &nbsp;·&nbsp;
                <a href="${origin}/contact" style="color:#00b0f2;text-decoration:none;">Contact</a>
                &nbsp;·&nbsp;
                <a href="${origin}/get-involved" style="color:#e00286;text-decoration:none;">Get involved</a>
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#94a3b8;">© ${year} Girls Global Initiative</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function brandedMessage(input: {
  subject: string;
  title: string;
  greeting: string;
  paragraphs: string[];
  cta?: { href: string; label: string };
  secondaryLinks?: { href: string; label: string }[];
  preheader?: string;
  footerNote?: string;
}): BrandedEmailContent {
  const textParts = [
    input.greeting,
    "",
    ...input.paragraphs,
  ];
  if (input.cta) {
    textParts.push("", `${input.cta.label}: ${input.cta.href}`);
  }
  if (input.secondaryLinks?.length) {
    for (const link of input.secondaryLinks) {
      textParts.push(`${link.label}: ${link.href}`);
    }
  }
  textParts.push("", "Girls Global Initiative");

  const bodyHtml = [
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#041b4b;font-weight:600;">${escapeHtml(input.greeting)}</p>`,
    paragraphHtml(input.paragraphs.join("\n\n")),
    input.cta ? ctaButton(input.cta.href, input.cta.label) : "",
    input.secondaryLinks?.length
      ? `<p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#64748b;">${input.secondaryLinks
          .map(
            (link) =>
              `<a href="${escapeHtml(link.href)}" style="color:#00b0f2;text-decoration:none;font-weight:600;">${escapeHtml(link.label)}</a>`,
          )
          .join("&nbsp;&nbsp;·&nbsp;&nbsp;")}</p>`
      : "",
  ].join("");

  return {
    subject: input.subject,
    text: textParts.join("\n"),
    html: renderBrandedEmail({
      title: input.title,
      bodyHtml,
      preheader: input.preheader,
      footerNote: input.footerNote,
    }),
  };
}

export function newsletterConfirmEmail(input: {
  confirmUrl: string;
  unsubscribeUrl: string;
}): BrandedEmailContent {
  return brandedMessage({
    subject: "Confirm your GGI newsletter subscription",
    title: "Confirm your subscription",
    greeting: "Hello,",
    paragraphs: [
      "Please confirm your subscription to Letters for her future — monthly updates from Girls Global Initiative.",
      "If you did not request this, you can ignore this email.",
    ],
    cta: { href: input.confirmUrl, label: "Confirm subscription" },
    secondaryLinks: [
      { href: input.unsubscribeUrl, label: "Unsubscribe" },
      { href: `${emailSiteOrigin()}/`, label: "Visit GGI" },
    ],
    preheader: "Confirm your Letters for her future subscription.",
  });
}

export function passwordResetEmail(input: {
  name: string;
  resetUrl: string;
}): BrandedEmailContent {
  return brandedMessage({
    subject: "Reset your GGI staff password",
    title: "Reset your password",
    greeting: `Hello ${input.name},`,
    paragraphs: [
      "We received a request to reset your Girls Global Initiative staff password.",
      "This link expires in one hour. If you did not request a reset, you can ignore this email.",
    ],
    cta: { href: input.resetUrl, label: "Choose a new password" },
    secondaryLinks: [
      { href: `${emailSiteOrigin()}/admin/login`, label: "Staff sign in" },
    ],
    preheader: "Reset your GGI staff password within one hour.",
  });
}

export function submissionAckEmail(input: {
  kind: "volunteer" | "partnership" | "contact";
  name: string;
}): BrandedEmailContent {
  const copy = {
    volunteer: {
      subject: "We received your GGI volunteer application",
      title: "Application received",
      body: "Thank you for offering your time and skills. Our team will review your volunteer application and follow up when we can.",
    },
    partnership: {
      subject: "We received your GGI partnership request",
      title: "Partnership request received",
      body: "Thank you for reaching out about partnering with Girls Global Initiative. Our team will review your request and follow up.",
    },
    contact: {
      subject: "We received your message to GGI",
      title: "Message received",
      body: "Thank you for writing to Girls Global Initiative. Our team has received your message and will respond when we can.",
    },
  }[input.kind];

  return brandedMessage({
    subject: copy.subject,
    title: copy.title,
    greeting: `Hello ${input.name},`,
    paragraphs: [copy.body],
    cta: {
      href: `${emailSiteOrigin()}/our-story`,
      label: "Learn our story",
    },
    secondaryLinks: [
      { href: `${emailSiteOrigin()}/get-involved`, label: "Get involved" },
      { href: `${emailSiteOrigin()}/contact`, label: "Contact" },
    ],
    preheader: copy.title,
  });
}

export function donationThanksEmail(input: {
  donorName: string | null;
  amountLabel: string;
  reference: string;
}): BrandedEmailContent {
  const greeting = input.donorName ? `Hello ${input.donorName},` : "Hello,";
  return brandedMessage({
    subject: "Thank you for supporting Girls Global Initiative",
    title: "Thank you for your gift",
    greeting,
    paragraphs: [
      `Thank you for supporting Girls Global Initiative with ${input.amountLabel}. Your gift helps girls in rural and underserved communities.`,
      `Reference: ${input.reference}`,
    ],
    cta: {
      href: `${emailSiteOrigin()}/our-story`,
      label: "See why GGI exists",
    },
    secondaryLinks: [
      { href: `${emailSiteOrigin()}/get-involved`, label: "Stay involved" },
    ],
    preheader: "Thank you for supporting girls with GGI.",
  });
}

export function monthlyIntentEmail(input: {
  donorName: string | null;
  amountLabel: string;
}): BrandedEmailContent {
  const greeting = input.donorName ? `Hello ${input.donorName},` : "Hello,";
  return brandedMessage({
    subject: "We received your monthly giving interest",
    title: "Monthly giving interest noted",
    greeting,
    paragraphs: [
      `Thank you for sharing interest in monthly giving of ${input.amountLabel}. Recurring billing launches in a later phase. Our team will follow up.`,
    ],
    cta: {
      href: `${emailSiteOrigin()}/get-involved/donate`,
      label: "Visit donate page",
    },
    preheader: "Thank you for your interest in monthly giving.",
  });
}
