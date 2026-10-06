# SEO and Google Search

This document describes how Girls Global Initiative’s public site supports discovery in search engines. It does not claim Search Console verification or ranking outcomes.

## Site origin

Absolute URLs use `getSiteOrigin()` in `lib/seo/site-origin.ts`:

1. `NEXT_PUBLIC_SITE_URL` (preferred for public SEO)
2. `AUTH_URL`
3. `NEXTAUTH_URL`
4. `http://localhost:3000`

Production should set `NEXT_PUBLIC_SITE_URL` to the canonical public domain (for example `https://girlsglobalinitiative.org`).

## Sitemap

- Route: `/sitemap.xml` (`app/sitemap.ts`)
- Includes static public marketing and policy pages, plus `/what-we-do/[pillar]` entries
- Excludes `/admin/*`, API routes, donation thank-you, and newsletter confirm/unsubscribe flows
- Uses a stable `lastmod` date and canonical `https://girlsglobalinitiative.org/…` URLs
- Production builds refuse to publish `localhost` origins (falls back to the public domain if env is missing)

Regenerate favicons from the brand logo with:

```bash
npm run generate:favicons
```

## Robots

- Route: `/robots.txt` (`app/robots.ts`)
- Allows `/`
- Disallows `/admin/` and `/api/`
- Points to the sitemap URL derived from the site origin

## Metadata

- Root defaults: `generateMetadata` in `app/layout.tsx`
- Optional CMS overrides: Admin → Settings → Default SEO title / description (empty values keep the hard-coded defaults)
- Per-page titles, descriptions, canonicals, Open Graph, and Twitter cards via `buildPageMetadata` (`lib/seo/page-metadata.ts`)
- Default social image: `/brand/ggi-logo.png`
- Admin segment and transactional public pages set `robots: noindex, nofollow`

## Structured data

Homepage emits Organization + WebSite JSON-LD (`components/seo/json-ld.tsx`). Social profile URLs are included only when configured in site settings. Address and telephone are not invented.

## Google Search Console

**Status:** Awaiting configuration

1. Confirm production `NEXT_PUBLIC_SITE_URL` and deploy.
2. In Google Search Console, add the property for the production domain.
3. Optionally set `GOOGLE_SITE_VERIFICATION` in the Worker / environment to the HTML-tag verification token, then redeploy.
4. Submit `https://<production-domain>/sitemap.xml`.
5. Use URL Inspection on a few public pages after crawl.

Do not claim the site is “verified in Search Console” until GGI completes these steps.
