# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **Phase 0 — Discovery complete.** Repository inspected; documentation
  reviewed; design reference and logo inspected. Application not yet
  scaffolded. Git not initialised.

## Current Goal

- Obtain project-owner confirmation on **Unit 1 (Foundations)** scope
  (and resolution of blocking doc contradictions) before any application
  code is written, per `AGENTS.md` §16 / session protocol.

## Completed

- **Phase 0 — Project Discovery**
  - Inspected repository: documentation + `RefenceImage.png` +
    `GGI LOGO.png` only; no app source, no `package.json`, no `.git`.
  - Read BRD, PRD, architecture, code-standards, ui-context,
    ai-workflow-rules, progress tracker; inspected design reference
    pixels and logo.
  - Produced `docs/PROJECT-UNDERSTANDING.md`.
  - Produced `docs/ARCHITECTURE-DECISIONS.md` (ADR-001–007 from existing
    approved decisions).

## In Progress

- Awaiting project-owner confirmation to begin Unit 1 (Foundations).

## Next Up — Development Roadmap

1. **Foundations** — Next.js App Router + TypeScript scaffold, Tailwind +
   shadcn/ui setup, Docker/docker-compose, Drizzle skeleton + Neon
   connection, MSW wiring, base layout shells (public + `/admin`), GGI
   brand tokens and Red Hat fonts wired into `ui-context.md`'s design
   system, validation scripts (`lint`, `type-check`, `test`, `build`).
   Also requires Git initialisation (repo currently has no `.git`) and
   recommended alignment of stale `AGENTS.md` stack with PRD before code.
2. **Public Website (static/CMS-read)** — Home, Our story, What we do
   (4 pillar detail pages), Founder, Team, Communities/Where we work,
   Contact page shell; content read from the CMS entities (mock-backed
   until Unit 3 ships real writes).
3. **Admin Back-Office Core** — Auth.js sign-in for staff, Editor/
   Administrator RBAC, `/admin` dashboard shell, content management CRUD +
   Draft/Published workflow for pillars, team, gallery, testimonials,
   challenge tags, advocacy content; media library uploads.
4. **Submission Workflows** — public volunteer application, partnership
   request, and contact forms (validated, rate-limited); admin submissions
   list/detail/status-update (New → In review → Accepted/Declined); SMTP
   acknowledgement emails.
5. **Newsletter** — public signup with double opt-in, unsubscribe flow,
   admin subscriber list/search/export.
6. **Donations (Paystack)** — donate page (amount, one-time/monthly
   toggle), Paystack checkout, signed/idempotent webhook handling, org
   account details displayed as a direct-transfer alternative, admin
   read-only donations view.
7. **Users, Settings & Audit** — Administrator-only staff user/role
   management, site settings (social links, footer contact, default SEO,
   CTA destinations), audit log UI.
8. **Production Readiness** — env fail-closed checks (Paystack/SMTP/DB),
   health/ready endpoints, Docker Compose healthcheck, deployment runbook.

Recurring-donation billing (monthly Paystack subscriptions) is Phase 2 per
`GGI-PRD.md` §12 and is not part of the Unit 1–8 roadmap above.

## Open Questions

- **SMTP relay/host details:** GGI has said email will follow the SekoFund
  SMTP pattern, but the actual host/credentials have not been supplied yet.
  Environment variables should be named generically (`SMTP_HOST`,
  `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`) so they can be filled in without
  a code change.
- **Video hosting:** Not yet decided whether the "Our story in 2 min" /
  founder-message videos are self-hosted or embedded from YouTube/Vimeo
  (`GGI-PRD.md` §14, item 3).
- **Domain / DNS:** GGI has confirmed a `.org` registration (Project Brief
  §10.1); exact registrar/DNS handoff details are not yet available.
- **Paystack account credentials:** Not yet supplied by GGI; donation
  checkout is built against the mock/MSW contract until they arrive.
- **Object storage provider:** S3-compatible storage is required; concrete
  provider/bucket not specified in the repository.
- **Design reference filename:** Docs refer to `GGIHomepage.png`; the file
  on disk is `RefenceImage.png`. Rename vs doc update —
  **REQUIRES PRODUCT DECISION**.
- **`project-overview.md` content:** File currently contains agent
  instructions (AGENTS-style), not a product overview. Rewrite vs leave —
  **REQUIRES PRODUCT DECISION**.
- **Stale `AGENTS.md` stack:** Root `AGENTS.md` still lists Framer Motion,
  Google SMTP, and SMSNotifyGH, which conflict with `GGI-PRD.md` /
  `architecture.md` (Paystack, SMTP SekoFund pattern, no SMS). Align before
  Unit 1 code — **REQUIRES PRODUCT DECISION** (recommended: align to PRD).
- **Git initialisation:** Workspace is not a Git repository. Feature-branch
  workflow cannot run until `git init` (+ remote) —
  **REQUIRES PRODUCT DECISION** on when/how to initialise.
- **Brand logo and additional design references:** Logo (`GGI LOGO.png`)
  and homepage reference (`RefenceImage.png`) are present; additional UI
  image packs may still arrive from GGI.

## Architecture Decisions

- See durable records in `docs/ARCHITECTURE-DECISIONS.md` (ADR-001–007).
- **Payment processor — Paystack:** Chosen for Ghana-based NGO donation
  support. GGI's organisation account details are also displayed on the
  donate page as a direct-transfer alternative. No raw card data is ever
  stored; donation records are written only from a signed, server-verified
  webhook. Source: `GGI-PRD.md` §8.2, Project Brief §6.
- **Recurring donations — phased:** One-time donations live via Paystack
  from the start; the donate form includes a One-time/Monthly toggle from
  the first release, but monthly billing (subscription creation, retries,
  cancellation) is a later increment, not part of the initial roadmap.
  Source: `GGI-PRD.md` §12.
- **Email — SMTP (SekoFund pattern):** Transactional email uses SMTP
  (Nodemailer or equivalent) rather than a dedicated transactional-email
  vendor, matching the pattern already used on the SekoFund project.
  Source: `GGI-PRD.md` §8.1.
- **Deployment — single full-stack Next.js app:** Frontend and API live in
  one Next.js App Router application, containerised with Docker; no
  separate backend service. Source: `GGI-PRD.md` §7, Project Brief §6.
- **No applicant/donor accounts in Release 1.0:** Volunteer, partnership,
  and contact submissions are anonymous form submissions reviewed by staff
  in the back-office — there is no public sign-in, and no per-visitor
  dashboard. This is a deliberate scope boundary, not an oversight; do not
  add a public auth flow without an explicit Architecture Decision.
- **Brand palette:** Deep Navy `#041b4b`, Vivid Sky Blue `#00b0f2`, Magenta
  Pink `#e00286`; Red Hat Display/Text typography. Source: `GGI-PRD.md`
  §10, Project Brief §6.
- **Brand assets:** Logo and homepage design reference are present
  (`GGI LOGO.png`, `RefenceImage.png`). Docs that cite `GGIHomepage.png`
  should be updated once naming is decided.
- **Domain:** `.org` registration, billed separately from the development
  cost (Project Brief §10.1).
- **No PDF/XLSX/DOCX generation in Release 1.0:** Unlike a scholarship/
  award-letter platform, GGI's back-office needs are met by CSV export
  alone (submissions, subscribers). Do not add a document-generation
  library without an explicit Architecture Decision.
- **MSW mocking strategy:** Real Drizzle-backed handlers first; MSW at HTTP
  boundary for offline/demo/tests; excluded from production builds.

## Session Notes

- **2026-09-19 — Phase 0 Discovery:** Confirmed docs-only workspace.
  Inspected `RefenceImage.png` (homepage mockup) and `GGI LOGO.png`.
  Recorded contradictions (stale `AGENTS.md` stack; misnamed
  `project-overview.md`; `GGIHomepage.png` vs `RefenceImage.png`).
  Created `docs/PROJECT-UNDERSTANDING.md` and
  `docs/ARCHITECTURE-DECISIONS.md`. No application code written.
  Next action: owner confirmation on Unit 1 Foundations scope +
  doc/Git decisions above.
