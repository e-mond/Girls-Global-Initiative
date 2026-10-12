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

### Deploy errors

| Error | Cause | Fix |
| --- | --- | --- |
| `CPU limits are not supported for the Free plan` (`100328`) | `limits.cpu_ms` in `wrangler.jsonc` | Do not set CPU limits on Free |
| `Unable to fetch bindings, routes, or services metadata from the dashboard` | Transient Cloudflare API / remote-config sync timeout | **Retry deploy** (often succeeds on 2nd try). Optionally clear Cloudflare **Build cache**, then retry. Local fallback: `npm run deploy` with a Wrangler API token. |
| Custom domain / MoMo vars disappear after deploy | Dashboard-only settings overwritten by wrangler | Keep `ORG_*` and `routes` (custom domain) in `wrangler.jsonc` |

### After every production deploy — purge CDN cache

Next/OpenNext can emit HTML with long shared-cache TTLs. If Cloudflare keeps
serving an older HTML document, browsers request `/_next/static/*` hashes that
no longer exist → CSS/JS return `text/html` 404s, MIME errors, and
`ChunkLoadError`.

After `npm run deploy` (or a successful CI deploy):

1. Cloudflare Dashboard → Caching → Configuration → **Purge Everything**
   (or purge by URL for `/` and key routes), **or**
2. API purge if you have a token:

```bash
# Requires CLOUDFLARE_API_TOKEN + CLOUDFLARE_ZONE_ID in the environment
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

Then hard-refresh the browser (or open a private window).

Public routes set `revalidate = 60` so new HTML is not cached for a year.
Hashed `/_next/static/*` assets remain immutable.

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
| `BING_SITE_VERIFICATION` | Text / vars | Bing Webmaster `msvalidate.01` content value |
| `CLOUDINARY_CLOUD_NAME` | Text / vars | Cloudinary cloud name |
| `CLOUDINARY_FOLDER` | Text / vars | e.g. `ggi` |
| `CLOUDINARY_API_KEY` | **Secret only** | Cloudinary API key — never in git |
| `CLOUDINARY_API_SECRET` | **Secret only** | Cloudinary API secret — never in git |
| `PAYSTACK_SECRET_KEY` | **Secret only** | Live/test secret for checkout + verify |
| `PAYSTACK_PUBLIC_KEY` | Text / vars | Public key (safe to expose) |
| `PAYSTACK_WEBHOOK_SECRET` | **Secret only** | Optional; defaults to secret key |
| `ORG_MOBILE_MONEY` | Text / vars | e.g. `0241351294` (shown on donate) |
| `ORG_ACCOUNT_NAME` | Text / vars | e.g. `Philomena Larbi` |
| `ORG_TRANSFER_NOTES` | Text / vars | Optional transfer narration guidance |
| `ORG_BANK_NAME` / `ORG_ACCOUNT_NUMBER` | Text / vars | Add when bank details are published |

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

## Error 1102 — Worker exceeded resource limits

Cloudflare returns **Error 1102** when a Worker hits **CPU time** or **isolate
memory** (128MB). Common GGI triggers: OpenNext cold start, SMTP handshake on
the request path, and buffering large media on the Worker.

Mitigations in this repo:

* Do **not** set `limits.cpu_ms` while on Workers **Free** — deploy fails with
  API code `100328`. Upgrade to Workers Paid before raising CPU limits.
* Homepage `revalidate = 120` to cut repeated SSR CPU
* Donation thank-you SMTP deferred via Next.js `after()` / `waitUntil`
* Media uploads prefer **Cloudinary** when `CLOUDINARY_*` secrets are set (no
  Worker filesystem binary streaming for new uploads)
* Newsletter blast stays **off** the Worker (`npm run announce:site-live` locally)

Also add Cloudflare dashboard **WAF / Rate Limiting** in front of `/api/*`
without removing application rate limits. Confirm the invocation outcome
(`exceededCpu` vs `exceededMemory`) in Workers analytics when debugging.

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
