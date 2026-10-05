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

Set these on the **live Worker** that serves `girlsglobalinitiative.org`
(Workers & Pages → **girls-global-initiative** → Settings → Variables and Secrets),
then click **Deploy**. Build-time env vars alone are not enough.

Verify after deploy: `https://girlsglobalinitiative.org/api/ready`
must show `"authSecret":"ok"` and `"database":"ok"`. Until then, login will 500.

| Name | Type | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Secret | Neon pooled URL (same as `.env.local`) |
| `AUTH_SECRET` | Secret | Same long secret as `.env.local` |
| `AUTH_URL` | Text | `https://girlsglobalinitiative.org` (also in `wrangler.jsonc` vars) |
| `NEXT_PUBLIC_SITE_URL` | Text | `https://girlsglobalinitiative.org` |
| `NEXT_PUBLIC_ENABLE_MSW` | Text | `false` |
| `NEXT_PUBLIC_MOCK_API` | Text | `false` |
| `SMTP_HOST` | Text | e.g. `smtp.gmail.com` (not `gmail.com`) |
| `SMTP_PORT` | Text | `587` |
| `SMTP_USER` | Secret | Full mailbox email, e.g. `you@gmail.com` |
| `SMTP_PASS` | Secret | App password / SMTP password |
| `SMTP_FROM` | Text | Full From email, e.g. `Girls Global Initiative <you@gmail.com>` |

Do **not** put secrets only in `.env.local` — that file never reaches Cloudflare.
If you have multiple Cloudflare accounts, set secrets on the account that owns
the production Worker (check the Worker overview URL / account id).

After secrets are set, verify:

* `GET https://girlsglobalinitiative.org/api/health`
* `GET https://girlsglobalinitiative.org/api/ready`

## Staff invites and subscriber blast

* **Staff invitations** use SMTP on the Worker (`SMTP_*` secrets above). After
  inviting a user from Admin → Users, the invitee receives a branded email with
  a 72-hour link to `/admin/reset-password?token=…&invite=1`.
* **One-time “site live” newsletter blast** must **not** run inside the Worker
  (avoids CPU Error 1102 from unbounded fan-out). Run locally against production
  Neon + SMTP:

```bash
# Publish the news post (idempotent on slug ggi-website-is-live)
npm run db:publish-site-live-news

# Optional: dry-run recipients
ANNOUNCE_DRY_RUN=1 npm run announce:site-live

# Send to all confirmed subscribers
npm run announce:site-live
```

Use the same `DATABASE_URL` and `SMTP_*` values as production `.env.local`.
If Worker SMTP is still incomplete, the announce script can use local SMTP while
the news post is published to production Neon.

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
