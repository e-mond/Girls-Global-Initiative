import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import type { SiteSettings } from "@/features/settings/schemas";

/** Fixed singleton id for the site settings row. */
export const SITE_SETTINGS_ID = "00000000-0000-4000-8000-000000000010";

const defaults: SiteSettings = {
  socialFacebook: "",
  socialInstagram: "",
  socialX: "",
  socialYoutube: "",
  socialLinkedin: "",
  footerContactEmail: "",
  seoDefaultTitle: "",
  seoDefaultDescription: "",
  ctaDonateUrl: "/get-involved/donate",
  ctaVolunteerUrl: "/get-involved/volunteer",
  ctaPartnerUrl: "/partner",
};

type Memory = { value: SiteSettings };

const globalStore = globalThis as typeof globalThis & {
  __ggiSiteSettings?: Memory;
};

function memory(): Memory {
  if (!globalStore.__ggiSiteSettings) {
    globalStore.__ggiSiteSettings = { value: { ...defaults } };
  }
  return globalStore.__ggiSiteSettings;
}

function serialize(row: {
  socialFacebook: string;
  socialInstagram: string;
  socialX: string;
  socialYoutube: string;
  socialLinkedin: string;
  footerContactEmail: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  ctaDonateUrl: string;
  ctaVolunteerUrl: string;
  ctaPartnerUrl: string;
}): SiteSettings {
  return {
    socialFacebook: row.socialFacebook,
    socialInstagram: row.socialInstagram,
    socialX: row.socialX,
    socialYoutube: row.socialYoutube,
    socialLinkedin: row.socialLinkedin,
    footerContactEmail: row.footerContactEmail,
    seoDefaultTitle: row.seoDefaultTitle,
    seoDefaultDescription: row.seoDefaultDescription,
    ctaDonateUrl: row.ctaDonateUrl,
    ctaVolunteerUrl: row.ctaVolunteerUrl,
    ctaPartnerUrl: row.ctaPartnerUrl,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = getDb();
  if (!db) return { ...memory().value };

  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1);

  if (!row) return { ...defaults };
  return serialize(row);
}

export async function upsertSiteSettings(
  input: SiteSettings,
  updatedById: string | null,
): Promise<SiteSettings> {
  const db = getDb();
  const now = new Date();

  if (!db) {
    memory().value = { ...input };
    return memory().value;
  }

  const [existing] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1);

  if (existing) {
    const [row] = await db
      .update(siteSettings)
      .set({
        ...input,
        updatedById,
        updatedAt: now,
      })
      .where(eq(siteSettings.id, SITE_SETTINGS_ID))
      .returning();
    return serialize(row);
  }

  const [row] = await db
    .insert(siteSettings)
    .values({
      id: SITE_SETTINGS_ID,
      ...input,
      updatedById,
      updatedAt: now,
    })
    .returning();

  return serialize(row);
}
