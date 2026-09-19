import { z } from "zod";

export const submissionStatusSchema = z.enum([
  "new",
  "in_review",
  "accepted",
  "declined",
]);
export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;

export const submissionKindSchema = z.enum([
  "volunteer",
  "partnership",
  "contact",
]);
export type SubmissionKind = z.infer<typeof submissionKindSchema>;

export const volunteerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  interestArea: z.string().trim().min(2).max(120),
  skills: z.string().trim().min(2).max(1000),
  availability: z.string().trim().min(2).max(500),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const partnershipSchema = z.object({
  requesterName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  roleTitle: z.string().trim().min(2).max(120),
  organisation: z.string().trim().min(2).max(200),
  location: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(3000),
});

export const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(3000),
});

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: "New",
  in_review: "In review",
  accepted: "Accepted",
  declined: "Declined",
};
