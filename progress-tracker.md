# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **Unit 1 — Foundations complete** on branch `feature/foundations`.
  Application scaffolded; public + admin layout shells; Drizzle/MSW/Docker/
  Playwright/Cypress foundations in place.

## Current Goal

- Begin **Unit 2 — Public Website (static/CMS-read)** after Foundations is
  committed/pushed per project workflow (push only when owner requests).

## Completed

- **Phase 0 — Project Discovery**
  - Docs review, `docs/PROJECT-UNDERSTANDING.md`,
    `docs/ARCHITECTURE-DECISIONS.md`.
- **Unit 1 — Foundations**
  - Git initialised (`main` + `feature/foundations`).
  - Renamed `RefenceImage.png` → `GGIHomepage.png`.
  - Aligned `AGENTS.md` stack to PRD/architecture.
  - Next.js App Router + TypeScript + Tailwind + shadcn-style Button.
  - Brand tokens + Red Hat Display/Text + JetBrains Mono.
  - Public header/footer shells + IA stub routes.
  - Admin shell (sidebar/topbar) + login placeholder (no Auth.js yet).
  - Drizzle schema skeleton + Neon client (null-safe without `DATABASE_URL`).
  - MSW handlers/browser/server stubs + health API.
  - Docker + docker-compose, `.env.example`.
  - Playwright unit/smoke + Cypress smoke.

## In Progress

_None._

## Next Up — Development Roadmap

1. ~~**Foundations**~~ — **Done** (this unit).
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

- **SMTP relay/host details:** Use generic `SMTP_*` env names until
  credentials arrive.
- **Video hosting:** YouTube/Vimeo vs self-host still open (`GGI-PRD.md` §14).
- **Domain / DNS:** `.org` intent confirmed; registrar/DNS handoff open.
- **Paystack account credentials:** Not yet supplied; MSW until available.
- **Object storage provider:** S3-compatible required; provider/bucket open.
- ~~Design reference filename~~ — Resolved: `GGIHomepage.png`.
- ~~`project-overview.md` content~~ — Resolved by owner before Unit 1.
- ~~Stale `AGENTS.md` stack~~ — Resolved in Unit 1.
- ~~Git initialisation~~ — Resolved in Unit 1.

## Architecture Decisions

- See `docs/ARCHITECTURE-DECISIONS.md` (ADR-001–007).
- **Payment processor — Paystack**, deferred recurring billing, SMTP
  SekoFund pattern, single Next.js deployable, staff-only auth, MSW at HTTP
  boundary, brand palette + Red Hat fonts, CSV-only exports — unchanged.

## Session Notes

- **2026-09-19 — Unit 1 Foundations**
  - Branch: `feature/foundations`
  - Validation:
    - `npm run lint` — PASS
    - `npm run type-check` — PASS
    - `npm run test` (Playwright) — PASS (2 tests)
    - `npm run test:e2e` (Cypress) — PASS (1 spec)
    - `npm run build` — PASS (Next.js 15.5.9)
  - Assumptions: Admin routes are scaffolded without Auth.js enforcement
    until Unit 3; homepage is a branded shell only (full design Unit 2).
  - Next: Unit 2 Public Website after commit/push per owner instruction.
