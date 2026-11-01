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

## ADR-009 — PDF text extraction with mandatory admin review

**DECISION:** Extract report content from source PDFs with `pdf-parse` (Node-only admin routes/scripts), structure into GGI markdown sections, require `needs_review` → `approved` before publish, and keep `attachment_url` as the immutable source reference.

**CONTEXT:** Uploaded/linked PDFs carry programme facts but must not dictate public branding or layout.

**PROBLEM:** Embedding or screenshotting source PDFs fights brand consistency; free-form paste loses completeness; Workers Free cannot run heavy OCR safely.

**OPTIONS CONSIDERED:** iframe/embed source PDF; server OCR pipeline; manual-only CMS entry; extract text layer + admin review.

**SELECTED APPROACH:** `PDFParse.getText` (+ best-effort tables) → `structure-from-text` → draft with extraction status → admin Reports workspace → approve/publish gate. Branded online page + client `jspdf` (ADR-008) render reviewed content.

**RATIONALE:** Preserves facts without inventing copy; keeps heavy parsing off the Edge path; enforces human approval.

**TRADE-OFFS:** Scanned PDFs without a text layer need offline OCR; embedded images are not yet re-hosted into the branded layout.

**IMPACT:** `pdf-parse`; migration `0013_report_extraction`; `/api/admin/reports/extract|approve`; docs `REPORT-PDF-EXTRACTION.md`.

---

## ADR-008 — Client-side branded programme report PDFs

**DECISION:** Generate full programme-report PDFs in the browser with `jspdf`, using GGI navy/magenta/sky branding. Keep original source PDFs in admin storage only (`attachment_url`) — never as a public download.

**CONTEXT:** Reports need a shareable full-text PDF; Cloudflare Workers is a poor host for Node PDF libraries (pdfkit).

**PROBLEM:** Server-side PDF generation is runtime-fragile on Workers and would couple reports to one host.

**OPTIONS CONSIDERED:** pdfkit API route; static-only PDFs; client `jspdf`.

**SELECTED APPROACH:** Shared report components + client `jspdf` “Download the Full Report”; proofread body stored in CMS; `attachmentUrl` retained for admin verification/regeneration only.

**RATIONALE:** Works on Cloudflare and Node hosts; keeps secrets off the client path; staff control content via Admin → Reports; visitors see one official GGI document format online and as PDF.

**TRADE-OFFS:** PDF layout is simpler than desktop publishing; fonts are standard PDF fonts unless extended later.

**IMPACT:** Dependency `jspdf`; `/reports` public routes; `news_posts.kind` / `attachment_url` columns; shared Markdown rendering.

## ADR-009 — Content and programme status model

**DECISION:** Extend `content_status` with `scheduled` and `archived`. Add explicit event `programme_status` (`scheduled` | `cancelled` | `postponed`) with optional revised date and public status note. Derive upcoming/past from confirmed dates in `Africa/Accra` only when programme status remains `scheduled`.

**CONTEXT:** Public News/Events need clear groupings; cancellation/postponement must never be inferred.

**SELECTED APPROACH:** Migration `0014_content_programme_status`; public visibility helpers; admin filters and confirmation dialogs.

**TRADE-OFFS:** Scheduled go-live depends on `published_at` comparison at request time (no separate cron).

---

## ADR-007 — Hosting portability after Error 1102

**DECISION:** Keep Cloudflare Workers + OpenNext as the *current* production host until a verified Node preview exists and the owner approves cutover. Treat standard Node (`next build` / `next start`), Vercel, and Docker standalone as first-class alternatives. Optimise request-path cost (published SQL filters, settings memoisation, deferred SMTP) before raising Workers limits or migrating.

**CONTEXT:** Intermittent Cloudflare Error 1102 on girlsglobalinitiative.org; Free Workers cannot set `cpu_ms`; Nodemailer + multi-query SSR are expensive in isolates.

**PROBLEM:** Blanking the public site under resource limits without inventing a root cause or forcing an untested migration.

**OPTIONS CONSIDERED:**
1. Stay on CF Free and hope
2. Workers Paid CPU limit only
3. Optimise app + retain CF until evidence justifies host change
4. Immediate cutover to Vercel/Docker

**SELECTED APPROACH:** Option 3 now; prepare Option 4 docs (`docs/NODE-DEPLOYMENT.md`) without live cutover.

**RATIONALE:** Evidence session could not reproduce 1102 or access CF metrics; code paths clearly waste Worker budget. Paid CPU does not fix memory. Application logic must stay host-agnostic.

**TRADE-OFFS:** Two deploy paths until cutover; CF remains operationally fragile on Free.

**IMPACT:** Migration `0011` indexes; `queueAcknowledgementEmail`; portable Node docs; no production DNS change in this unit.

**Source:** `docs/ERROR-1102-INVESTIGATION.md`.

---

## Pending decisions (not yet ADRs)

See `docs/PROJECT-UNDERSTANDING.md` §Q and `progress-tracker.md` → Open Questions (SMTP details, video hosting, DNS, Paystack credentials, object storage provider, doc/filename hygiene, Git init). Owner decision: retain Cloudflare (Paid + mitigations) vs migrate to Vercel/Docker after preview verification.
