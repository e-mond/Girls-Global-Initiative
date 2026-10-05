# Cloudflare Workers (OpenNext) — Girls Global Initiative

Canonical production host: **https://girlsglobalinitiative.org**

Security, integrity, and field reliability take priority over visual polish or
deployment convenience. Do not weaken auth, webhook verification, or rate
limits to make a deploy succeed.

## Cloudflare dashboard settings (required)

| Setting | Value |
| --- | --- |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Root directory | repository root |
| Node version | 22 LTS (or Cloudflare’s current default ≥ 20) |

**Do not use:**

* Build: `npm run build` alone (produces `.next` only; OpenNext needs `.open-next`)
* Deploy: `npx wrangler preview` (preview/beta; not production OpenNext deploy)
* Deploy: bare `npx wrangler deploy` without OpenNext build first

Local equivalent:

```bash
npm run deploy
# → opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

## Required Worker secrets / vars

Set these in Cloudflare (Workers → Settings → Variables and Secrets), never in git:

| Name | Notes |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string |
| `AUTH_SECRET` | Long random secret |
| `AUTH_URL` | `https://girlsglobalinitiative.org` |
| `NEXT_PUBLIC_SITE_URL` | `https://girlsglobalinitiative.org` |
| `NEXT_PUBLIC_ENABLE_MSW` | `false` |
| `NEXT_PUBLIC_MOCK_API` | `false` |
| SMTP / Paystack / Cloudinary | As available from GGI |

After secrets are set, verify:

* `GET https://girlsglobalinitiative.org/api/health`
* `GET https://girlsglobalinitiative.org/api/ready`

## DNS

Point `girlsglobalinitiative.org` (and `www` if used) at this Worker via
Cloudflare DNS / custom domain on the Worker. Keep TLS on Cloudflare.

## Scalability notes

* Public pages are mostly static/SSG; dynamic admin/API routes scale with
  Worker isolates + Neon serverless.
* In-memory rate limits are per-isolate (best-effort). For sustained abuse,
  add Cloudflare WAF / Rate Limiting rules in front of `/api/*` — do not remove
  application checks.
* Optional later: R2 incremental cache binding (`NEXT_INC_CACHE_R2_BUCKET`) per
  https://opennext.js.org/cloudflare/caching
* Docker/`DOCKER_BUILD=1` remains the container path; Workers is the edge path.

## Rollback

1. Redeploy the previous Worker version from Cloudflare dashboard / Wrangler history.
2. Do not roll back Neon migrations without an explicit plan.
