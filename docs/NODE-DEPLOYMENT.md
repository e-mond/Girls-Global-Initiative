# Standard Node.js deployment — Girls Global Initiative

GGI requires **server-side** Next.js (auth, APIs, webhooks, SSR). Do **not** use
`output: 'export'` / static export.

This guide prepares a host that does **not** use Cloudflare Workers. It does
**not** replace the live Worker until a preview is verified and the owner
approves cutover. See [ERROR-1102-INVESTIGATION.md](./ERROR-1102-INVESTIGATION.md).

---

## Preferred alternative: Vercel

### Why

* First-party Next.js App Router runtime (`next build` + Node server)
* No OpenNext / Workers isolate CPU/memory ceilings
* Preview deployments for safe verification
* Same Neon, Paystack, SMTP, Cloudinary env model

### Build

```bash
npm ci
npm run build
# Platform runs: next start (or Vercel’s Node serverless/server runtime)
```

Do **not** set Cloudflare dashboard build to `npm run build:cloudflare` on Vercel.

### Environment variables

Mirror production secrets from [DEPLOYMENT-RUNBOOK.md](./DEPLOYMENT-RUNBOOK.md):

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Neon (prefer pooled URL) |
| `AUTH_SECRET` / `AUTH_URL` | `AUTH_URL` = preview or production URL |
| `PAYSTACK_*` | Update webhook URL to the new host |
| `SMTP_*` | Unchanged |
| `CLOUDINARY_*` | Unchanged |
| `ORG_*` | Transfer details |
| `STAFF_NOTIFY_EMAIL` | Optional |
| `NEXT_PUBLIC_SITE_URL` | Canonical public URL |
| `NEXT_PUBLIC_ENABLE_MSW` | `false` |
| `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` | Optional |

Never log secret values.

### Paystack webhook

After preview URL is known, set Paystack webhook to:

`https://<host>/api/donations/webhook`

Keep the Cloudflare URL until cutover so production payments keep working.

### Image optimisation

Standard `next/image` on Node/Vercel. Cloudflare `IMAGES` binding is unused on
this path (`wrangler.jsonc` only).

### Background work

`after()` from `next/server` is supported on modern Next/Vercel. Donation and
form emails are queued that way so responses return before SMTP finishes.

---

## Docker / any Node host

Repository already supports standalone output when `DOCKER_BUILD=1`:

```bash
docker compose up --build
# or
DOCKER_BUILD=1 npm run build && npm run start
```

`Dockerfile` copies `.next/standalone` and runs `node server.js` on port 3000.

Healthcheck: `GET /api/health`. Readiness: `GET /api/ready`.

Ensure migrations are applied (`npm run db:migrate`) against Neon before traffic.

---

## Platform-specific pieces (retain, do not require)

| Artefact | Role |
| --- | --- |
| `wrangler.jsonc` | Cloudflare Worker only |
| `open-next.config.ts` | OpenNext CF adapter |
| `npm run build:cloudflare` / `deploy` | CF packaging |
| `@opennextjs/cloudflare` / `wrangler` | DevDependencies for CF |
| `initOpenNextCloudflareForDev` in `next.config.ts` | Local CF bindings; skipped when `DOCKER_BUILD=1` or `CI=true` |

Application domain code under `app/`, `features/`, `db/` is host-agnostic.

CSP allows Cloudflare Insights (`static.cloudflareinsights.com`); harmless on
Node hosts if unused.

---

## Preview verification checklist (before production cutover)

- [ ] Public pages (home, story, news, events, donate, forms)
- [ ] Admin login / logout
- [ ] Admin CMS CRUD + media upload
- [ ] Submissions + staff notify email
- [ ] Newsletter subscribe / confirm / unsubscribe
- [ ] Donation initialize + Paystack webhook (test mode)
- [ ] Manual transfer notify
- [ ] `/api/health` and `/api/ready`
- [ ] Redirects, SEO (`/sitemap.xml`, `/robots.txt`)
- [ ] Security headers present

Only then change DNS / custom domain. Keep the Worker as rollback until stable.

---

## Estimated migration effort

| Work | Effort |
| --- | --- |
| Vercel project + env + preview | ~0.5–1 day |
| Paystack webhook + AUTH_URL updates | ~1–2 hours |
| DNS cutover + smoke | ~2–4 hours (incl. monitoring) |
| Docker on a VPS | ~1–2 days (TLS, process manager, backups) |

**Hosting cost (order of magnitude, verify current pricing):** Vercel Hobby may
suffice for low traffic; Pro if function limits/team features needed. Docker on
a small VPS is often cheaper but needs ops. Neon and SMTP/Cloudinary/Paystack
costs are unchanged by host.

---

## What not to do

* Do not force static export
* Do not remove working Paystack / SMTP / Cloudinary integrations
* Do not publicly cache admin or donor-specific data
* Do not cut over production without owner approval
