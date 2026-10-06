import { z } from "zod";

export const donationFrequencySchema = z.enum(["one_time", "monthly_intent"]);
export type DonationFrequency = z.infer<typeof donationFrequencySchema>;

export const donationStatusSchema = z.enum([
  "pending",
  "pending_verification",
  "success",
  "failed",
  "abandoned",
  "rejected",
]);
export type DonationStatus = z.infer<typeof donationStatusSchema>;

export const donationMethodSchema = z.enum(["paystack", "direct"]);
export type DonationMethod = z.infer<typeof donationMethodSchema>;

export const PRESET_AMOUNTS_GHS = [20, 50, 100, 200] as const;

export const initializeDonationSchema = z
  .object({
    amountGhs: z.number().positive().max(1_000_000),
    frequency: donationFrequencySchema,
    donorName: z.string().trim().max(120).optional().or(z.literal("")),
    donorEmail: z.string().trim().email().max(200).optional().or(z.literal("")),
    isAnonymous: z.boolean().optional().default(false),
  })
  .superRefine((value, ctx) => {
    if (!value.isAnonymous && !value.donorEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required unless donating anonymously.",
        path: ["donorEmail"],
      });
    }
  });

export const manualDonationNotifySchema = z.object({
  amountGhs: z.number().positive().max(1_000_000),
  donorName: z.string().trim().max(120).optional().or(z.literal("")),
  donorEmail: z.string().trim().email().max(200).optional().or(z.literal("")),
  transferReference: z.string().trim().max(120).optional().or(z.literal("")),
  donorNote: z.string().trim().max(1000).optional().or(z.literal("")),
  transferredOn: z.string().trim().max(40).optional().or(z.literal("")),
});

export const adminDonationActionSchema = z.object({
  id: z.string().uuid(),
  action: z.enum(["verify", "reject", "resend_email"]),
});

export const STATUS_LABELS: Record<DonationStatus, string> = {
  pending: "Pending",
  pending_verification: "Pending verification",
  success: "Successful",
  failed: "Failed",
  abandoned: "Abandoned",
  rejected: "Rejected",
};

export const METHOD_LABELS: Record<DonationMethod, string> = {
  paystack: "Paystack",
  direct: "Direct transfer",
};

export const FREQUENCY_LABELS: Record<DonationFrequency, string> = {
  one_time: "One-time",
  monthly_intent: "Monthly (intent)",
};
