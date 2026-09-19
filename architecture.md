# Architecture Context

> Note: `GGI-PRD.md` §7 ("Technical Architecture") is the source for the
> stack below. It is fixed by explicit instruction and must not be changed
> without an updated Architecture Decision entry in `progress-tracker.md`.

## Stack

| Layer            | Technology                                   | Role                                                              |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| Framework        | Next.js (App Router) + TypeScript (strict)    | Full-stack: pages, layouts, server components, route handlers      |
| UI               | Tailwind CSS + shadcn/ui                      | Design system, accessible primitives (GGI brand tokens — see `ui-context.md`) |
| ORM              | Drizzle ORM                                    | Type-safe schema, migrations, queries against Postgres              |
| Database         | Neon Postgres (serverless Postgres)            | System of record for all structured data                            |
| Backend API      | Next.js App Router route handlers (`app/api`) | REST-style endpoints; no separate backend service                    |
| Auth             | Auth.js (NextAuth) over Drizzle, RBAC in session/JWT claims | Staff back-office authentication only (Administrator / Editor) — the public site is unauthenticated |
| Email            | SMTP (Nodemailer or equivalent, SekoFund integration pattern) | Transactional email: submission acknowledgements, donation receipts, newsletter double opt-in/unsubscribe |
| Payments         | Paystack                                       | Donation checkout; server-verified signed webhook confirms outcome  |
| File storage     | S3-compatible object storage, outside web root | Media library (gallery photos, team/founder photos, advocacy assets); database stores references/metadata only |
| CSV export       | RFC4180 helpers in `features/exports/csv.ts`   | Submissions and subscriber export from the admin back-office        |
| Containerization | Docker + docker-compose                        | Local/dev parity, deployable images                                  |
| Unit testing     | Playwright (component/unit-level)              | Unit tests for components, hooks, utils, validation logic           |
| Integration/E2E  | Cypress                                        | Feature workflows, multi-step forms, navigation, auth flows          |
| API mocking      | MSW (Mock Service Worker)                      | Intercepts HTTP calls to `app/api/*` at the network layer for local dev without a live DB/Paystack/SMTP, and for both Playwright and Cypress test runs |
| Fonts            | Red Hat Display / Red Hat Text                 | Brand typography — see `ui-context.md`                               |

There is no PDF/DOCX/XLSX document-generation engine in the approved stack
for Release 1.0 — GGI's back-office needs (submissions export, subscriber
export) are served by CSV export only. Do not add a PDF/XLSX library
without an explicit Architecture Decision.

## System Boundaries

- `app/` — routes, layouts, server components, and `app/api/*` route handlers.
  Owns request/response handling and page composition only — no business logic.
- `features/` — one folder per business domain: `donations`, `submissions`
  (volunteer applications, partnership requests, contact messages), `content`
  (pillars, team, gallery, testimonials, challenge tags, advocacy — CMS),
  `subscribers` (newsletter), `governance` (users/roles/settings), `audit`.
  Owns domain logic, feature-specific components, and feature-specific hooks.
- `components/` — shared, feature-agnostic UI. `components/ui/*` is the
  shadcn-generated primitive layer (protected, see `code-standards.md`).
- `services/` — the API client layer. Owns all outbound data fetching from
  the frontend; always calls the real `app/api/*` routes (there is no
  client-side "mock vs real" branch — see Mocking Strategy below).
- `mocks/` — MSW request handlers (`mocks/handlers/*`) and data factories,
  plus `mocks/browser.ts` (browser worker, used in local dev when no DB
  connection string is configured) and `mocks/server.ts` (Node server,
  used by Playwright/Cypress test runs). Each handler mirrors the exact
  request/response contract of its real `app/api/*` route, including the
  Paystack checkout/webhook contract and the SMTP send contract. Never
  imported by production code paths; excluded from production builds.
- `db/` — Drizzle schema, migrations, and the Neon client. Owns the data
  model and all raw queries; nothing outside `db/` and `services/` talks to
  the database directly.
- `hooks/` — shared React hooks not tied to one feature.
- `state/` — cross-feature client state (e.g. admin session/toast state).
- `types/` — shared TypeScript types/interfaces, including inferred Drizzle
  types re-exported for the frontend.
- `utils/` — pure, side-effect-free helper functions.
- `config/` — environment/config loading and validation (mock-mode flag,
  feature flags, Paystack/SMTP env presence checks).
- `tests/` — Playwright unit tests and Cypress integration/E2E tests,
  mirroring the `features/` structure.
- `assets/` — static assets (icons beyond lucide, brand imagery, fonts if any).

## Storage Model

- **Database (Neon Postgres via Drizzle)**: all structured entities from
  `GGI-PRD.md` §7.2 — `users` (staff), `pillars`, `team_members`,
  `challenge_tags`, `gallery_items`, `testimonials`, `advocacy_content`,
  `media_assets`, `volunteer_applications`, `partnership_requests`,
  `contact_messages`, `newsletter_subscribers`, `donations` (reference/status
  synced from Paystack, never raw card data), `audit_logs`.
- **Object/file storage**: gallery/team/media-library image binaries. The
  database stores only the reference/URL and metadata, never the file
  itself.
- GGI does not have an applicant/document-upload workflow — there is no
  user-submitted document storage in Release 1.0 (volunteer, partnership,
  and contact forms are text-field submissions only).

## Mocking Strategy

- Every `app/api/*` route handler is implemented for real from the start,
  querying `db/` via Drizzle — there is no parallel "mock service" code
  path inside the app itself. Mocking happens one layer out, at the HTTP
  boundary, via **MSW**.
- In local dev without a configured Neon connection, or without configured
  Paystack/SMTP credentials, and in every Playwright/Cypress test run, MSW
  intercepts requests to `app/api/*` (and to the Paystack checkout/webhook
  contract) and returns responses generated from `mocks/` data factories,
  matching each route's real response shape exactly.
- This means: building a feature always means building the real Drizzle
  query first, then adding an MSW handler with the matching shape for
  fast/offline development and deterministic tests — never the reverse.
- MSW must be fully excluded from production builds (dev/test-only
  dependency); `services/` code never imports from `mocks/` directly.

## Auth and Access Model

- The public website has no authentication — visitors browse content and
  submit forms (volunteer, partnership, contact, newsletter, donation)
  without an account.
- Staff authenticate through the app's auth layer to reach `/admin/*`.
  Roles are exactly those in `GGI-BRD.md` §3 / `GGI-PRD.md` §3:
  **Editor** and **Administrator**. Administrator additionally manages
  users/roles and site settings.
- Authorization is enforced server-side on every `/admin/*` route handler
  and server action — never client-side only. UI-level hiding of controls
  is a UX convenience, not a security boundary.
- Every state-changing admin action (content create/update/publish,
  submission status change, user/role change, settings change) must write
  an immutable audit log entry with actor, timestamp, and the change made,
  per `GGI-BRD.md` §6.7 (BR-20) and `GGI-PRD.md` FR-43.

## Invariants

1. Request handlers (route handlers/server actions) do not run long-lived
   background work; outbound email (SMTP) is dispatched best-effort and
   never blocks or fails the underlying workflow (a submission still saves
   even if the acknowledgement email fails to send).
2. No route handler or server action performs a mutation without first
   checking role-based authorization server-side on `/admin/*` paths.
3. Submission status transitions (volunteer applications, partnership
   requests, contact messages) follow the defined states exactly — New →
   In review → Accepted/Declined — no inventing additional statuses.
4. MSW and everything under `mocks/` are dev/test-only; they must never be
   bundled into or reachable from a production build, and no production
   code path may depend on `mocks/` to function.
5. No media binary is ever stored in the database; only metadata/URLs.
6. No component's failure to load data may crash or blank out the rest of
   the page (see graceful-degradation rules in `code-standards.md`).
7. Public-facing content entities (pillars, team, gallery, testimonials,
   challenge tags, advocacy content) are created and published only through
   authenticated admin/CMS routes (Editor/Administrator), via a Draft →
   Published workflow. There is no public write path to any of these
   entities — the public site only ever reads published content.
8. No raw payment/card data is ever stored. A donation record is written
   only from a signed, server-verified Paystack webhook, handled
   idempotently — a retried/duplicate webhook must never create a second
   donation record.