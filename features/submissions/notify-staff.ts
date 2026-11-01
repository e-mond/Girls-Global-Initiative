import { after } from "next/server";
import { staffSubmissionNotifyEmail } from "@/features/email/branded";
import { sendAcknowledgementEmail } from "@/features/submissions/email";
import { getSiteSettings } from "@/features/settings/service";
import type { SubmissionKind } from "@/features/submissions/schemas";

/** Resolve staff notify address: env override, then footer contact email. */
export async function resolveStaffNotifyEmail(): Promise<string | null> {
  const fromEnv = process.env.STAFF_NOTIFY_EMAIL?.trim();
  if (fromEnv) return fromEnv;
  const settings = await getSiteSettings();
  const footer = settings.footerContactEmail?.trim();
  return footer || null;
}

/**
 * Queue a non-blocking staff notification for a new public submission.
 * Failures are logged only — never block the submitter response.
 */
export function queueStaffSubmissionNotify(input: {
  kind: SubmissionKind;
  name: string;
  email: string;
  summary?: string;
}) {
  after(async () => {
    try {
      const to = await resolveStaffNotifyEmail();
      if (!to) return;
      const mail = staffSubmissionNotifyEmail(input);
      await sendAcknowledgementEmail({
        to,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });
    } catch (error) {
      console.error("[submissions] staff notify failed", error);
    }
  });
}
