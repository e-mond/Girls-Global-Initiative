import { test, expect } from "@playwright/test";
import { sendAcknowledgementEmail } from "../../features/submissions/email";

test.describe("SMTP send helper headers", () => {
  test("accepts listUnsubscribeUrl without throwing when SMTP unset", async () => {
    const prevHost = process.env.SMTP_HOST;
    const prevFrom = process.env.SMTP_FROM;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_FROM;

    const result = await sendAcknowledgementEmail({
      to: "reader@example.com",
      subject: "Test",
      text: "Hello",
      listUnsubscribeUrl: "https://example.com/newsletter/unsubscribe?token=abc",
    });

    expect(result.sent).toBe(false);
    expect(result.reason).toMatch(/SMTP/i);

    if (prevHost !== undefined) process.env.SMTP_HOST = prevHost;
    else delete process.env.SMTP_HOST;
    if (prevFrom !== undefined) process.env.SMTP_FROM = prevFrom;
    else delete process.env.SMTP_FROM;
  });
});
