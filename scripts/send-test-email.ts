/**
 * One-shot SMTP connectivity test. Usage:
 *   npx tsx --env-file=.env.local scripts/send-test-email.ts
 * Optional: TEST_EMAIL_TO=you@example.com
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config();

import nodemailer from "nodemailer";
import { staffInviteEmail } from "../features/email/branded";

async function main() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  const to = process.env.TEST_EMAIL_TO || "e_ander.son@yahoo.com";

  console.log(`SMTP_HOST=${host}`);
  console.log(`SMTP_PORT=${port}`);
  console.log(`SMTP_USER=${user}`);
  console.log(`SMTP_FROM=${from}`);
  console.log(`TO=${to}`);
  console.log(`SMTP_PASS set=${Boolean(pass)}`);

  if (!host || !from) {
    console.error("SMTP_HOST and SMTP_FROM are required.");
    process.exit(1);
  }

  const mail = staffInviteEmail({
    name: "GGI Admin",
    inviteUrl:
      "https://girlsglobalinitiative.org/admin/reset-password?token=test&invite=1",
  });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: user && pass ? { user, pass } : undefined,
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: `[GGI test] ${mail.subject}`,
      text: mail.text,
      html: mail.html,
    });
    console.log(`SENT ok messageId=${info.messageId}`);
  } catch (err) {
    console.error(
      `SEND FAILED: ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(1);
  }
}

main();
