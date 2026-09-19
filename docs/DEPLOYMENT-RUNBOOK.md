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
| `ORG_BANK_NAME` / `ORG_ACCOUNT_*` | Recommended | Direct-transfer details on donate page |
| `CLOUDINARY_*` | Later | Media library (local fallback until set) |

Never commit real secrets. Use platform secret stores / `.env.local` (gitignored).

## Pre-deploy checklist

1. Apply Drizzle migrations (`npm run db:migrate`) against Neon.
2. Seed the first administrator (`npm run db:seed-admin`) if needed.
3. Confirm `AUTH_SECRET` and `AUTH_URL` are set.
4. Confirm Paystack webhook URL points to `/api/donations/webhook`.
5. Confirm SMTP credentials if acknowledgement emails are expected.
6. Hit `/api/health` (liveness) and `/api/ready` (readiness).
7. Confirm MSW is disabled: `NEXT_PUBLIC_ENABLE_MSW=false`.

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

## Rollback

1. Redeploy the previous container/image tag.
2. Do not roll back applied Neon migrations without an explicit DBA plan.
3. Disable Paystack checkout by removing `PAYSTACK_SECRET_KEY` if payment processing must stop immediately (transfer details remain).
