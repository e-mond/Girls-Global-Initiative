import { after } from "next/server";
import nodemailer from "nodemailer";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  /** Overrides SMTP_REPLY_TO / derived From mailbox when set. */
  replyTo?: string;
  /**
   * When set, adds List-Unsubscribe (+ List-Unsubscribe-Post) headers.
   * Required for newsletter / marketing-shaped mail under Gmail bulk rules.
   */
  listUnsubscribeUrl?: string;
};

/**
 * Queue SMTP after the HTTP response so Workers free CPU sooner (Error 1102).
 * Use on public request paths; keep await for admin flows that need send status.
 */
export function queueAcknowledgementEmail(
  input: SendEmailInput,
  onSettled?: (result: { sent: boolean; reason?: string }) => void | Promise<void>,
): void {
  after(() => {
    void sendAcknowledgementEmail(input)
      .then((result) => onSettled?.(result))
      .catch((error) => {
        console.error("[email] queued send failed", error);
      });
  });
}

function mailboxFromAddress(from: string): string | undefined {
  const angle = from.match(/<([^>]+)>/);
  if (angle?.[1]) return angle[1].trim();
  if (from.includes("@")) return from.trim();
  return undefined;
}

/**
 * Best-effort SMTP send (SekoFund pattern).
 * Never throws to the caller — acknowledgement failure must not block saves.
 * Prefer providing both text and html for branded transactional mail.
 */
export async function sendAcknowledgementEmail(
  input: SendEmailInput,
): Promise<{ sent: boolean; reason?: string }> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !from) {
    return { sent: false, reason: "SMTP is not configured." };
  }

  const replyTo =
    input.replyTo?.trim() ||
    process.env.SMTP_REPLY_TO?.trim() ||
    mailboxFromAddress(from);

  const headers: Record<string, string> = {};
  if (input.listUnsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${input.listUnsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: user && pass ? { user, pass } : undefined,
      connectionTimeout: 20_000,
      greetingTimeout: 20_000,
      socketTimeout: 30_000,
    });

    const info = await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    const rejected = Array.isArray(info.rejected) ? info.rejected : [];
    if (rejected.length > 0) {
      console.error("[email] SMTP rejected recipient(s)", rejected);
      return {
        sent: false,
        reason:
          "The mail server rejected this address. Check the email spelling and SMTP settings, then try again.",
      };
    }

    return { sent: true };
  } catch (error) {
    console.error("[email] SMTP send failed", error);
    return {
      sent: false,
      reason:
        "Email could not be sent. Check SMTP host, mailbox and app password, then try again.",
    };
  }
}
