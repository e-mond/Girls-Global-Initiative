# Architecture Decisions

Significant architectural decisions for the Girls Global Initiative platform.

Format:

```text
DECISION
CONTEXT
PROBLEM
OPTIONS CONSIDERED
SELECTED APPROACH
RATIONALE
TRADE-OFFS
IMPACT
```

Decisions also summarised in `progress-tracker.md`. Prefer updating this file for durable ADR-style records.

---

## ADR-001 — Single full-stack Next.js application

**DECISION:** Ship one Next.js App Router application for public UI, admin UI, and API route handlers. No separate backend service.

**CONTEXT:** PRD §7 / Project Brief; small team; NGO marketing + back-office scope.

**PROBLEM:** Need a maintainable architecture that supports SSR/SEO for marketing pages and authenticated admin APIs without operational complexity.

**OPTIONS CONSIDERED:**
1. Separate frontend + Nest/Express API
2. Single Next.js App Router app
3. Static site + headless CMS SaaS only

**SELECTED APPROACH:** Option 2 — single containerised Next.js app.

**RATIONALE:** Matches approved stack; one deployable unit; App Router covers pages + route handlers; reduces infra surface for a small team.

**TRADE-OFFS:** Backend scaling is coupled to the Next.js process; long-running jobs must stay out of request handlers (architecture invariant 1).

**IMPACT:** Docker image wraps the Next.js app; CI deploys one artefact; folder boundaries in `architecture.md` apply.

**Source:** `GGI-PRD.md` §7; `progress-tracker.md` Architecture Decisions.

---

## ADR-002 — Paystack for donations (one-time first)

**DECISION:** Use Paystack for donation checkout. Persist donation records only from signed, server-verified, idempotent webhooks. Never store raw card data. Display organisation account details as a direct-transfer alternative. Monthly toggle exists in Phase 1 as intent; recurring billing is Phase 2.

**CONTEXT:** Ghana-based NGO fundraising; BRD BR-4–BR-6; PRD §8.2, §12.

**PROBLEM:** Accept donations securely without PCI scope and without blocking gifts if processor onboarding lags.

**OPTIONS CONSIDERED:**
1. Paystack only
2. Other processors (Flutterwave, Stripe, etc.)
3. Bank/mobile-money details only (no processor)

**SELECTED APPROACH:** Paystack + org account details fallback; deferred subscription billing.

**RATIONALE:** Processor fit for Ghana; fallback protects fundraising continuity; deferred recurring reduces launch risk.

**TRADE-OFFS:** Monthly donors cannot complete automated recurring charges until Phase 2; intent must be communicated clearly in UI.

**IMPACT:** Webhook route, signature verification, idempotency keys, MSW Paystack contract, env `PAYSTACK_*`.

**Source:** `GGI-PRD.md` §8.2, §12.

---

## ADR-003 — SMTP email (SekoFund pattern)

**DECISION:** Transactional and Phase 1 newsletter email via SMTP (Nodemailer or equivalent), credentials from environment only.

**CONTEXT:** Existing SekoFund integration pattern; PRD §8.1.

**PROBLEM:** Need acknowledgements, receipts, double opt-in without introducing a new vendor prematurely.

**OPTIONS CONSIDERED:**
1. Dedicated transactional provider (Resend/SendGrid/Postmark)
2. SMTP relay (SekoFund pattern)
3. No email in Phase 1

**SELECTED APPROACH:** Option 2.

**RATIONALE:** Consistency with known pattern; sufficient for Phase 1 volume; env-driven host swap without code change.

**TRADE-OFFS:** Weaker bounce/open tracking; deliverability may need revisit at scale.

**IMPACT:** Generic `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`; email failure must not fail saved submissions (architecture invariant 1).

**Source:** `GGI-PRD.md` §8.1.

---

## ADR-004 — Staff-only authentication; no public accounts in Release 1.0

**DECISION:** Authenticate only staff (Editor / Administrator) for `/admin`. Public visitors submit forms without accounts. No donor/applicant dashboards in Release 1.0.

**CONTEXT:** BRD/PRD role model; conversion-focused public site.

**PROBLEM:** Avoid building unnecessary identity systems while still securing the back-office.

**OPTIONS CONSIDERED:**
1. Public accounts for donors/applicants
2. Staff-only auth
3. Fully CMS-hosted third-party admin only

**SELECTED APPROACH:** Option 2 with Auth.js (NextAuth) over Drizzle sessions/cookies.

**RATIONALE:** Matches BRD scope; reduces attack surface and product complexity.

**TRADE-OFFS:** Donors cannot view gift history in-app; applicants cannot track status online (email/staff follow-up only).

**IMPACT:** Do not add public auth without a new ADR.

**Source:** `architecture.md` Auth model; `progress-tracker.md`.

---

## ADR-005 — MSW at HTTP boundary; real Drizzle handlers first

**DECISION:** Implement real `app/api/*` + Drizzle from the start. Use MSW to intercept HTTP for offline local dev and Playwright/Cypress. Exclude MSW from production builds. No parallel in-app “mock service” business layer.

**CONTEXT:** Need demoability without Neon/Paystack/SMTP; deterministic tests.

**PROBLEM:** Avoid dual code paths that drift from production behaviour.

**OPTIONS CONSIDERED:**
1. In-app mock services switching via flags
2. MSW at network boundary
3. Live services required for all local work

**SELECTED APPROACH:** Option 2.

**RATIONALE:** Single real handler implementation; mocks mirror contracts only.

**TRADE-OFFS:** Handlers must be kept in sync with MSW fixtures deliberately.

**IMPACT:** `mocks/` layout; production build must not import `mocks/`.

**Source:** `architecture.md` Mocking Strategy.

---

## ADR-006 — Brand system and typography

**DECISION:** Brand palette Deep Navy / Vivid Sky Blue / Magenta Pink; Red Hat Display + Red Hat Text; design tokens in `ui-context.md`. Logo and homepage reference supplied by GGI (`GGI LOGO.png`, `GGIHomepage.png`).

**CONTEXT:** Confirmed brand in BRD/PRD §10.

**PROBLEM:** Consistent marketing + admin UI without inventing a second visual identity.

**OPTIONS CONSIDERED:** N/A — brand confirmed by organisation.

**SELECTED APPROACH:** Tokenised Tailwind theme shared by public and admin (admin denser).

**RATIONALE:** Authentic GGI identity; WCAG verification required on pink/navy/cream.

**TRADE-OFFS:** Some brand colour text combinations may need treatment adjustments for AA contrast.

**IMPACT:** Foundations unit wires tokens and fonts; no competing palettes per page.

**Source:** `GGI-PRD.md` §10; `ui-context.md`.

---

## ADR-007 — CSV export only (no document generation) in Release 1.0

**DECISION:** Submissions and subscriber exports are CSV only. Do not add PDF/XLSX/DOCX generation libraries without a new ADR.

**CONTEXT:** Back-office needs vs scholarship-style platforms.

**PROBLEM:** Avoid unnecessary dependency and attack surface.

**OPTIONS CONSIDERED:** PDF/XLSX libraries vs CSV helpers.

**SELECTED APPROACH:** CSV helpers under `features/exports/csv.ts`.

**RATIONALE:** Meets BRD/PRD export needs; simpler security/ops profile.

**TRADE-OFFS:** Staff cannot generate styled PDF letters from the app in Release 1.0.

**IMPACT:** Stack freeze for document engines until revisited.

**Source:** `architecture.md`; `progress-tracker.md`.

---

## Pending decisions (not yet ADRs)

See `docs/PROJECT-UNDERSTANDING.md` §Q and `progress-tracker.md` → Open Questions (SMTP details, video hosting, DNS, Paystack credentials, object storage provider, doc/filename hygiene, Git init).
