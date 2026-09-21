import nodemailer from "nodemailer";

/**
 * Best-effort SMTP send (SekoFund pattern).
 * Never throws to the caller — acknowledgement failure must not block saves.
 * Prefer providing both text and html for branded transactional mail.
 */
export async function sendAcknowledgementEmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !from) {
    return { sent: false, reason: "SMTP is not configured." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: user && pass ? { user, pass } : undefined,
    });

    await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });

    return { sent: true };
  } catch {
    return { sent: false, reason: "Email could not be sent." };
  }
}
