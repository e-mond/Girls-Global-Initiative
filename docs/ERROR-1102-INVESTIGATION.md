# Error 1102 investigation — Girls Global Initiative

**Date:** 1 November 2026 (investigation session)  
**Production host:** https://girlsglobalinitiative.org  
**Runtime:** Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`)  
**Branch:** `feature/error-1102-investigation-and-portability`

This document separates **confirmed findings** from **hypotheses**. It does not
claim the production incident is fixed until staging/production routes are
re-tested after deploy.

---

## 1. What Error 1102 means

Cloudflare documents **Error 1102** as: *Worker exceeded resource limits*.

On Workers this can mean **CPU time**, **memory**, or both for a single
invocation. The public error page does not distinguish which limit tripped.

**Workers Free** does not allow setting `limits.cpu_ms` in `wrangler.jsonc`
(API error `100328`). Raising paid CPU limits does **not** fix memory
exhaustion.

---

## 2. Evidence gathered this session

### Confirmed

| Finding | Evidence |
| --- | --- |
| Live `/api/ready` returned **200** with `database`/`authSecret`/`smtp` ok | Direct probe; `x-opennext: 1` |
| Live `/` mostly returned **200** HTML (OpenNext) | Repeated GET/HEAD probes |
| One **HTTP 503** on `HEAD /` (body size 17, Cloudflare `text/plain`) while ready stayed up | Same session — consistent with intermittent Worker failure (CF 1102 bodies are typically `error code: 1102`) |
| Full CF metrics / invocation traces still unavailable in this workspace | No dashboard API token here |
| Production uses OpenNext Worker entry `.open-next/worker.js` | `wrangler.jsonc` `main` |
| Neon is accessed via **HTTP driver** (`@neondatabase/serverless`) | `db/client.ts` |
| Public layout ISR was `revalidate = 60` (now 120 in this branch) | `app/(public)/layout.tsx` |
| Donation thank-you SMTP already deferred with `after()` | `features/donations/service.ts` |
| Staff submission notify already deferred with `after()` | `features/submissions/notify-staff.ts` |
| Several public paths **awaited Nodemailer** on the request path (fixed in this branch via `queueAcknowledgementEmail`) | submissions, newsletter subscribe/confirm, donation notify/initialize, password reset |
| `listPublishedContent` previously loaded **all rows** then filtered `status === "published"` in memory | `features/content/content-service.ts` |
| Homepage SSR fans out multiple content queries (news, events, pillars, founder, tags, testimonials, settings) | Home components + `getSiteSettings` in layout/footer/pages |

### Not confirmed (do not treat as root cause)

* Exact CPU vs memory split for a specific 1102 event
* Exact URL/path of the last customer-visible failure
* Whether a single cold start + Nodemailer + multi-query SSR was the trigger

### Hypotheses (ranked by evidence weight)

1. **High — request-path SMTP (Nodemailer)** on Workers: TLS + SMTP handshake is CPU- and wall-time heavy; can push invocations over Free limits under load or slow SMTP.
2. **High — homepage / public SSR query fan-out**: multiple full-table reads + in-memory publish filters increase CPU and JSON work per request when CDN miss / revalidate.
3. **Medium — Worker cold start + OpenNext adapter** overhead on Free plan.
4. **Medium — local media buffering** on admin upload paths (lower public traffic).
5. **Lower — bcrypt on login** (admin-only; already isolated from Edge middleware session reads).

---

## 3. Affected routes (likely)

Without CF logs, “affected” means **highest Worker cost under miss/revalidate or POST**:

| Route / operation | Why |
| --- | --- |
| `GET /` | Many parallel content + settings reads |
| Other public CMS pages | Published list queries |
| `POST /api/submissions/*` | Was blocking SMTP + DB write |
| `POST /api/newsletter/subscribe` / `confirm` | Was blocking SMTP |
| `POST /api/donations/notify` / monthly initialize | Was blocking SMTP |
| Paystack webhook + thank-you | Thank-you already deferred; webhook still DB-bound |

---

## 4. Code changes in this branch (mitigations)

Evidence-based, feature-preserving:

1. **SQL `status = published` + optional `LIMIT`** in `listPublishedContent`
2. **`getPublishedEventBySlug` / `getPublishedFounder`** — single-row queries
3. **`React.cache(getSiteSettings)`** — one settings read per request
4. **`queueAcknowledgementEmail`** — public SMTP via `after()` (submissions, newsletter, donation notify/initialize, password reset)
5. **Public `revalidate = 120`** — fewer SSR regenerations (still short vs year-long CDN HTML)
6. **Migration `0011_content_status_indexes`** — indexes on `(status, sort_order)` (+ founder composite)

Admin invite email remains awaited so staff still see send failures.

---

## 5. Cloudflare suitability (Phase 4)

| Factor | Assessment |
| --- | --- |
| CPU / memory | Free plan is tight for Next SSR + Nodemailer; Paid may help CPU but not memory |
| Compatibility | OpenNext works; Node-ish APIs via `nodejs_compat`; Nodemailer is a known stress point |
| Adapter limits | Separate `build:cloudflare` / OpenNext artefact; Docker uses standard `next build` |
| CF-specific features used | Custom domain routes, Images binding, optional Web Analytics CSP, OpenNext assets |
| Cost | Free is fragile for this workload; Paid Workers + Neon + SMTP still modest vs Vercel Pro |
| Ops risk | 1102 blanks the whole site; CDN purge required after deploys; dashboard vs Wrangler account mismatch risk |
| Scaling | Marketing traffic + form posts + SSR revalidate is a poor fit for tiny isolate budgets |

**Recommendation:** Keep Cloudflare only if Paid plan + these mitigations are verified on staging **and** CF metrics show headroom. Prefer **standard Node.js** (Vercel or Docker) for predictable SSR + SMTP. Do **not** cut over production until a preview is verified and the owner approves.

---

## 6. Portability (Phases 5–6)

See [NODE-DEPLOYMENT.md](./NODE-DEPLOYMENT.md).

Cloudflare-only artefacts (`wrangler.jsonc`, `open-next.config.ts`, `build:cloudflare`, `@opennextjs/cloudflare`) remain for the current host; they are not required for `npm run build` / `npm run start` or Docker.

---

## 7. Rollback

1. Keep the current Cloudflare Worker deployment until a Node/Vercel preview is stable.
2. DNS / custom domain can be pointed back to the previous Worker.
3. Database and Cloudinary/Paystack/SMTP are external — no data migration required for host change.
4. Do not delete the Worker until the owner confirms the new host.

---

## 8. Outstanding risks

* 1102 may recur until mitigations are **deployed** and SMTP remains deferred under real traffic
* `after()` on Workers still consumes isolate resources after the response; extreme SMTP latency can still fail quietly
* Migration `0011` must be applied to Neon before indexes help production
* Preview deployment not yet created in this session (no live cutover)
