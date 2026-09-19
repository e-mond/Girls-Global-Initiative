import { z } from "zod";

export const subscriberStatusSchema = z.enum([
  "pending",
  "subscribed",
  "unsubscribed",
]);
export type SubscriberStatus = z.infer<typeof subscriberStatusSchema>;

export const subscribeSchema = z.object({
  email: z.string().trim().email().max(200),
});

export const adminSubscriberSchema = z.object({
  email: z.string().trim().email().max(200),
  status: subscriberStatusSchema.optional().default("subscribed"),
});

export const STATUS_LABELS: Record<SubscriberStatus, string> = {
  pending: "Pending confirmation",
  subscribed: "Subscribed",
  unsubscribed: "Unsubscribed",
};
