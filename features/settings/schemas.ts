import { z } from "zod";
import { staffRoleSchema } from "@/features/governance/rbac";

export const createStaffUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  role: staffRoleSchema,
  password: z.string().min(8).max(200),
});

export const updateStaffUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(120).optional(),
  role: staffRoleSchema.optional(),
  password: z.string().min(8).max(200).optional(),
});

export const siteSettingsSchema = z.object({
  socialFacebook: z.string().trim().max(300).optional().default(""),
  socialInstagram: z.string().trim().max(300).optional().default(""),
  socialX: z.string().trim().max(300).optional().default(""),
  socialYoutube: z.string().trim().max(300).optional().default(""),
  socialLinkedin: z.string().trim().max(300).optional().default(""),
  footerContactEmail: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default("")
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Enter a valid contact email or leave blank.",
    }),
  seoDefaultTitle: z.string().trim().max(120).optional().default(""),
  seoDefaultDescription: z.string().trim().max(300).optional().default(""),
  ctaDonateUrl: z.string().trim().max(300).optional().default("/get-involved/donate"),
  ctaVolunteerUrl: z
    .string()
    .trim()
    .max(300)
    .optional()
    .default("/get-involved/volunteer"),
  ctaPartnerUrl: z.string().trim().max(300).optional().default("/partner"),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
