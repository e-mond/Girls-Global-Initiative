import { z } from "zod";
import { staffRoleSchema } from "@/features/governance/rbac";
import { CONTACT_EMAIL } from "@/content/contact-details";
import { SOCIAL_HREFS } from "@/content/social-links";

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
  socialTiktok: z.string().trim().max(300).optional().default(""),
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

/** Defaults aligned with content-reference canonical profiles. */
export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  socialFacebook: SOCIAL_HREFS.facebook,
  socialInstagram: SOCIAL_HREFS.instagram,
  socialTiktok: SOCIAL_HREFS.tiktok,
  socialLinkedin: SOCIAL_HREFS.linkedin,
  footerContactEmail: CONTACT_EMAIL,
  seoDefaultTitle: "",
  seoDefaultDescription: "",
  ctaDonateUrl: "/get-involved/donate",
  ctaVolunteerUrl: "/get-involved/volunteer",
  ctaPartnerUrl: "/partner",
};
