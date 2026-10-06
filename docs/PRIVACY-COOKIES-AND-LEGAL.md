# Privacy, cookies, and legal pages

Status of visitor-facing privacy and legal transparency for the GGI website.

## Cookie inventory (actual)

| Cookie (production HTTPS) | Provider | Purpose | Category | Essential | Consent required |
| --- | --- | --- | --- | --- | --- |
| `__Secure-authjs.session-token` | Auth.js (first-party) | Staff JWT session | Essential / authentication | Yes | No |
| `__Host-authjs.csrf-token` | Auth.js (first-party) | CSRF protection for Auth.js | Essential / security | Yes | No |
| `__Secure-authjs.callback-url` | Auth.js (first-party) | Post-login redirect target | Essential / authentication | Yes | No |

On local HTTP, names omit the `__Secure-` / `__Host-` prefixes and `Secure` is false.

**Session duration:** 24 hours (`STAFF_SESSION_MAX_AGE_SECONDS` in `auth.config.ts`).

**Not present:** Google Analytics, Meta Pixel, marketing cookies, or other non-essential trackers in this codebase.

## Browser storage

| Key | Storage | Purpose |
| --- | --- | --- |
| `ggi-admin-sidebar-collapsed` | `localStorage` | Admin sidebar collapsed preference only |

No `sessionStorage` usage for product features.

## Cookie consent banner

**Decision:** Do **not** show a cookie consent banner while only essential Auth.js cookies exist.

If non-essential analytics or marketing technologies are introduced later, implement consent before loading them, with an accessible preferences UI.

## Cookie Policy route

**Decision:** No standalone `/cookies` page. Essential-cookie inventory is documented here and summarised on `/privacy`.

## Policy page status

| Page | Route | Status |
| --- | --- | --- |
| Privacy Policy | `/privacy` | Route implemented; body marked **Awaiting official GGI confirmation** where legal/organisational facts are required |
| Terms of Use | `/terms` | Route implemented; section outline only — **Awaiting official GGI confirmation** |
| Accessibility Statement | `/accessibility` | Route implemented; commitment language only — no “fully accessible” claim |
| Cookie Policy | — | Not created (see above) |

Do not mark legal content **Verified** until GGI supplies approved wording.

## Third-party services (technical)

| Service | Role | Notes |
| --- | --- | --- |
| Neon Postgres | Application database | Server-side |
| Auth.js / NextAuth | Staff authentication | First-party cookies |
| SMTP (configured host) | Transactional email | Server-side |
| Paystack | Donation checkout | Redirect to Paystack-hosted checkout; no Paystack JS embed in GGI |
| Cloudinary (when configured) | Media storage | Server-side uploads |
| Cloudflare Workers / OpenNext | Hosting | Edge platform |

## Public form disclosures

Public forms link to `/privacy` (and Terms where appropriate) with factual notices about submitting contact details — without inventing legal bases or retention periods.
