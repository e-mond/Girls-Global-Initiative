import { newsletterBroadcastEmail } from "@/features/email/branded";
import { emailSiteOrigin } from "@/features/email/site-origin";
import { sendAcknowledgementEmail } from "@/features/submissions/email";
import { listSubscribers } from "@/features/newsletter/service";

/** Worker-safe batch size for in-app newsletter sends. */
export const BROADCAST_BATCH_SIZE = 20;

export async function sendNewsletterBroadcastBatch(input: {
  subject: string;
  title: string;
  body: string;
  offset?: number;
  limit?: number;
}): Promise<{
  attempted: number;
  sent: number;
  failed: number;
  nextOffset: number;
  remaining: number;
  totalSubscribed: number;
}> {
  const subscribed = (await listSubscribers()).filter(
    (item) => item.status === "subscribed",
  );
  const offset = Math.max(0, input.offset ?? 0);
  const limit = Math.min(
    BROADCAST_BATCH_SIZE,
    Math.max(1, input.limit ?? BROADCAST_BATCH_SIZE),
  );
  const batch = subscribed.slice(offset, offset + limit);

  let sent = 0;
  let failed = 0;

  for (const subscriber of batch) {
    const unsubscribeUrl = `${emailSiteOrigin()}/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`;
    const mail = newsletterBroadcastEmail({
      subject: input.subject,
      title: input.title,
      body: input.body,
      unsubscribeUrl,
    });
    const result = await sendAcknowledgementEmail({
      to: subscriber.email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      listUnsubscribeUrl: unsubscribeUrl,
    });
    if (result.sent) sent += 1;
    else failed += 1;
  }

  const nextOffset = offset + batch.length;
  return {
    attempted: batch.length,
    sent,
    failed,
    nextOffset,
    remaining: Math.max(0, subscribed.length - nextOffset),
    totalSubscribed: subscribed.length,
  };
}
