import { staffAccountChangeEmail } from "@/features/email/branded";
import { sendAcknowledgementEmail } from "@/features/submissions/email";
import { STAFF_ROLE_GUIDE, type StaffRole } from "@/features/governance/rbac";

export type StaffAccountChangeKind =
  | "role_changed"
  | "disabled"
  | "reenabled";

/** Email the affected staff member about a role or access change. */
export async function notifyStaffAccountChange(input: {
  toEmail: string;
  toName: string;
  actorName: string;
  kind: StaffAccountChangeKind;
  role?: StaffRole;
}): Promise<{ sent: boolean; reason?: string }> {
  const mail = staffAccountChangeEmail({
    name: input.toName,
    actorName: input.actorName,
    kind: input.kind,
    roleLabel: input.role ? STAFF_ROLE_GUIDE[input.role].label : undefined,
  });

  return sendAcknowledgementEmail({
    to: input.toEmail,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
}
