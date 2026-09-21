import { test, expect } from "@playwright/test";
import {
  donationThanksEmail,
  newsletterConfirmEmail,
  passwordResetEmail,
  renderBrandedEmail,
  submissionAckEmail,
} from "../../features/email/branded";

test.describe("branded transactional email", () => {
  test("wraps content in GGI navy header with logo and CTA colours", () => {
    const html = renderBrandedEmail({
      title: "Test title",
      bodyHtml: "<p>Hello</p>",
      preheader: "Hidden preview",
    });

    expect(html).toContain("#041b4b");
    expect(html).toContain("#e00286");
    expect(html).toContain("/brand/ggi-logo.png");
    expect(html).toContain("Girls Global Initiative");
    expect(html).toContain("Test title");
    expect(html).toContain("Hidden preview");
  });

  test("newsletter confirm includes action links", () => {
    const mail = newsletterConfirmEmail({
      confirmUrl: "https://example.com/newsletter/confirm?token=abc",
      unsubscribeUrl: "https://example.com/newsletter/unsubscribe?token=xyz",
    });

    expect(mail.subject.toLowerCase()).toContain("confirm");
    expect(mail.html).toContain("Confirm subscription");
    expect(mail.html).toContain("https://example.com/newsletter/confirm?token=abc");
    expect(mail.text).toContain("https://example.com/newsletter/confirm?token=abc");
    expect(mail.html).toContain("#e00286");
  });

  test("password reset includes the reset CTA", () => {
    const mail = passwordResetEmail({
      name: "Ada",
      resetUrl: "https://example.com/admin/reset-password?token=tok",
    });

    expect(mail.html).toContain("Hello Ada");
    expect(mail.html).toContain("Choose a new password");
    expect(mail.html).toContain("https://example.com/admin/reset-password?token=tok");
  });

  test("submission and donation helpers produce branded html", () => {
    const ack = submissionAckEmail({ kind: "volunteer", name: "Kojo" });
    expect(ack.html).toContain("Application received");
    expect(ack.html).toContain("/brand/ggi-logo.png");

    const thanks = donationThanksEmail({
      donorName: "Ama",
      amountLabel: "GHS 50.00",
      reference: "ggi_test_1",
    });
    expect(thanks.html).toContain("Thank you for your gift");
    expect(thanks.html).toContain("ggi_test_1");
    expect(thanks.text).toContain("GHS 50.00");
  });
});
