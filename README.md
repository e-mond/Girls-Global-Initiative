# Girls Global Initiative

Official website and digital platform for **Girls Global Initiative (GGI)**, a youth-led organisation advancing the rights, dignity, health, wellbeing and potential of girls in rural, remote and underserved communities.

This repository contains the public website visitors use to learn about GGI’s work and get involved, and a protected staff workspace for day-to-day content and operational management.

---

## About Girls Global Initiative

Girls Global Initiative (GGI) is a youth-led organisation focused exclusively on advancing the rights, dignity, health, wellbeing and potential of girls, particularly girls living in rural, remote and underserved communities.

The organisation was born from a heartfelt conversation between two young women who recognised the challenges confronting girls in their communities — including poverty, early pregnancy, school dropout, limited opportunities, menstrual health challenges, and the absence of adequate guidance and support systems. That conversation gave birth to an initiative centred on girls’ empowerment, education and advocacy.

GGI began as **YMK Foundation** (You Must Know Foundation), where the founders conducted school tours, engaged girls in conversations around self-worth and confidence, provided sanitary items, and created safe spaces for girls to speak openly. **In December 2024, the organisation evolved into Girls Global Initiative**, reflecting a clearer commitment to girls and to communities where girls face significant barriers.

### Vision

A world where every girl, regardless of her location or background, has the rights, knowledge, health, support and opportunities to reach her full potential and make informed decisions about her life.

### Mission

To educate, empower and support girls in rural, remote and underserved communities by advancing their rights, promoting their health and wellbeing, strengthening their confidence and physical development, and connecting them to mentorship, guidance and opportunities that can shape better futures.

### Purpose

GGI exists to ensure that girls are not limited by poverty, geography, gender-based barriers, early pregnancy or marriage, poor support systems, or lack of opportunity. Its purpose is to provide girls with the knowledge, resources, support and opportunities necessary to become confident, informed, healthy and capable young women who can determine the direction of their own lives.

### Core values

Empowerment · Inclusion · Equality · Dignity · Integrity · Collaboration · Courage

Organisational copy used on the site is drawn from GGI’s approved brand and content sources. The platform does not invent impact numbers, beneficiary counts, partnerships, awards, or other unverified claims.

---

## What the platform provides

### Public website

Visitor-facing pages currently include:

- Homepage (story, pillars, founder spotlight, communities, news, events, get involved, newsletter)
- Our Story
- What We Do and four pillar detail pages
- Programmes and Impact
- Founder and Team
- Communities / Where We Work
- Gallery, News, and Events
- Get Involved (donate, volunteer, advocate)
- Partner and Contact
- Newsletter confirm and unsubscribe flows

### Staff administration

Authorised GGI staff sign in to a protected back-office to manage:

- Dashboard (operational overview and attention items)
- Content (pillars, team, gallery, news, events, testimonials, advocacy, challenge tags)
- Media library
- Submissions (volunteer, partnership, contact) with status workflow
- Donations (Paystack-synced records; no card data stored)
- Newsletter subscribers
- Staff users and roles (Administrator / Editor)
- Site settings
- Audit log

Access to protected routes and APIs is enforced server-side. Hiding a sidebar link is not authorisation.

---

## Staff administration

The workspace uses **Auth.js (NextAuth)** credentials authentication for staff accounts.

- **Administrator** — full access including users, settings, and audits
- **Editor** — content, media, submissions, donations, and subscribers

Sessions are terminated via Auth.js `signOut`, available from the sidebar and the top navigation account menu. After logout, protected admin routes redirect to staff sign-in.

Content follows a **draft → published** workflow for CMS entities. Only published items appear on the public site. State-changing actions write to an immutable audit log where required.

---

## Design and user experience

The product shares GGI brand tokens, Red Hat typography, and Lucide icons across public and admin surfaces, with different intents:

| Surface | Character |
| --- | --- |
| Public website | Human, editorial, photography-led storytelling |
| Admin workspace | Clear, calm, operational, efficient |

Brand colours include Deep Navy (`#041b4b`), Vivid Sky Blue (`#00b0f2`), and Magenta Pink (`#e00286`) on warm cream and soft pastel atmospheres. Layouts are responsive from small mobile through large desktop. The admin sidebar collapses to icon-only navigation with accessible labels; complex tables become stacked cards on narrow viewports.

---

## Technology stack

Verified against this repository:

| Area | Technology |
| --- | --- |
| App framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui button foundation |
| Icons | Lucide React |
| Motion | Framer Motion (respects reduced motion) |
| Database | Neon Postgres via Drizzle ORM |
| Auth | Auth.js / NextAuth (staff back-office) |
| Validation | Zod |
| Email | Nodemailer / SMTP (SekoFund-style env vars) |
| Donations | Paystack (hosted checkout + signed webhook) |
| Media | Local metadata storage; Cloudinary env prepared |
| Mocking | MSW at the HTTP boundary for offline/dev |
| Tests | Playwright (`npm run test`), Cypress (`npm run test:e2e`) |
| Containers | Docker / Docker Compose |

---

## Repository structure

```text
app/
  (public)/          Public marketing pages
  admin/             Staff login + authenticated shell
  api/               Route handlers (admin, donations, newsletter, submissions)
components/          Shared UI (public, admin, home, layout, motion)
content/             Approved site copy and contact/social constants
db/                  Drizzle schema and migrations
features/            Domain services (content, donations, governance, …)
mocks/               MSW handlers for offline demos
public/              Static assets (brand, home imagery, team photos)
scripts/             Seed utilities (e.g. staff admin seed)
tests/               Playwright unit/smoke specs
cypress/             End-to-end smoke
docs/                Deployment runbook and project understanding
```

Supporting project docs live at the repository root (`project-overview.md`, `GGI-BRD.md`, `GGI-PRD.md`, `architecture.md`, `ui-context.md`, `progress-tracker.md`).

---

## Content management

Staff manage CMS entities through the admin Content area. Items are stored as **draft** or **published**. Public pages read only published records when the database is available.

When Neon is unset or unreachable, public surfaces may show clearly labelled placeholders or fall back to MSW so the product remains demoable offline. Placeholder copy must not be mistaken for live production content.

Approved narrative for the public site is maintained in `content/site-copy.ts` (sourced from GGI’s content reference). Do not invent organisational facts to fill gaps.

---

## Security

Principles enforced in the current implementation:

- Server-side authentication and authorisation for admin routes and APIs
- Role checks (Administrator vs Editor) on privileged operations
- Zod validation on public and admin inputs
- Rate limiting on sensitive public and password-reset endpoints
- Signed Paystack webhook verification (no raw card data stored)
- Safe, non-technical error messages to end users
- Audit logging for significant state changes
- Secrets via environment variables only (never committed)

Do not commit `.env.local`, API keys, passwords, or production credentials.

---

## Accessibility

The project aims for **WCAG 2.2 AA**-aligned behaviour:

- Keyboard navigation and visible focus
- Semantic headings and landmarks
- Labelled controls and icon-only buttons with accessible names
- Accessible dialogs and navigation drawers
- Colour contrast within the brand system (status is not colour-only)
- `prefers-reduced-motion` support for Framer Motion reveals

---

## Responsive design

Public and admin layouts target mobile, tablet, laptop, and large desktop widths. The admin shell uses a mobile drawer (not a shrunk desktop sidebar). Tables and filters wrap or convert to cards on small screens to avoid accidental horizontal page scrolling.

---

## Local development

```bash
git clone <repository-url>
cd GGI

npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

With `NEXT_PUBLIC_ENABLE_MSW=true` (default in `.env.example`), the app can run without live Neon, Paystack, or SMTP. For a database-backed local setup, set `DATABASE_URL`, run migrations, and optionally seed a staff user:

```bash
npm run db:migrate
npm run db:seed-admin
```

Staff sign-in: `/admin/login` (seed defaults use `AUTH_DEV_*` from `.env.example` when those values are configured).

---

## Environment variables

See `.env.example` for the full list. High-level groups:

| Group | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection |
| `AUTH_SECRET` / `AUTH_URL` | Auth.js session configuration |
| `AUTH_DEV_*` | Local bootstrap staff account (dev) |
| `SMTP_*` | Transactional email |
| `PAYSTACK_*` | Donation checkout and webhook verification |
| `ORG_*` | Direct-transfer details on the donate page |
| `CLOUDINARY_*` | Media library (credentials pending) |
| `NEXT_PUBLIC_ENABLE_MSW` / `NEXT_PUBLIC_MOCK_API` | Offline mock behaviour |

Never put real secrets in the README or commit them to Git.

---

## Database

- **PostgreSQL** on Neon
- **Drizzle ORM** schema in `db/schema.ts`
- Migrations in `db/migrations/`

```bash
npm run db:generate   # create migration from schema changes
npm run db:migrate    # apply migrations
npm run db:seed-admin # create first administrator when needed
```

Treat production migration commands with care. Prefer applying migrations in a controlled deploy step.

---

## Testing

```bash
npm run lint          # ESLint
npm run type-check    # TypeScript (tsc --noEmit)
npm run test          # Playwright unit/smoke
npm run test:e2e      # Cypress end-to-end smoke
npm run build         # Production build
```

---

## Build and deployment

1. Install dependencies (`npm install`)
2. Configure production environment variables (see `.env.example` and `docs/DEPLOYMENT-RUNBOOK.md`)
3. Apply database migrations (`npm run db:migrate`)
4. Seed an administrator if none exists (`npm run db:seed-admin`)
5. Build (`npm run build`) and start (`npm run start`), or use the provided Docker Compose setup
6. Verify `/api/health` and `/api/ready`; confirm Paystack webhook and SMTP if those features are live
7. Ensure MSW is disabled in production (`NEXT_PUBLIC_ENABLE_MSW=false`)

Docker files (`Dockerfile`, `docker-compose.yml`) are included for containerised deployment. Confirm the target host with GGI before go-live.

---

## Content principles

Public claims must remain accurate and attributable. Do not fabricate:

- impact numbers or beneficiary counts
- programme outcomes, awards, or partnerships
- testimonials or donor figures
- event dates, venues, or attendance unless approved

Use approved GGI sources (`content reference.md` / brand materials) and CMS-published content.

---

## Project status

### Completed

- Public site foundations, brand system, and content pages
- Staff authentication, RBAC, CMS, media, submissions, newsletter, donations, users/settings/audit
- Production readiness probes and deployment runbook
- Public UI revamp (nav, heroes, gallery/news/events, motion)
- Admin workspace UI revamp (shell, icons, logout, notifications, page polish)

### In progress / pending credentials

- Live Paystack / SMTP / Cloudinary credentials from GGI
- Production DNS and hosting handoff
- Seeding and publishing live CMS content (news, events, gallery)

### Planned

- Features only when approved in BRD/PRD and tracked in `progress-tracker.md`
- Monthly recurring billing (Phase 2 intent already captured on donations)

Track day-to-day implementation status in `progress-tracker.md`.

---

## Development notes

- Work on `feature/<unit-slug>` branches; keep commits focused and meaningful
- Prefer small, verifiable increments aligned to `progress-tracker.md`
- Run lint, type-check, tests, and build before merging
- Do not commit secrets, `.env.local`, or build artefacts (`.next/`)
- Do not invent product behaviour outside BRD/PRD and approved docs
- Update documentation when architecture or IA changes
- Do not add personal attribution or developer branding to project artefacts

---

## Ownership

This is an organisational project for Girls Global Initiative. No open-source licence is declared in this repository unless GGI explicitly adds one.
