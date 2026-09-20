# Progress Tracker

> **Purpose:** Track implementation progress, validation results, architectural decisions, open questions, and the next approved development step.
> **Rule:** Update this file after every meaningful implementation change. Do not mark work complete unless it has been implemented, validated, and committed/pushed as required by `AGENTS.md`.

---

## Current Phase

* **Content follow-up — Canonical social links**
* **Status:** In progress on `feature/content-social-links`
* **Previous phase:** Unit 8 — Production Readiness (complete, PR #11)
* **Current branch:** `feature/content-social-links`
* **Repository:** `e-mond/Girls-Global-Initiative`
* **Current objective:** Wire Footer and Contact to four canonical social profiles from content-reference.md via a shared config.
* **Owner notes:** Neon configured; Paystack/Cloudinary/SMTP credentials still pending from GGI.

---

## Current Goal

Complete content social-links follow-up:

1. Shared `content/social-links.ts` + Contact details.
2. Footer and Contact consume the same four profiles (Instagram, TikTok, Facebook, LinkedIn).
3. Align admin settings platforms; validate and merge.

---

# Completed

## Unit 1 — Foundations

**Status:** Complete

The foundation has been implemented and merged to:

* Repository: `e-mond/Girls-Global-Initiative`
* `main` — includes Unit 1 via merged PR #1 (`feature/foundations`)
* `feature/foundations` — Unit 1 implementation branch (merged)

### Implemented

* Git repository initialised.
* `main` baseline established.
* `feature/foundations` created, pushed, and merged.
* Next.js App Router application scaffolded.
* GGI brand tokens established.
* Red Hat Display/Text fonts wired into the application.
* Tailwind/shadcn theme foundation configured.
* Public site shell created.
* Admin shell created.
* Information-architecture stub routes created according to `project-overview.md`.
* Drizzle database skeleton created.
* Neon database client scaffold created.
* MSW API stubs created.
* `/api/health` endpoint created.
* Docker configuration added.
* `docker-compose` configuration added.
* `.env.example` created.
* Design reference renamed:

  * `RefenceImage.png`
  * → `GGIHomepage.png`
* `AGENTS.md` reviewed and confirmed aligned with the approved PRD stack.

### Validation

| Check                        | Result             |
| ----------------------------- | ------------------ |
| `npm run lint`                | **PASS**           |
| `npm run type-check`          | **PASS**           |
| `npm run test` (Playwright)   | **PASS — 2 tests** |
| `npm run test:e2e` (Cypress)  | **PASS — 1 test**  |
| `npm run build`               | **PASS**           |

### Local Development

```bash
npm run dev
```

A local `.env.local` is present and remains gitignored.

---

# In Progress

## Post-roadmap operational follow-ups

**Status:** After Unit 8 merge

* Supply Paystack / SMTP / Cloudinary / org transfer credentials
* Replace Eugenia placeholder photo
* Seed/publish live CMS content

---

## Recently completed

### Unit 8 — Production Readiness

**Status:** Complete (merged via PR #11)

* `/api/ready` fail-closed readiness checks (auth + database critical)
* Paystack/SMTP presence reported without blocking readiness
* Docker Compose app healthcheck on `/api/health`
* `docs/DEPLOYMENT-RUNBOOK.md`

### Unit 7 — Users, Settings & Audit

**Status:** Complete (merged via PR #10)

* Administrator staff user create/list/role update
* Site settings (social, footer email, SEO defaults, CTA URLs) with footer wiring
* Audit log admin UI (searchable)
* Drizzle migration `0004_unit7_users_settings`

### Unit 6 — Donations (Paystack)

**Status:** Complete (merged via PR #9)

* Donate page: preset/custom GHS amounts, one-time vs monthly intent, anonymous option
* Paystack initialize + hosted checkout when `PAYSTACK_SECRET_KEY` is set
* Signed webhook (`x-paystack-signature`) with idempotent success handling
* Thanks page with soft verify fallback; receipt email best-effort via SMTP
* Organisation transfer details from `ORG_*` env (no invented account numbers)
* Admin read-only donations list + CSV export
* Drizzle migration `0003_unit6_donations`

### Unit 5 — Newsletter

**Status:** Complete (merged via PR #8)

* Homepage single-field signup with double opt-in confirmation email
* Confirm (`/newsletter/confirm`) and unsubscribe (`/newsletter/unsubscribe`) flows
* Admin subscriber list, search, status updates, manual add, CSV export
* Drizzle migration `0002_unit5_newsletter`
* Unsubscribed rows retained and flagged (never silently deleted)

### Unit 4 — Submission Workflows

**Status:** Complete (merged via PR #7)

* Public volunteer (3-step), partnership, and contact forms
* Zod validation, in-memory rate limiting, Neon persistence (with memory fallback)
* SMTP acknowledgement emails via Nodemailer (best-effort; save succeeds if SMTP unset)
* Admin submissions list with status New → In review → Accepted/Declined + CSV export
* Drizzle migration `0001_unit4_submissions`
* Audit log entries for create/status/export

### Responsive / accessibility / favicons polish (pre–Unit 4)

* Favicon set + web manifest from GGI logo (`app/icon.png`, `public/icons/*`)
* Skip-to-content link, viewport/theme-color metadata
* Accessible mobile nav drawer (Escape to close, 44px touch targets)
* Responsive CTA stacking on hero, communities, header, footer
* Team page + founder photos from owner assets (Eugenia placeholder)

## Unit 3 — Admin Back-Office Core

**Status:** Complete (merged via PR #5)

* Auth.js Credentials staff sign-in, JWT sessions, `/admin` middleware gate
* Editor / Administrator RBAC; Users/Settings Administrator-only
* Content CMS CRUD + draft/publish for pillars, team, challenge tags, gallery,
  testimonials, advocacy
* Media library with required alt text; local `storage/media` fallback
* Audit logging for content/media mutations
* Drizzle migration `0000_unit3_admin_content`
* Validation: lint, type-check, Playwright (5), build — PASS

## Unit 2 — Public Website

**Status:** Complete (merged via PR #4)

* Hero images, homepage sections, and public pages against the approved
  reference; Origin / Founder / Where we work fidelity pass included.

---

# Development Roadmap

## 1. Foundations

**Status:** Complete

* Next.js application foundation
* Brand/design tokens
* Fonts
* Public shell
* Admin shell
* IA routes
* Database foundation
* MSW foundation
* Health endpoint
* Docker foundation
* Environment template

---

## 2. Public Website

**Status:** Complete (merged via PR #4)

### Scope

Build the public-facing GGI website using the approved design system and `GGIHomepage.png` as the primary visual reference.

Planned areas:

* Home
* Our Story
* What We Do

  * Four pillar detail pages
* Founder
* Team
* Communities / Where We Work
* Contact page shell

### Content

Public content should be read from the approved CMS/content entities where the relevant entities already exist.

Until the CMS write functionality is implemented in Unit 3:

* CMS-read content may use approved mock-backed data.
* Mock content must remain isolated and replaceable.
* Public pages must not present fabricated organisational statistics, beneficiaries, programmes, partners, testimonials, locations, awards, or impact figures as real information.

### Unit 2 Boundary

Do **not** implement the following as part of Unit 2 unless explicitly re-scoped:

* Admin authentication
* Admin CRUD
* Staff user management
* Public applicant accounts
* Volunteer submission processing
* Partnership submission processing
* Newsletter management
* Paystack checkout
* Donation webhooks
* Staff audit UI
* Production SMTP integration
* Recurring donation subscriptions

Those belong to later roadmap units.

---

## 3. Admin Back-Office Core

**Status:** Complete (merged via PR #5)

Scope:

* Auth.js staff sign-in
* Editor / Administrator RBAC
* `/admin` dashboard shell
* Content management CRUD
* Draft / Published workflow
* Pillars
* Team
* Gallery
* Testimonials
* Challenge tags
* Advocacy content
* Media library uploads

---

## 4. Submission Workflows

**Status:** Complete (merged via PR #7)

Public forms:

* Volunteer application
* Partnership request
* Contact form

Requirements:

* Client-side validation
* Server-side validation
* Rate limiting
* Safe error handling
* Submission persistence
* SMTP acknowledgement emails

Admin:

* Submission list
* Submission detail
* Status updates

Status flow:

`New → In review → Accepted / Declined`

---

## 5. Newsletter

**Status:** Complete (merged via PR #8)

Public:

* Newsletter signup
* Double opt-in
* Unsubscribe flow

Admin:

* Subscriber list
* Search
* Export

---

## 6. Donations — Paystack

**Status:** Complete (merged via PR #9)

Public:

* Donation page
* Amount selection
* One-time / Monthly interface
* Paystack checkout
* Organisation direct-transfer details

Backend:

* Signed webhook verification
* Idempotent webhook handling
* Donation record creation from verified webhook events

Admin:

* Read-only donations view

### Important Scope Boundary

The initial release must not treat the monthly toggle as proof that recurring billing is already implemented.

Recurring Paystack subscription billing is a later increment.

---

## 7. Users, Settings & Audit

**Status:** Complete (merged via PR #10)

Administrator-only functionality:

* Staff user management
* Role management
* Site settings
* Social links
* Footer contact information
* Default SEO settings
* CTA destinations
* Audit log UI

---

## 8. Production Readiness

**Status:** Complete (merged via PR #11)

Scope:

* Environment fail-closed checks
* Paystack configuration checks
* SMTP configuration checks
* Database configuration checks
* `/api/health`
* `/api/ready`
* Docker healthcheck
* Deployment runbook
* Production configuration validation

---

# Open Questions

These items remain unresolved and must not be guessed or fabricated.

## SMTP

GGI has indicated that email will follow the SekoFund SMTP pattern, but the actual relay/host credentials have not yet been supplied.

Use generic environment variables:

```env
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

Do not hardcode provider-specific assumptions.

---

## Video Hosting

The hosting method for:

* "Our story in 2 min"
* Founder-message videos

has not yet been finalised.

Potential implementation options:

* Self-hosted video
* YouTube embed
* Vimeo embed

Do not commit to one until the hosting decision is confirmed.

---

## Domain / DNS

GGI has confirmed a `.org` registration.

Exact:

* Registrar
* DNS provider
* DNS handoff
* Production domain

details have not yet been supplied.

Do not hardcode or assume the production domain.

---

## Paystack Credentials

Paystack credentials have not yet been supplied by GGI.

Donation functionality should therefore use the approved mock/MSW contract until the real credentials and account configuration are available.

Never commit real Paystack credentials.

---

## Brand Assets

GGI is expected to provide:

* Official logo
* Additional UI references
* Photography/image references where applicable

Until those assets arrive:

* Use the confirmed brand system.
* Use `GGIHomepage.png` as the current visual reference.
* Do not invent an official logo.
* Do not fabricate organisational photography or impact imagery.

---

## Pillar structure vs. source content

`content-reference.md` (from GGI's own brand PDF) gives 6 Focus Areas, 6
Programmes & Initiatives, and 4 Projects, which don't map one-to-one onto
the 4 pillars from `GGIHomepage.png`/`GGI-BRD.md`/`GGI-PRD.md`. A proposed
resolution (4 pillars stay as top-level structure; new `/programmes` and
`/impact` pages added, with a new `programmes` CMS entity) is documented at
the bottom of `content-reference.md` — confirm this was applied, or
reconcile, before treating Unit 2 content as final.

---

# Architecture Decisions

## Media storage — Cloudinary

Owner decision (2026-09-19): image and video uploads for the media library
will use **Cloudinary**, not S3-compatible object storage.

* Credentials will be supplied later (`CLOUDINARY_*` in `.env.example`).
* Until then, admin uploads continue to use the local `storage/media/` fallback.
* Database stores metadata/URLs only — never binaries.
* Static founder/team photos currently ship from `assets/` → `public/team/`
  and `public/home/founder.jpg` until CMS/Cloudinary publishing is live.

**Source:** Explicit owner instruction; updates `architecture.md` File storage.

---

## Unit 3 — Offline auth and media fallback

When `DATABASE_URL` is unset (local/MSW development), staff credentials are
validated against `AUTH_DEV_*` environment variables and never in production.

When S3 credentials are unset, media binaries are stored under gitignored
`storage/media/` and served only to authenticated staff via
`/api/admin/media/[id]/file`. Database rows still store metadata/URLs only.
Live S3 wiring remains a later hardening step.

**Source:** `architecture.md` Auth/Storage; Unit 3 implementation.

---

## Payment Processor — Paystack

Paystack is the selected payment processor for Ghana-based NGO donations.

GGI organisation account details will also be displayed on the donation page as a direct-transfer alternative.

Rules:

* Never store raw card details.
* Donation records must only be created from appropriately verified webhook events.
* Webhooks must be authenticated/verified server-side.
* Webhook processing must be idempotent.

**Source:** `GGI-PRD.md` §8.2; Project Brief §6.

---

## Recurring Donations — Phased

One-time donations are part of the initial donation scope.

The donation interface may expose a One-time / Monthly choice where specified by the approved design/PRD.

However:

* Subscription creation
* Recurring billing
* Retry handling
* Cancellation
* Subscription lifecycle management

are Phase 2 functionality.

Do not silently implement recurring billing as part of the initial release.

**Source:** `GGI-PRD.md` §12.

---

## Email — SMTP

Transactional email will use SMTP, following the established SekoFund implementation pattern.

Use Nodemailer or an equivalent maintained SMTP library where appropriate.

Do not introduce a dedicated transactional-email vendor without an explicit architecture decision.

**Source:** `GGI-PRD.md` §8.1.

---

## Deployment — Single Full-Stack Next.js Application

Frontend and API functionality remain within one Next.js App Router application.

The application is containerised using Docker.

Do not introduce a separate backend service unless the architecture is explicitly re-scoped.

**Source:** `GGI-PRD.md` §7; Project Brief §6.

---

## Public Authentication — Not in Release 1.0

Release 1.0 does not include public applicant or donor accounts.

Volunteer, partnership, and contact submissions are anonymous submissions reviewed by authorised staff.

There is:

* No public sign-in
* No visitor dashboard
* No applicant account
* No donor account

Do not introduce public authentication without an explicit Architecture Decision.

---

## Brand System

Confirmed primary brand colours:

* Deep Navy — `#041B4B`
* Vivid Sky Blue — `#00B0F2`
* Magenta Pink — `#E00286`

Typography:

* Red Hat Display
* Red Hat Text

Components should consume design tokens rather than hardcoding visual values throughout individual components.

**Source:** `GGI-PRD.md` §10; Project Brief §6.

---

## Brand Assets

GGI's official logo and additional design/image references are expected to come from GGI.

The developer should not invent official brand assets and present them as supplied organisational assets.

Until additional references arrive, `GGIHomepage.png` remains the authoritative design reference currently available.

**Source:** `GGI-PRD.md` §10.

---

## Domain

GGI has confirmed a `.org` domain registration.

Domain registration is treated separately from the development cost.

**Source:** Project Brief §10.1.

---

## Document Generation

Release 1.0 does **not** require PDF, XLSX, or DOCX document generation.

CSV export is sufficient for the planned:

* Submission exports
* Newsletter subscriber exports

Do not introduce document-generation libraries unless a new requirement explicitly requires them and an Architecture Decision is recorded.

---

# Engineering Guardrails

These apply to every implementation unit.

## Validation

* Validate external input at runtime.
* Client validation is for user experience.
* Server-side validation is authoritative.
* Validate API bodies, query parameters, route parameters, uploaded files, environment configuration, third-party responses, and webhooks.
* Use the project's approved runtime schema-validation approach consistently.

---

## Authentication & Authorisation

* Authentication must be enforced server-side.
* Authorisation must be enforced server-side.
* Hidden UI controls are not a security boundary.
* Check resource ownership/access permissions on the server.
* Never expose privileged operations merely because a button is hidden from the UI.

---

## API Security

Every API endpoint must consider:

* Authentication
* Authorisation
* Input validation
* Business-rule validation
* Rate limiting where appropriate
* Safe response shaping
* Correct HTTP status codes
* Consistent error semantics
* Unexpected input
* Duplicate requests
* Failure handling

Never return:

* Stack traces
* SQL errors
* ORM errors
* Database connection details
* Secrets
* Internal implementation details

---

## Database Integrity

Use:

* Transactions where multiple writes must succeed together
* Foreign keys where relationships require them
* Appropriate database constraints
* Appropriate indexes
* Pagination for large collections
* Query optimisation
* Protection against N+1 queries

Do not make manual production schema changes outside the project's migration process.

---

## Idempotency

Operations involving:

* Payments
* Webhooks
* Approvals
* Invitations
* External API calls
* Bulk operations

must be designed so retries do not accidentally duplicate the operation.

---

## File Uploads

Where uploads are introduced:

* Validate file size.
* Validate MIME type.
* Validate file signatures where appropriate.
* Validate extensions.
* Generate safe filenames.
* Never execute uploaded files.
* Use private object storage for sensitive files.
* Use temporary access URLs where appropriate.

---

## Secrets

Never commit:

* API keys
* Passwords
* SMTP credentials
* Paystack secret keys
* Database credentials
* Session secrets
* Production `.env` files

`.env.example` should contain variable names and safe placeholders only.

Anything exposed to the browser must be treated as public.

---

## Logging

Use structured logging where appropriate.

Never log:

* Passwords
* Tokens
* API keys
* Session cookies
* Full payment information
* Unnecessary sensitive personal information

Logs should contain useful operational context such as:

* Timestamp
* Operation
* Endpoint
* Request/reference ID
* Safe account/user reference where necessary
* Error category

---

## Error Handling

User-facing errors must explain:

1. What happened.
2. Why, where useful.
3. What the user can do next.

Technical details remain server-side.

Example safe API contract:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the highlighted fields.",
    "requestId": "..."
  }
}
```

---

## Performance

Do not optimise by adding infrastructure without evidence.

Priorities include:

* Efficient database queries
* Appropriate indexes
* Pagination
* Connection management
* Image optimisation
* Lazy loading
* Code splitting
* Avoiding unnecessary client-side JavaScript
* Debounced search/filter operations
* Caching only where justified
* Appropriate CDN usage
* Health checks and monitoring
* Warm-up strategies where appropriate

Do not introduce unnecessary always-on services merely to keep infrastructure "awake".

---

## Testing

Each meaningful feature should be validated at the appropriate level:

* Unit tests
* Integration tests
* API tests
* E2E tests
* Accessibility checks
* Security checks
* Production build validation

Important failure scenarios should be considered, including:

* Slow responses
* API timeouts
* API failure
* Database failure
* Expired sessions
* Duplicate submissions
* Network interruption
* Partial API failure
* Invalid input
* Unauthorised access
* Forbidden access

---

## Git & Delivery

For each meaningful implementation unit:

1. Implement.
2. Validate.
3. Run the required tests.
4. Run a production build.
5. Review the change.
6. Commit with a meaningful message.
7. Push the branch where required by the workflow.
8. Update this tracker.

Do not commit:

* Secrets
* Debug dumps
* Generated build artefacts
* Temporary files
* Sensitive production data

---

# Unit 2 — Planned Page Scope

The initial public website scope is:

| Page / Area                  | Unit 2    |
| ----------------------------- | --------- |
| Home                          | Complete  |
| Our Story                     | Complete  |
| What We Do                    | Complete  |
| Pillar 1 detail                | Complete  |
| Pillar 2 detail                | Complete  |
| Pillar 3 detail                | Complete  |
| Pillar 4 detail                | Complete  |
| Founder                       | Complete  |
| Team                          | Complete  |
| Communities / Where We Work   | Complete  |
| Contact shell                 | Complete  |

The exact naming and content structure must follow the approved PRD and project documentation.

Do not invent additional public programmes or organisational claims to fill incomplete content.

---

# Current Branch State

### `main`

Purpose:

* Documentation baseline
* Approved assets
* Project baseline
* **Units 1–8 (merged via PR #1, #4, #5, #7, #8, #9, #10, #11)**

### Next Branch

Further roadmap units are not currently scoped. Operational follow-ups
(credentials, Cloudinary, content seeding) do not require a new feature
branch unless they involve code changes — in that case, branch per
`AGENTS.md` §5 as normal (e.g. `feature/cloudinary-wiring`).

---

# Validation History

## Unit 1 — Foundations

| Check                 | Result           |
| ---------------------- | ---------------- |
| Git initialisation     | **PASS**         |
| Next.js foundation     | **PASS**         |
| Brand tokens           | **PASS**         |
| Red Hat fonts          | **PASS**         |
| Public shell           | **PASS**         |
| Admin shell            | **PASS**         |
| IA stub routes         | **PASS**         |
| Drizzle skeleton       | **PASS**         |
| MSW stubs              | **PASS**         |
| `/api/health`          | **PASS**         |
| Docker                 | **PASS**         |
| `.env.example`         | **PASS**         |
| `npm run lint`         | **PASS**         |
| `npm run type-check`   | **PASS**         |
| `npm run test`         | **PASS — 2**     |
| `npm run test:e2e`     | **PASS — 1**     |
| `npm run build`        | **PASS**         |
| Merge to `main`        | **PASS** (PR #1) |

---

# Session Notes

## Content follow-up — Canonical social links (this session)

* Social profile URLs taken from authoritative `content reference.md` (not `GGI.pdf`).
* Footer and Contact page share `content/social-links.ts` + `components/layout/social-links.tsx`.
* Exactly four platforms: Instagram, TikTok, Facebook, LinkedIn.
* Stale admin/public X and YouTube fields removed; TikTok added (`0005_content_social_tiktok`).
* Old Instagram handle `girls.global.initiative` was not used.
* Contact phones/email from content reference wired on Contact; footer email falls back to the same address.
* Validation: lint PASS, type-check PASS, Playwright PASS (18 tests with retries), build PASS.

## Units 1–8 — Complete

All roadmap units (Foundations through Production Readiness) are
implemented and merged into `main` on `e-mond/Girls-Global-Initiative`:

* PR #1 — Foundations (`feature/foundations`)
* PR #4 — Public Website (`feature/public-website` or equivalent)
* PR #5 — Admin Back-Office Core
* PR #7 — Submission Workflows
* PR #8 — Newsletter
* PR #9 — Donations (Paystack)
* PR #10 — Users, Settings & Audit
* PR #11 — Production Readiness

The design reference was renamed `RefenceImage.png` → `GGIHomepage.png`.
`AGENTS.md` was reviewed and confirmed against the approved PRD stack.

### Current Status

Roadmap Units 1–8 are complete and merged into `main`. Active work is
content follow-up (canonical social links) on `feature/content-social-links`.

---

# Update Rules

Update this file whenever there is a meaningful change, including:

* New unit started
* Feature implemented
* Feature removed or re-scoped
* Architecture decision made
* Open question resolved
* Branch created
* Branch merged/pushed
* Test result changes
* Build/deployment result changes
* New dependency or infrastructure decision
* Security or reliability decision
* Significant design decision

Do not use this file as a running chat transcript.

Keep entries factual, concise, and current.

If a previous decision changes, update the authoritative section rather than appending contradictory information.