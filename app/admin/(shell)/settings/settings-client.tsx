"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SITE_SETTINGS_DEFAULTS,
  type SiteSettings,
} from "@/features/settings/schemas";

export default function AdminSettingsPageClient() {
  const [values, setValues] = useState<SiteSettings>(SITE_SETTINGS_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/settings");
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not load settings.");
      }
      setValues(json.data.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Could not save settings.");
      }
      setValues(json.data.settings);
      setSuccess("Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  function field(
    key: keyof SiteSettings,
    label: string,
    options?: { multiline?: boolean },
  ) {
    return (
      <label className="space-y-1.5 text-sm">
        <span className="font-medium text-brand-navy">{label}</span>
        {options?.multiline ? (
          <textarea
            value={values[key]}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                [key]: event.target.value,
              }))
            }
            rows={3}
            className="w-full rounded-xl border border-border-default px-3 py-2 outline-none focus:border-brand-sky"
          />
        ) : (
          <input
            value={values[key]}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                [key]: event.target.value,
              }))
            }
            className="h-11 w-full rounded-xl border border-border-default px-3 outline-none focus:border-brand-sky"
          />
        )}
      </label>
    );
  }

  if (loading) {
    return <p className="text-sm text-text-muted">Loading settings…</p>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-brand-navy">
          Settings
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Social links, footer contact, default SEO, and CTA destinations.
          Administrator-only.
        </p>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <div className="grid gap-4 rounded-xl border border-border-default bg-bg-surface p-4 sm:grid-cols-2">
          <h3 className="sm:col-span-2 font-semibold text-brand-navy">
            Social links
          </h3>
          {field("socialInstagram", "Instagram URL")}
          {field("socialTiktok", "TikTok URL")}
          {field("socialFacebook", "Facebook URL")}
          {field("socialLinkedin", "LinkedIn URL")}
        </div>

        <div className="grid gap-4 rounded-xl border border-border-default bg-bg-surface p-4 sm:grid-cols-2">
          <h3 className="sm:col-span-2 font-semibold text-brand-navy">
            Footer & SEO
          </h3>
          {field("footerContactEmail", "Footer contact email")}
          {field("seoDefaultTitle", "Default SEO title")}
          <div className="sm:col-span-2">
            {field("seoDefaultDescription", "Default SEO description", {
              multiline: true,
            })}
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border border-border-default bg-bg-surface p-4 sm:grid-cols-2">
          <h3 className="sm:col-span-2 font-semibold text-brand-navy">
            CTA destinations
          </h3>
          {field("ctaDonateUrl", "Donate CTA URL")}
          {field("ctaVolunteerUrl", "Volunteer CTA URL")}
          {field("ctaPartnerUrl", "Partner CTA URL")}
        </div>

        {error ? (
          <p className="text-sm text-brand-magenta" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-sm text-brand-navy" role="status">
            {success}
          </p>
        ) : null}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </section>
  );
}
