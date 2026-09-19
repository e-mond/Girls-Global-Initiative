# Product Requirements Document (PRD)
## Girls Global Initiative — Website, Admin Back-Office & Platform

| | |
|---|---|
| **Document version** | 1.0 |
| **Status** | Draft for review |
| **Date** | 18 September 2026 |
| **Companion document** | GGI Business Requirements Document (BRD) v1.0 |

---

## 1. Overview

This PRD translates the GGI BRD into concrete product features, technical architecture and design requirements for a public marketing website with donation, volunteer, partnership and newsletter capture, plus an authenticated **Admin/Back-Office** for staff.

**In this phase:**
- Public website (marketing + conversion)
- Admin/Back-Office (content, submissions, users)
- Supporting integrations (payments, email, media)

---

## 2. Goals & Non-Goals

**Goals**
- Ship a fast, accessible, mobile-first public site matching the approved homepage design.
- Give non-technical staff full control of routine content via the back-office.
- Capture and route donations, volunteer applications, partnership requests, contact messages and newsletter signups reliably and securely.
- Build on an architecture that a small team can operate and maintain long-term.

**Non-Goals (Phase 1)**
- Donor CRM / recurring donation lifecycle management beyond capture + receipt.
- Multi-language UI (data model should not block it later).
- Native mobile apps.
- Beneficiary/case-management systems for girls served by GGI programmes.

---

## 3. User Roles

| Role | Description | Access |
|---|---|---|
| **Visitor** (public) | Any unauthenticated site visitor | Public pages, forms |
| **Donor** | Visitor completing a donation | Donation flow, receipt |
| **Applicant** (volunteer/mentor) | Visitor submitting an application | Application form, confirmation |
| **Partner contact** | Community/school/local leader | Partnership request form |
| **Editor** (staff) | Manages content, reviews submissions | Back-office: content, submissions (no user management) |
| **Administrator** (staff) | Full back-office control | Back-office: content, submissions, users/roles, settings |

Authorisation is enforced **server-side** for every back-office operation; role checks are never enforced only in the UI (see §9.4).

---

## 4. Information Architecture

```
/                         Home
/our-story                Origin story (expanded)
/what-we-do               Pillars overview
/what-we-do/[pillar]      Rights & Dignity | Health & Wellbeing | Confidence & Growth | Mentorship & Opportunity
/founder                  Founder & leadership
/team                     Meet the team
/communities              Where we work
/get-involved             Donate | Volunteer | Raise your voice (hub)
/get-involved/donate      Donation flow
/get-involved/volunteer   Volunteer/mentor application
/get-involved/advocate    Advocacy / raise your voice
/partner                  Community/partnership request
/contact                  Contact form
/newsletter/unsubscribe   Unsubscribe confirmation

/admin                    Back-office (auth required)
/admin/login
/admin/dashboard
/admin/content/*          Pillars, team, testimonials, community stories, tags/stats
/admin/submissions/*      Volunteer applications, partnership requests, contact messages
/admin/donations          Donation record (read-only view of processor data GGI is permitted to store)
/admin/subscribers        Newsletter subscriber management
/admin/users              User & role management (Administrator only)
/admin/settings           Site settings (CTAs, social links, footer, etc.)
```

---

## 5. Public Website — Feature Requirements

### 5.1 Global
- FR-1: Responsive header with primary nav, "Contact us" and "Support a girl" CTA; mobile hamburger menu.
- FR-2: Global footer with nav, social links, contact email, newsletter reference.
- FR-3: All CMS-driven text/images sourced from the back-office (§6), not hard-coded, for the fields listed in BRD §6.7.
- FR-4: SEO metadata (title, description, Open Graph image) configurable per page from the back-office.

### 5.2 Home
- FR-5: Hero with headline, sub-copy, two CTAs ("Join our mission" → `/get-involved`, "Our story in 2 min" → video modal).
- FR-6: Video modal component (self-hosted or embedded, lazy-loaded so it doesn't affect initial page weight).
- FR-7: Pillar strip (4 items) linking to `/what-we-do/[pillar]`.
- FR-8: Origin section with CMS-managed "challenge tags" (Poverty, Early pregnancy, etc.) and Vision/Mission cards.
- FR-9: "What we do" 4-card grid, each CMS-editable (icon, title, description, colour, link).
- FR-10: Founder spotlight block — CMS-editable quote, bio, 3 value callouts, CTAs ("A message from Philomena", "Meet the team").
- FR-11: "Where we work" gallery — CMS-managed image set with captions; "Is your community next?" CTA card linking to `/partner`.
- FR-12: "Get involved" 3-card set (Donate, Volunteer, Advocate) linking to respective flows.
- FR-13: Newsletter signup (single email field, inline validation, success/error state).

### 5.3 Donation Flow (`/get-involved/donate`)
- FR-14: Amount selection (preset + custom amount) with a frequency toggle (One-time / Monthly — monthly captured as intent in Phase 1, billed from Phase 2 per §12).
- FR-15: Donor details (name, email; anonymous option).
- FR-16: Checkout via **Paystack** (hosted/embedded); the page also displays GGI's organisation account details as a direct-transfer alternative for donors who prefer not to use card/mobile-money checkout.
- FR-17: Confirmation page + emailed receipt on success; clear failure state with retry on decline/error.
- FR-18: Idempotent handling of the Paystack webhook (signature-verified) so a retried/duplicate webhook cannot create two donation records (see Technology Guardrails §2.16).

### 5.4 Volunteer / Mentor Application (`/get-involved/volunteer`)
- FR-19: Multi-step form (progressive disclosure): contact details → availability/skills/interest area → review & submit.
- FR-20: Client- and server-side validation; inline field errors; disabled submit until valid.
- FR-21: Confirmation screen + acknowledgement email.
- FR-22: Submission stored and visible in `/admin/submissions/volunteer` with a status (New, In review, Accepted, Declined).

### 5.5 Partnership / Community Request (`/partner`)
- FR-23: Form capturing requester name, role, organisation/community, location, message.
- FR-24: Confirmation + acknowledgement email.
- FR-25: Submission stored and visible in `/admin/submissions/partnerships` with status tracking.

### 5.6 Advocacy ("Raise your voice")
- FR-26: Landing page with shareable content/toolkit (CMS-managed) and social share actions.

### 5.7 Contact
- FR-27: Standard contact form (name, email, subject, message); rate-limited to prevent abuse.
- FR-28: Submission stored and visible in `/admin/submissions/contact`.

### 5.8 Newsletter
- FR-29: Single-field signup with double opt-in (send confirmation email) to protect deliverability and consent.
- FR-30: One-click unsubscribe link in every email, honoured immediately.

---

## 6. Admin / Back-Office — Feature Requirements

### 6.1 Authentication & Access
- FR-31: Staff login with secure session management (see §9 Security).
- FR-32: Role-based access: **Administrator** and **Editor** (§3). Route- and API-level enforcement.
- FR-33: Password reset flow with rate limiting.

### 6.2 Dashboard
- FR-34: Landing view summarising recent submissions (volunteer, partnership, contact), new subscribers, and recent donations count — each section independently loading with its own loading/error/empty state (graceful degradation, per Engineering Standards §15).

### 6.3 Content Management
- FR-35: CRUD for the four **Pillars** (title, description, icon, colour, order, detail-page content).
- FR-36: CRUD for **Team members** (name, role, photo, bio, order) incl. the Founder spotlight fields (quote, 3 value callouts).
- FR-37: CRUD for **Challenge tags** shown in the origin section.
- FR-38: CRUD for **Community/gallery items** (image, caption, location, order) used in "Where we work."
- FR-39: CRUD for **Quotes/testimonials**.
- FR-40: CRUD for **Advocacy toolkit** content.
- FR-41: Media library: upload, preview, replace, delete images; validated on upload (§9.5); alt-text field mandatory for accessibility.
- FR-42: Draft/Published state for content items, so edits can be prepared before going live.
- FR-43: Basic audit log of who created/edited/published each content item and when.

### 6.4 Submissions Management
- FR-44: List, filter and search volunteer applications, partnership requests and contact messages.
- FR-45: Status updates per submission (e.g., New → In review → Accepted/Declined) with the change attributed and timestamped.
- FR-46: Export submissions (CSV) with server-side pagination/limits — no unbounded export.

### 6.5 Donations (read view)
- FR-47: Read-only list of donation records synced from Paystack (amount, date, donor name/email if provided, status). No raw card data is ever stored or displayed — GGI never has PCI-scope data (see §9.2).

### 6.6 Subscribers
- FR-48: List/search newsletter subscribers; manual add/remove by staff; export (CSV, paginated); unsubscribed users clearly flagged, never silently deleted from the audit trail.

### 6.7 Users & Settings (Administrator only)
- FR-49: Invite/manage staff users and their roles.
- FR-50: Manage global site settings: social links, footer contact email, default SEO metadata, CTA destinations.

---

## 7. Technical Architecture

| Layer | Choice | Notes |
|---|---|---|
| Language | TypeScript (strict mode) | No `any` without documented reason |
| Frontend framework | Next.js (App Router) | Also used for backend API routes/route handlers |
| Styling | Tailwind CSS | Utility-first, design tokens for GGI brand colours |
| UI components | shadcn/ui | Used across back-office; public site may use bespoke components built on the same primitives for on-brand marketing design |
| Fonts | Red Hat Display / Red Hat Text | Self-hosted or loaded via Google Fonts per performance budget |
| Validation | Zod | Applied at every external boundary — forms, API route handlers, webhooks |
| ORM | Drizzle ORM | Type-safe schema, migrations |
| Database | Neon Postgres (serverless Postgres) | Not publicly reachable outside the app's connection path |
| Backend API | Next.js App Router route handlers | Thin handlers; business logic in a service layer |
| Auth (back-office) | Mature session-based auth (e.g., Auth.js/NextAuth or equivalent) with secure, HTTP-only cookies | No custom cryptography |
| File/media storage | Private object storage (e.g., S3-compatible) with signed URLs | Public site only ever receives a scoped, temporary or CDN-served URL |
| Deployment | Single Next.js application (App Router) for both frontend and API — no separate backend service | Simplest architecture that satisfies requirements (Engineering Standards §2.25); one deployable unit |
| Containerisation | Docker | Consistent dev/staging/prod parity; the same Next.js app is containerised for staging/production |
| Unit testing | Playwright (component/unit-level where applicable) | Per requirement |
| Integration/E2E testing | Cypress | Critical user journeys (donation, volunteer application, admin login/edit) |
| CI/CD | Lint → type-check → unit tests → integration tests → build → deploy | Production build/tests must pass to deploy |

### 7.1 High-Level Architecture

```
Browser (Next.js pages, public + /admin)
        │
        ▼
Next.js App Router route handlers  ──────►  Service/domain layer
        │                                          │
        ▼                                          ▼
   Zod validation                          Drizzle ORM ──► Neon Postgres
        │                                          │
        ▼                                          ▼
 Auth/session check (admin routes)         Private object storage (media)
        │
        ▼
 Payment processor / Email provider (external, called server-side only)
```

### 7.2 Data Model (indicative — refined during implementation)

- `users` (staff accounts, roles)
- `pillars`
- `team_members`
- `challenge_tags`
- `gallery_items`
- `testimonials`
- `advocacy_content`
- `media_assets`
- `volunteer_applications`
- `partnership_requests`
- `contact_messages`
- `newsletter_subscribers`
- `donations` (synced reference data only — no card data)
- `audit_logs`

Each submission/content table includes standard audit columns (`created_at`, `updated_at`, `created_by`/`updated_by` where applicable) and appropriate foreign keys/constraints per Engineering Standards §3.

### 7.3 Environments

- Local (Docker Compose: single Next.js app + Postgres, or app pointed at a Neon branch DB)
- Staging (mirrors production; used for QA and Cypress E2E)
- Production — one containerised Next.js app (frontend + API routes together) deployed as a single unit; no split frontend/backend deployment

---

## 8. Integrations

### 8.1 Email
- Transactional email (application/partnership/contact acknowledgements, newsletter double opt-in/unsubscribe) via **SMTP**, following the same integration pattern already used in SekoFund (e.g., Nodemailer against an SMTP relay), rather than a new transactional-email vendor.
- SMTP credentials/host supplied via environment variables only (Technology Guardrails §2.8) — never hard-coded.
- Deliverability caveat: SMTP-based sending doesn't give the bounce/open tracking a dedicated provider (Resend/SendGrid/Postmark) would; acceptable for Phase 1 volume, worth revisiting if newsletter volume grows.
- Newsletter broadcast ("Letters for her future") uses the same SMTP integration for Phase 1.

### 8.2 Payments — Paystack
- **Processor: Paystack**, chosen for Ghana-based NGO donation support.
- One-time donations live from Phase 1; monthly recurring billed from Phase 2 (§12).
- GGI's backend never touches raw card data; checkout is hosted/embedded from Paystack, and outcomes are confirmed via a signed webhook (verified server-side before any donation record is written).
- The donate page also displays GGI's organisation account details (bank/mobile money) as a direct-transfer alternative, so donations aren't blocked if Paystack onboarding is delayed.

### 8.3 Video
- "Our story in 2 min" and founder message hosted on YouTube/Vimeo (unlisted) or self-hosted via the object storage/CDN, lazy-loaded to protect performance budget.

---

## 9. Non-Functional Requirements

### 9.1 Input & Data Validation
- All form and API input validated server-side with Zod, regardless of client-side validation already performed.
- File uploads (media library) validated by size, MIME type and file signature — never trusted by extension alone; stored with generated filenames outside any executable path.

### 9.2 Data Protection & Privacy
- No card/payment data stored by GGI's systems.
- Personal data (donor, applicant, partner contact, subscriber) collected only for its stated purpose; GGI can fulfil an access/delete request (BRD BR-23).
- No sensitive data in logs, error messages, URLs or client-side code.
- Imagery/content involving minors goes through the Draft → Published workflow (FR-42) so nothing is publicly exposed without explicit staff approval.

### 9.3 Database
- Neon Postgres kept out of direct public reach; access only via the application's pooled connection.
- Drizzle migrations for all schema changes — no manual production schema edits.
- Foreign keys/constraints reflect real business rules (e.g., a submission status can only move through valid states).
- Transactions used for any multi-step write (e.g., recording a donation + updating aggregate stats).

### 9.4 Authentication & Authorisation
- Back-office session management with secure, HTTP-only cookies, session expiry, and CSRF protection.
- Every `/admin` API route re-checks authentication and role server-side — UI role checks are a convenience, never the security boundary.
- Rate limiting on login, password reset, and all public form submissions (donation, volunteer, partner, contact, newsletter) to prevent abuse.

### 9.5 Error Handling
- Centralised exception handling; users see safe, actionable messages (e.g., "We couldn't submit your application — please try again," never a raw database error).
- Technical detail logged internally with a request/reference ID; never surfaced to the client.

### 9.6 Performance
- Given GGI's audience includes rural/low-bandwidth users, performance is a hard requirement:
  - Homepage interactive within ~3s on a throttled 3G-equivalent connection.
  - Images optimised/responsive (`next/image`), lazy-loaded below the fold.
  - Code-splitting; admin bundle never shipped to public pages.
  - CDN delivery for static assets and media.

### 9.7 Accessibility
- WCAG 2.2 AA colour contrast across the pink/navy/cream brand palette (verify particularly the pink-on-cream and navy-on-navy combinations from the design).
- Full keyboard navigation and visible focus states, including the video modal and multi-step volunteer form.
- Semantic HTML and ARIA only where semantic HTML is insufficient.
- Respect `prefers-reduced-motion` for any animated elements (badges, hover states).

### 9.8 Reliability & Resilience
- Each homepage/back-office section fails gracefully and independently (e.g., if the gallery fails to load, the rest of the page still renders) per Engineering Standards §15.
- Idempotent handling of payment webhooks and form re-submissions (no duplicate donations/applications on retry).

### 9.9 Observability
- Structured logging for API routes, with request IDs.
- Error monitoring (e.g., Sentry or equivalent) for both public site and back-office.
- Health check endpoint for uptime monitoring.

---

## 10. Design Considerations

- **Design system**: Formalise the homepage's existing visual language into reusable Tailwind theme tokens using GGI's confirmed brand palette:

| Name | Hex | Usage |
|---|---|---|
| Deep Navy | `#041b4b` | Primary brand colour — header, footer, dark section backgrounds, primary text on light backgrounds |
| Vivid Sky Blue | `#00b0f2` | Secondary/accent — links, secondary CTAs, highlight accents |
| Magenta Pink | `#e00286` | Accent/CTA — primary buttons ("Support a girl", "Donate & support"), highlight badges |

  Pair these with the warm cream/off-white backgrounds and soft pastel section tints already present in the approved design, and verify all navy-on-cream, pink-on-cream and white-on-navy/pink combinations against WCAG 2.2 AA contrast (§9.7) before finalising button and text-on-colour styles. Map these tokens into the shared Tailwind theme config so marketing pages and the shadcn/ui-based back-office draw from the same palette (back-office can use a simpler, denser variant).
- **Brand assets — provided by GGI**: The GGI logo, and UI/image references for design direction, will be supplied by GGI/the founder as source material. Design and component work should use these as the reference rather than the developer originating brand identity from scratch; final asset formats (logo — SVG/PNG variants; reference images) to be confirmed once received.
- **Typography**: Red Hat Display for headings, Red Hat Text for body copy, per the specified font family; define a type scale (H1–H6, body, caption) once rather than per-page.
- **Imagery**: Consistent treatment for photography (rounded corners, floating info-card pattern used in the hero and origin sections) — build as a reusable `ImageWithCaptionCard` component rather than bespoke per page.
- **CTAs**: Establish clear primary (filled pink/navy) vs secondary (outline) button styles and use consistently; avoid introducing new button styles ad hoc (Jakob's Law).
- **Forms**: Multi-step pattern for the volunteer application (Hick's Law — reduce visible decisions per step); single-field simplicity preserved for the newsletter signup.
- **States**: Every list/table in the back-office (submissions, subscribers, content) needs defined loading (skeleton), empty, error and success states before it's considered complete — not just the happy path.
- **Responsive**: Mobile-first; validate the floating-card hero layout and the 4-pillar grid collapse gracefully on small screens; back-office tables scroll horizontally rather than break layout.
- **Back-office UX**: Use shadcn/ui data-table, form and dialog primitives directly rather than custom-building equivalents, to keep the admin experience consistent and keyboard-accessible.

---

## 11. Testing Strategy

| Layer | Tool | Coverage |
|---|---|---|
| Unit | Playwright (component-level) | Validation logic, utility functions, isolated UI components |
| Integration | Cypress | API route behaviour, form submission → DB → admin visibility flows |
| End-to-end | Cypress | Donation happy path + failure, volunteer application, partnership request, admin login → content edit → publish, role-restricted access attempts |
| Security | Manual + automated checks | Unauthorised `/admin` access, cross-user data access, invalid/malformed input, rate limit verification, file upload validation |

All critical journeys are tested beyond the happy path: invalid input, missing fields, boundary conditions, duplicate/rapid resubmission, and unauthorised access attempts, per the Engineering Standards Definition of Done.

---

## 12. Recurring Donations — Decision

Recommendation: **launch one-time donations via Paystack in Phase 1; add recurring billing in Phase 2.**

- The donate page (FR-14/15) includes a One-time / Monthly toggle from Phase 1; one-time donations process live through Paystack, monthly is captured as intent.
- Recurring billing (Paystack subscription creation, retries on failed charges, cancellation self-service) is built in Phase 2 — recurring billing has real edge cases (failed renewals, proration, cancellation) worth handling as a dedicated increment rather than bundling into initial launch.
- Rationale: gets live, working donations to GGI as early as possible without the added complexity/testing surface of subscription billing on day one.

## 13. Release Plan (Indicative Phasing)

**Phase 1 — MVP**
Public site (all sections per BRD scope), live one-time donations via Paystack + org account details displayed, volunteer + partnership + contact forms (SMTP email), newsletter signup, admin back-office (content, submissions, subscribers, users).

**Phase 2 (recurring donations)**
Monthly recurring donations via Paystack, donation records/reporting in back-office populated from Paystack.

**Phase 3 (further, budget/time permitting)**
Richer analytics dashboard, advocacy toolkit expansion, multi-language content support, donor-facing account/history, upgrade from SMTP to a dedicated transactional-email provider if volume warrants it.

---

## 14. Open Questions

1. ~~Final choice of payment processor for Ghana-based donations.~~ — Resolved: Paystack, with GGI's organisation account details shown as a direct-transfer alternative (§8.2).
2. ~~Final choice of transactional/newsletter email provider.~~ — Resolved: SMTP, per the SekoFund pattern (§8.1).
3. Whether video content is self-hosted or embedded from YouTube/Vimeo.
4. ~~Recurring donations in Phase 1 or deferred to Phase 2.~~ — Resolved: one-time live via Paystack in Phase 1, recurring billing in Phase 2 (§12).
5. ~~Confirmation of hosting/deployment target.~~ — Resolved: single containerised Next.js app, frontend + API together (§7).
6. SMTP provider/host to reuse from SekoFund — confirm exact credentials/relay so environment variables can be set up per environment.
7. Domain: GGI has confirmed a `.org` registration (see Project Brief §10.1) — confirm exact registrar/DNS handoff once purchased.

---

## 15. Definition of Done (applies to every feature in this PRD)

A feature is complete only when it: meets the functional requirement; validates input server-side; enforces authorisation server-side; handles errors safely without leaking internals; implements loading/success/error/empty states; is responsive and accessible; performs acceptably on a constrained network; is covered by Playwright/Cypress tests beyond the happy path; passes the production build; and is committed with a traceable Git history.
