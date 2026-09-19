# Girls Global Initiative — Website & Admin Back-Office Platform

## Overview

A web platform for **Girls Global Initiative (GGI)**, a youth-led organisation in
Ghana advancing the rights, dignity, health, wellbeing and education of girls in
rural, remote and underserved communities. The platform replaces GGI's reliance on
informal, in-person outreach with a digital one: a public-facing site that builds
trust, tells GGI's story, and converts visitors into donors, volunteers/mentors,
community partners and newsletter subscribers — plus an authenticated admin
back-office that lets non-technical staff run day-to-day content and submission
management without developer involvement.

Primary users: site visitors and donors, volunteer/mentor applicants, community
and school partner contacts, GGI programme/communications staff (Editors), the
Administrator, and the Founder & Executive Director, Philomena Ofori Larbi.

Source of truth for requirements: `GGI-BRD.md` (v1.0) and `GGI-PRD.md` (v1.0).
Where this file and the BRD/PRD conflict on **process/requirements**, the BRD
wins. Where they conflict on **technology stack**, this file and `architecture.md`
win (see Architecture Decisions in `progress-tracker.md`).

## Goals

1. Give GGI a credible, professional digital presence that builds trust with
   donors, volunteers and institutional partners.
2. Grow donations, volunteer/mentor applications, community partnership
   requests, and newsletter subscribers.
3. Give GGI staff full control of routine content (pillars, team, gallery,
   quotes, challenge tags) and submission review, without a developer.
4. Enforce accountable, auditable workflows — every status change and content
   publish traceable to a user, a timestamp, and (where relevant) a rationale.
5. Ship an MVP that is fully usable end-to-end — public site plus back-office —
   on mock data before Paystack and SMTP credentials are wired in, with live
   Paystack donations and SMTP-based notifications following once credentials
   are supplied.

## Core User Flow

1. A visitor lands on the public site and learns GGI's mission via
   Home / Our story / What we do (4 pillars) / Founder & Team / Communities.
2. The visitor chooses a path: **Donate**, **Volunteer/mentor**, **Partner**
   (community/school), **Subscribe** to the newsletter, or **Contact** GGI.
3. **Donate**: visitor selects an amount and frequency (one-time live via
   Paystack in Phase 1; monthly recurring in Phase 2), or uses GGI's displayed
   organisation account details for a direct transfer; receives a confirmation
   and, once checkout is live, an emailed receipt.
4. **Volunteer / Partner / Contact**: visitor completes a short, validated
   form; the submission is stored and the visitor receives an acknowledgement
   email (SMTP).
5. GGI staff (Editor/Administrator) log into the back-office, review new
   submissions, and move each through a status (New → In review →
   Accepted/Declined).
6. Staff manage content — pillars, team/founder spotlight, gallery, quotes,
   challenge tags — through a Draft → Published workflow so nothing involving
   named individuals or imagery goes live without explicit approval.
7. The Administrator manages staff users/roles and site settings; every
   status change and content publish is attributed and timestamped.
8. Newsletter subscribers receive "Letters for her future" via SMTP and can
   unsubscribe at any time; unsubscribes are honoured immediately, not
   silently deleted from the record.

## Features (by module — see `GGI-BRD.md` §6 and `GGI-PRD.md` §5–6 for full FR list)

### Public Website
- Home, Our story, What we do (4 pillar detail pages), Founder, Team,
  Communities/Where we work, Get involved (Donate / Volunteer / Advocate),
  Partner, Contact, Newsletter unsubscribe.
- Content-managed by non-technical staff via the back-office (pillars, team,
  gallery, quotes, challenge tags, advocacy toolkit, SEO metadata).

### Donation Flow
- One-time donations live via **Paystack**; monthly toggle captured as intent
  in Phase 1, billed from Phase 2.
- GGI's organisation account details displayed as a direct-transfer
  alternative.
- Signed, idempotent webhook handling — no duplicate donation records on
  retry; no raw card data ever stored by GGI.

### Admin Back-Office
- Dashboard summarising recent submissions, subscribers, and donations, each
  section independently loading/erroring (graceful degradation).
- Content management (CRUD + Draft/Published state) for pillars, team,
  challenge tags, gallery, testimonials, advocacy content, media library.
- Submissions management (volunteer applications, partnership requests,
  contact messages) with filter/search, status updates, and CSV export
  (paginated, no unbounded export).
- Donations (read-only view synced from Paystack).
- Subscriber management (search, manual add/remove, export, unsubscribe
  status preserved for audit).
- User & role management (Administrator only) and site settings.
- Audit log of who created/edited/published/changed status, and when.

### Notifications
- SMTP-based transactional email (volunteer/partnership/contact
  acknowledgements, donation receipts, newsletter double opt-in and
  unsubscribe), following the SekoFund SMTP integration pattern.

## Scope

### In Scope (Release 1.0)
Public marketing website (all sections above), Paystack donation flow plus
organisation account details, volunteer/partnership/contact forms, newsletter
signup with double opt-in, admin back-office (content, submissions, donations
view, subscribers, users/roles, settings), audit logging, responsive design,
accessibility and performance appropriate to a rural/low-bandwidth audience.

### Out of Scope (Release 1.0)
Native mobile app, donor CRM / full recurring-giving lifecycle beyond
Phase-2 monthly billing, multi-language UI, beneficiary/case-management
systems for girls served by GGI programmes, AI-assisted features, live chat.

## Success Criteria

1. A visitor can complete a donation via Paystack — or use the displayed
   organisation account details — without needing to contact GGI staff
   directly.
2. Every submission status change and content publish action produces an
   immutable, attributable audit log entry.
3. GGI staff can update pillar, team, gallery, and quote content and see it
   live without developer involvement.
4. The full application is usable end-to-end (public site + back-office)
   against mock data with no live Paystack/SMTP credentials required, and
   mock data is cleanly excluded from production builds.
5. `npm run lint`, `npm run type-check`, unit tests (Playwright), integration
   tests (Cypress), and `npm run build` all pass before any unit is marked
   done.