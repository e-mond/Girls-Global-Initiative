# GGI — Project Understanding Report

| | |
|---|---|
| **Phase** | 0 — Discovery |
| **Date** | 19 September 2026 |
| **Status** | Verified from repository evidence (docs + assets only; no application code yet) |

This document captures the **verified current understanding** of the Girls Global Initiative platform. It does not replace `GGI-BRD.md` or `GGI-PRD.md`.

---

## A. Project understanding

Girls Global Initiative (GGI) is a youth-led organisation advancing the rights, dignity, health, wellbeing and education of girls in rural, remote and underserved communities. It organises its work around four pillars: **Rights & Dignity**, **Health & Wellbeing**, **Confidence & Growth**, and **Mentorship & Opportunity**.

GGI needs:

1. A **public marketing website** that builds credibility and converts visitors into donors, volunteers/mentors, advocates and community partners.
2. An **admin back-office** so non-technical staff can manage content, submissions, newsletter subscribers and (read-only) donation records without developer involvement for routine updates.

**Repository state (verified):** The workspace contains documentation and brand assets only. There is **no** Next.js app, `package.json`, `app/`, `db/`, Docker config, tests, CI, or `.git` directory yet. BRD/PRD status is **Draft for review** (Founder sign-off pending).

---

## B. Target users

| Persona | Need |
|---|---|
| First-time visitors | Understand mission, origin, pillars, where GGI works |
| Donors (individual & institutional) | Trust + clear way to give (Paystack and/or org account details) |
| Volunteers / mentors | Low-friction application |
| Communities / schools / partners | Request GGI involvement |
| Newsletter subscribers | Opt in / unsubscribe (“Letters for her future”) |
| Editor (staff) | Content + submission review (no user management) |
| Administrator (staff) | Full back-office including users/roles and settings |
| Founder & Executive Director | Messaging/leadership content approval |

**Explicit non-users in Release 1.0:** No public applicant/donor accounts; no beneficiary case-management users.

---

## C. Core requirements

Summarised from BRD business objectives and PRD features:

- Credible public storytelling (mission, origin, founder, communities, four pillars).
- Fundraising via **Paystack** + display of organisation account details as direct-transfer fallback.
- Volunteer/mentor application workflow + staff status management + acknowledgement email.
- Partnership/community request workflow.
- Contact form (rate-limited).
- Newsletter signup (double opt-in) + unsubscribe + admin list/export.
- Advocacy landing (“Raise your voice”) with CMS-managed toolkit content.
- Admin CMS with Draft → Published, media library, RBAC (Editor / Administrator), audit logging.
- Safeguarding: no unapproved identifying information about minors; personal data purpose-limited; access/delete capability (BR-23).
- Performance: homepage interactive within ~3s on 3G-equivalent (hard constraint).
- Accessibility: WCAG 2.2 AA target.

---

## D. Website pages

**Public (from PRD §4):**

| Route | Purpose |
|---|---|
| `/` | Homepage (approved design reference) |
| `/our-story` | Expanded origin story |
| `/what-we-do` | Pillars overview |
| `/what-we-do/[pillar]` | Four pillar detail pages |
| `/founder` | Founder & leadership |
| `/team` | Meet the team |
| `/communities` | Where we work |
| `/get-involved` | Donate / Volunteer / Advocate hub |
| `/get-involved/donate` | Donation flow |
| `/get-involved/volunteer` | Volunteer application |
| `/get-involved/advocate` | Advocacy |
| `/partner` | Partnership request |
| `/contact` | Contact form |
| `/newsletter/unsubscribe` | Unsubscribe |

**Admin (auth required):** `/admin`, `/admin/login`, dashboard, content/*, submissions/*, donations, subscribers, users (Administrator), settings.

---

## E. Core features

1. **CMS-driven public content** — pillars, team, challenge tags, gallery, testimonials, advocacy, SEO metadata.
2. **Conversion forms** — donate, volunteer, partner, contact, newsletter.
3. **Paystack donations** — one-time live in Phase 1; monthly toggle captures intent; recurring billing Phase 2.
4. **SMTP transactional email** — acknowledgements, receipts, double opt-in / unsubscribe (SekoFund pattern).
5. **Staff auth + RBAC** — Auth.js/NextAuth; Editor vs Administrator.
6. **Submissions CRM-lite** — list/filter/status/CSV export.
7. **Media library** — object storage + metadata in DB; mandatory alt text.
8. **Audit log** — attributable state-changing admin actions.
9. **MSW** — offline/demo and test mocking at HTTP boundary (no parallel mock business layer).

---

## F. Technical architecture

| Layer | Approved choice |
|---|---|
| App | Next.js App Router (frontend + API in one deployable) |
| Language | TypeScript strict |
| UI | Tailwind + shadcn/ui; public may use bespoke marketing components on same tokens |
| Fonts | Red Hat Display / Red Hat Text |
| Validation | Zod at every external boundary |
| ORM / DB | Drizzle + Neon Postgres |
| Auth | Auth.js (NextAuth) — staff only |
| Email | SMTP (Nodemailer or equivalent) |
| Payments | Paystack (signed webhook, idempotent) |
| Media | S3-compatible private object storage + signed/CDN URLs |
| Containers | Docker + docker-compose |
| Unit tests | Playwright (component/unit-level) |
| E2E | Cypress |
| API mocking | MSW |

Folder boundaries: `app/`, `features/`, `components/`, `services/`, `mocks/`, `db/`, `hooks/`, `state/`, `types/`, `utils/`, `config/`, `tests/`, `assets/` — see `architecture.md`.

---

## G. Data model

Indicative entities (PRD §7.2 / architecture):

`users`, `pillars`, `team_members`, `challenge_tags`, `gallery_items`, `testimonials`, `advocacy_content`, `media_assets`, `volunteer_applications`, `partnership_requests`, `contact_messages`, `newsletter_subscribers`, `donations` (reference/status only — no card data), `audit_logs`.

Submission statuses: **New → In review → Accepted/Declined** (no invented statuses).

Content workflow: **Draft → Published** (public site reads published only).

---

## H. External integrations

| Integration | Status |
|---|---|
| Paystack | Decided; credentials not yet supplied |
| SMTP (SekoFund pattern) | Decided; host/credentials not yet supplied |
| S3-compatible object storage | Required; provider/bucket not yet specified in repo |
| Video (YouTube/Vimeo vs self-host) | Open |
| Error monitoring (e.g. Sentry) | Mentioned in PRD NFR; provider not locked |
| Domain `.org` | Confirmed intent; registrar/DNS handoff open |

---

## I. Design system

- **Palette:** Deep Navy `#041B4B` / `#041b4b`, Vivid Sky Blue `#00B0F2`, Magenta Pink `#E00286`; cream page background `#FDF6EC`.
- **Tokens:** CSS variables in `ui-context.md` (brand + semantic light/dark).
- **Reference:** Homepage mockup present as `GGIHomepage.png` (renamed from `RefenceImage.png` during Unit 1).
- **Logo:** `GGI LOGO.png` present (empowerment silhouette / lotus / navy–magenta–sky).
- **Patterns:** Floating image cards, challenge tag pills, navy brand bands, magenta primary CTAs, four coloured pillar cards, founder arch portrait, get-involved card trio, newsletter bar, structured footer.
- **Icons:** Lucide React.
- **Admin:** denser shadcn layout (sidebar + top bar); same tokens.

---

## J. Security considerations

- Public site unauthenticated; all `/admin` auth + role checks **server-side**.
- Rate-limit login, password reset, and all public forms.
- Zod validation; never trust client roles/IDs.
- Paystack webhook signature verification + idempotency.
- No raw card data; no media binaries in DB.
- Safe user-facing errors; no SQL/stack/secrets leakage.
- Media upload: size, MIME, file signature; generated filenames; alt text required.
- Safeguarding for imagery of minors via Draft → Published + offline consent assumption.
- Env fail-closed for production (DB / Paystack / SMTP) per roadmap Unit 8.

---

## K. Accessibility requirements

- WCAG 2.2 AA (verify pink/navy/cream combinations).
- Keyboard navigation, visible focus, semantic HTML, reduced motion.
- Mandatory image alt text in media library.
- Accessible multi-step volunteer form and video modal.

---

## L. SEO requirements

- Per-page title, description, Open Graph (CMS-configurable).
- Semantic HTML, clean URLs, sitemap/robots for public pages.
- Do not index `/admin` or private flows.

---

## M. Testing strategy

- Playwright: components, hooks, utils, validation.
- Cypress: donation, volunteer, partnership, admin login → edit → publish, RBAC denial.
- MSW for API/Paystack/SMTP contracts in tests and offline local dev.
- Security checks: unauthorised admin access, malformed input, rate limits, upload validation.
- Definition of Done includes loading/success/error/empty, lint, type-check, build.

---

## N. Deployment strategy

- Single containerised Next.js app (frontend + API together).
- Environments: local (Docker Compose ± Neon branch), staging, production.
- CI gate: lint → type-check → unit → integration → build → deploy.
- Health/ready endpoints planned in Unit 8.

**Current gap:** No Docker, CI, hosting target, or env templates exist yet.

---

## O. Known gaps

1. **No application codebase** — discovery-only repo.
2. **Not a Git repository** — no branch/commit history; Unit 1 must initialise Git (and likely remote) before feature-branch workflow can run.
3. **`project-overview.md` is incorrect** — file content is a duplicate/variant of agent instructions (`# AGENTS.md`), not a product overview. Workflow docs still point to it as the product “how” overview.
4. ~~**`GGIHomepage.png` missing**~~ — resolved: file renamed from `RefenceImage.png` during Unit 1.
5. **Paystack / SMTP / storage / DNS credentials** not in repo.
6. **Video hosting** undecided.
7. **Advocacy toolkit** content scope still “to be scoped further” in BRD BR-14 / PRD FR-26.
8. **KPI baselines** indicative only (BRD §8).
9. **BRD/PRD Founder sign-off** pending.
10. **Object storage provider** not named beyond “S3-compatible”.
11. **No `docs/ARCHITECTURE-DECISIONS.md` existed before Phase 0** (now created); decisions previously lived only in `progress-tracker.md`.

---

## P. Contradictions

| Conflict | Evidence | Resolution approach |
|---|---|---|
| **Stack in root `AGENTS.md` vs PRD/architecture** | ~~Stale stack (Framer / Google SMTP / SMSNotifyGH).~~ | Resolved in Unit 1: `AGENTS.md` aligned to PRD/architecture. |
| **Design reference filename** | ~~Disk was `RefenceImage.png`.~~ | Resolved in Unit 1: renamed to `GGIHomepage.png`. |
| **`project-overview.md` vs expected role** | Expected: product overview. Actual: agent operating instructions overlapping `AGENTS.md`. | Replace or rewrite `project-overview.md` with a real product overview (REQUIRES PRODUCT DECISION on whether to rewrite now or in Unit 1 docs hygiene). |
| **Workspace `AGENTS.md` reading order / stack** | Older scholarship-oriented stack remnants vs NGO website docs. | Align agent instructions to PRD before implementation to avoid agents following the wrong stack. |
| **Empty-state emoji in code-standards** | code-standards suggests celebratory emoji in empty states; user team brief advises avoiding emoji-heavy AI look. | Prefer calm, human empty-state copy without emoji unless brand explicitly wants it. |

None of these block documenting Phase 0; the **stale `AGENTS.md` stack** must be resolved before Foundations implementation proceeds under conflicting instructions.

---

## Q. Open decisions

| ID | Topic | Status |
|---|---|---|
| OQ-1 | SMTP host/credentials (SekoFund reuse) | Open — use generic `SMTP_*` env names |
| OQ-2 | Video: YouTube/Vimeo vs self-host | Open |
| OQ-3 | Domain registrar / DNS handoff | Open |
| OQ-4 | Paystack credentials | Open — MSW until available |
| OQ-5 | Object storage provider/bucket | Open |
| OQ-6 | Rename `RefenceImage.png` → `GGIHomepage.png`? | Resolved — renamed in Unit 1 |
| OQ-7 | Fix/replace miswritten `project-overview.md` | REQUIRES PRODUCT DECISION |
| OQ-8 | Align stale `AGENTS.md` stack with PRD | REQUIRES PRODUCT DECISION (recommended: yes, before Unit 1 code) |
| OQ-9 | Advocacy toolkit Phase 1 depth | Partially open (BR-14) |
| OQ-10 | Initialise Git + remote before Unit 1? | REQUIRES PRODUCT DECISION (workflow assumes Git) |

---

## R. Recommended implementation phases

Aligned with `progress-tracker.md` roadmap (not inventing new product scope):

| Phase | Unit | Focus |
|---|---|---|
| 0 | Discovery | This report; contradictions; open questions |
| 1 | Foundations | Scaffold Next.js/TS/Tailwind/shadcn, Docker, Drizzle skeleton, MSW, layouts, brand tokens, validation scripts, Git init |
| 2 | Public Website | Static/CMS-read pages from IA; mock-backed content |
| 3 | Admin Back-Office Core | Auth.js, RBAC, CMS CRUD, media library |
| 4 | Submission Workflows | Volunteer, partnership, contact + SMTP ack |
| 5 | Newsletter | Double opt-in, unsubscribe, admin list/export |
| 6 | Donations (Paystack) | Checkout, webhook, org account details, admin read-only |
| 7 | Users, Settings & Audit | Admin users, settings, audit UI |
| 8 | Production Readiness | Env fail-closed, health checks, deploy runbook |

**Recurring Paystack subscriptions** remain post-MVP (PRD §12), outside Units 1–8.

---

## Verification notes

| Check | Result |
|---|---|
| Docs present | `AGENTS.md`, `GGI-BRD.md`, `GGI-PRD.md`, `architecture.md`, `code-standards.md`, `ui-context.md`, `ai-workflow-rules.md`, `progress-tracker.md`, `project-overview.md` (miscontent) |
| Design reference pixels inspected | `GGIHomepage.png` (formerly `RefenceImage.png`) — yes |
| Logo inspected | `GGI LOGO.png` — yes |
| Application source | Scaffolded in Unit 1 Foundations |
| Git | Initialised in Unit 1 |
| `GGIHomepage.png` | Present |
