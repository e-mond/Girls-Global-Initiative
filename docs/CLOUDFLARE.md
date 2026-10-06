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
| `AUTH_URL` | Text / `wrangler.jsonc` vars | `https://girlsglobalinitiative.org` |
| `NEXT_PUBLIC_SITE_URL` | Text / vars | `https://girlsglobalinitiative.org` |
| `NEXT_PUBLIC_ENABLE_MSW` | Text / vars | `false` |
| `NEXT_PUBLIC_MOCK_API` | Text / vars | `false` |
| `SMTP_HOST` | Text / vars | e.g. `smtp.gmail.com` (interim) or ESP host |
| `SMTP_PORT` | Text / vars | `587` |
| `SMTP_USER` | Text / vars | Full mailbox, must match From |
| `SMTP_FROM` | Text / vars | `Girls Global Initiative <mailbox@…>` |
| `SMTP_REPLY_TO` | Text / vars | Optional; defaults to From mailbox |
| `SMTP_PASS` | **Secret only** | App password / ESP SMTP password — never in git |

Do **not** put secrets only in `.env.local` — that file never reaches Cloudflare.
If you have multiple Cloudflare accounts, set secrets on the account that owns
the production Worker (check the Worker overview URL / account id).

After secrets are set, verify:

* `GET https://girlsglobalinitiative.org/api/health`
* `GET https://girlsglobalinitiative.org/api/ready`

## Email deliverability (inbox vs spam)

`/api/ready` showing `"smtp":"ok"` only means credentials are present enough to
**send**. Recipient filters decide inbox vs spam afterward.

### Why `@gmail.com` SMTP often hits spam

Sending as `girlsglobalinitiative@gmail.com` while the site brand is
`girlsglobalinitiative.org` creates a domain mismatch. Filters treat that as
weaker trust than mail authenticated as `@girlsglobalinitiative.org`.

### Interim (current Worker vars)

* Keep `SMTP_FROM` / `SMTP_USER` identical mailboxes.
* Recipients: mark **Not spam** once.
* Prefer short transactional subjects (staff invite / password reset).
* **Do not** run a full subscriber blast (`npm run announce:site-live`) on
  consumer Gmail until domain authentication is live.

### Proper fix — domain-authenticated sending

1. Choose a transactional ESP (Resend, Postmark, SendGrid, Amazon SES) **or**
   Google Workspace mailbox on `girlsglobalinitiative.org`.
2. In DNS for `girlsglobalinitiative.org`, add the provider’s records:
   * **SPF** — TXT authorizing the ESP / Google
   * **DKIM** — provider CNAME/TXT keys
   * **DMARC** — start with `v=DMARC1; p=none; rua=mailto:…` then tighten
3. Point app SMTP at the ESP (or Workspace SMTP):
   * Update `wrangler.jsonc` `vars` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
     `SMTP_FROM`, `SMTP_REPLY_TO`) to the `@girlsglobalinitiative.org` identity
   * Set `SMTP_PASS` as a Cloudflare **Secret**
   * Mirror the same values in `.env.local` for operator scripts
4. Redeploy: `npm run deploy`
5. Send a test (`npx tsx scripts/send-test-email.ts`), open the message in
   Gmail → **Show original**, confirm SPF/DKIM/DMARC **PASS**.

### App headers

Transactional sends set `Reply-To` from `SMTP_REPLY_TO` (or the From mailbox).
Newsletter confirm and the site-live announce script also set
`List-Unsubscribe` / `List-Unsubscribe-Post` when an unsubscribe URL is known.

## Staff invites and subscriber blast

* **Staff invitations** use SMTP on the Worker (`SMTP_*` above). After
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

# Send to all confirmed subscribers (only after domain mail auth)
npm run announce:site-live
```

Use the same `DATABASE_URL` and `SMTP_*` values as production `.env.local`.
If Worker SMTP is still incomplete, the announce script can use local SMTP while
the news post is published to production Neon.

## DNS (site)

Point `girlsglobalinitiative.org` (and `www` if used) at this Worker via
Cloudflare DNS / custom domain on the Worker. Keep TLS on Cloudflare.
Email SPF/DKIM/DMARC records are separate from the Worker hostname records —
add both.

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
