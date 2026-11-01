# Deployment runbook — Girls Global Initiative

This runbook covers production configuration validation for the GGI Next.js app.
Do not invent credentials; obtain them from GGI before go-live.

## Required environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes (production) | Neon Postgres connection string |
| `AUTH_SECRET` | Yes | Auth.js secret — long random string |
| `AUTH_URL` | Yes | Canonical public site URL |
| `PAYSTACK_SECRET_KEY` | For card checkout | Checkout stays disabled until set |
| `PAYSTACK_PUBLIC_KEY` | For card checkout | Client-visible key |
| `PAYSTACK_WEBHOOK_SECRET` | Optional | Defaults to secret key for HMAC |
| `SMTP_HOST` / `SMTP_FROM` | For email | Acknowledgements / opt-in mail |
| `ORG_MOBILE_MONEY` / `ORG_ACCOUNT_NAME` | Recommended | MoMo / direct-transfer details on donate page |
| `ORG_BANK_NAME` / `ORG_ACCOUNT_NUMBER` | Optional | Publish when bank details are available |
| `CLOUDINARY_*` | Later | Media library (local fallback until set) |
| `STAFF_NOTIFY_EMAIL` | Optional | Inbox for new form submissions (else footer email) |

Never commit real secrets. Use platform secret stores / `.env.local` (gitignored).

## Pre-deploy checklist

1. Apply Drizzle migrations (`npm run db:migrate`) against Neon (include `0009`+).
2. Seed the first administrator (`npm run db:seed-admin`) if needed.
3. Confirm `AUTH_SECRET` and `AUTH_URL` are set.
4. Confirm Paystack webhook URL points to `/api/donations/webhook`.
5. Confirm SMTP credentials if acknowledgement emails are expected.
6. Hit `/api/health` (liveness) and `/api/ready` (readiness).
7. Confirm MSW is disabled: `NEXT_PUBLIC_ENABLE_MSW=false`.

## Production go-live checklist (operators)

Complete in the Cloudflare account that owns Worker `girls-global-initiative`
and `girlsglobalinitiative.org` (not a personal/wrong Wrangler account).

### Secrets & vars (Worker secret store / vars)

| Item | Action |
| --- | --- |
| `DATABASE_URL` | Neon production connection string |
| `AUTH_SECRET` / `AUTH_URL` | Long secret; `AUTH_URL=https://girlsglobalinitiative.org` |
| Paystack | Mirror `PAYSTACK_SECRET_KEY`, public key, webhook secret |
| SMTP | Domain ESP preferred (`SMTP_*`); keep `SMTP_PASS` as a Secret |
| Cloudinary | Set `CLOUDINARY_*` for media uploads |
| Org transfer | `ORG_MOBILE_MONEY`, `ORG_ACCOUNT_NAME`, `ORG_BANK_*`, notes |
| Search Console | Optional `GOOGLE_SITE_VERIFICATION` |

### Deploy & cache

1. Build/deploy via OpenNext + `opennextjs-cloudflare deploy` (see `docs/CLOUDFLARE.md`).
2. If dashboard metadata fetch fails: clear build cache, retry.
3. After every successful production deploy: **Purge Everything** in Cloudflare cache
   (stale HTML caused CSS/JS MIME + ChunkLoadError).
4. Verify `/api/ready` on the live host.

### Content seed

1. Admin → Content → **News / Events / Gallery**: create drafts, then **Publish**
   (or `npm run db:publish-site-live-news` for the site-live news item).
2. Admin → Content → **Team / Pillars / Challenge tags / Testimonials / Advocacy**:
   publish so public pages leave mock fallbacks.
3. Settings → paste optional **story / founder video embed URLs** when the host is chosen
   (YouTube/Vimeo/self-host — provider-agnostic iframe URL).

### DNS / email deliverability

- Confirm DNS points at the Worker custom domain.
- Prefer sending from `@girlsglobalinitiative.org` with SPF/DKIM/DMARC
  (Gmail SMTP + `.org` brand mismatch lands in spam).
- Large newsletter blasts: use local `npm run announce:site-live` (or Admin
  broadcast in small batches) — do not fan out full lists from the Worker CPU budget.

## Health endpoints

* `GET /api/health` — always returns `{ data: { status: "ok" } }` (process alive).
* `GET /api/ready` — returns `200` when critical checks pass; `503` when not.
  Report fields: `database`, `authSecret`, `paystack`, `smtp` (`ok` / `missing` / `error` / `skipped`).
  Paystack/SMTP missing does **not** block readiness (transfer and silent email degrade are allowed).

## Docker

```bash
docker compose up --build
```

The app service healthcheck probes `/api/health`. Postgres has its own `pg_isready` check.

## Cloudflare Workers (production host)

Canonical URL: **https://girlsglobalinitiative.org**

See `docs/CLOUDFLARE.md` for the required dashboard build/deploy commands.
Do **not** use `npx wrangler preview` as the production deploy command.

Required production vars include:

```env
AUTH_URL=https://girlsglobalinitiative.org
NEXT_PUBLIC_SITE_URL=https://girlsglobalinitiative.org
NEXT_PUBLIC_ENABLE_MSW=false
NEXT_PUBLIC_MOCK_API=false
```

## Rollback

1. Redeploy the previous Worker version (Cloudflare) or container/image tag (Docker).
2. Do not roll back applied Neon migrations without an explicit DBA plan.
3. Disable Paystack checkout by removing `PAYSTACK_SECRET_KEY` if payment processing must stop immediately (transfer details remain).
