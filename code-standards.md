# Code Standards

## General

- Keep modules small and single-purpose; a file that mixes UI, data fetching,
  and business logic should be split.
- Fix root causes. Do not patch symptoms with workarounds, timeouts, or
  retries that mask an underlying bug.
- Do not mix unrelated concerns in one component, route, or commit.
- Every non-trivial function, component, and route handler must have a
  clear, professional comment (or JSDoc block) explaining *why*, not just
  *what* — the "what" should be readable from the code itself.
- No commented-out dead code, no TODOs without a corresponding entry in
  `progress-tracker.md` → Open Questions.

## TypeScript

- Strict mode is required throughout the project (`strict: true`).
- No `any`. Use explicit interfaces/types, or `unknown` + narrowing at
  system boundaries (API responses, form input, env vars).
- Validate all unknown external input (API request bodies, query params,
  env vars, third-party responses — including Paystack webhook payloads)
  with a schema validator before trusting it.
- Prefer types inferred from the Drizzle schema (`db/schema.ts`) over
  hand-written duplicate types for the same entity.

## Next.js (App Router)

- Default to server components. Add `"use client"` only where browser
  interactivity (state, effects, event handlers) is required.
- Route handlers in `app/api/*` stay focused on one responsibility: parse/
  validate input → authorize → call a `services/` or `db/` function →
  shape the response. No business logic inline in the handler.
- Use server actions for form mutations where it avoids an unnecessary
  client round trip; still validate and authorize server-side regardless.
- Use route-based code splitting and lazy-load non-critical client
  components (the donation modal, rich editors, media library, admin
  charts) via `next/dynamic`.

## Styling & Components

- Use CSS custom property tokens defined in `ui-context.md` — the GGI brand
  palette (Deep Navy `#041b4b`, Vivid Sky Blue `#00b0f2`, Magenta Pink
  `#e00286`) and Red Hat fonts — no hardcoded hex values anywhere in
  components.
- Build UI from shadcn/ui primitives (`components/ui/*`); do not hand-roll
  a component (button, dialog, dropdown, table, form field) that shadcn
  already provides.
- Follow the border radius scale and layout patterns defined in
  `ui-context.md`.

## API Routes / Server Actions

- Validate and parse request input before any logic runs.
- Enforce authentication and role-based authorization before any read of
  sensitive data or any mutation (public routes: none required; `/admin/*`
  routes: Editor or Administrator).
- Return consistent, predictable response shapes: `{ data }` on success,
  `{ error: { message, code } }` on failure — never leak stack traces,
  SQL/Drizzle errors, or internal IDs in the response body (see §UX below).
- Verify the Paystack webhook signature before processing it, and handle it
  idempotently — a retried/duplicate webhook must never create a second
  donation record.
- Paginate any endpoint that can return more than ~50 records (submissions,
  subscribers, donations).

## Data and Storage

- Metadata belongs in Neon Postgres via Drizzle.
- Uploaded media (gallery images, team photos, media library assets) belong
  in object/file storage, outside the public web root; the database stores
  only references.
- Do not store large binary or generated content directly in the database.
- Never store raw payment/card data — Paystack checkout is hosted/embedded;
  only the reference/status returned by Paystack is persisted.
- All Drizzle schema changes go through a migration — never hand-edit the
  database out of band.

## Git & Commit Workflow

- Each implementation unit (one feature/section from `progress-tracker.md`)
  is developed on its own branch, named `feature/<unit-slug>`
  (e.g. `feature/volunteer-application-form`).
- Commit at meaningful checkpoints within a unit, with clear, imperative
  commit messages (e.g. `Add draft-save endpoint for volunteer applications`),
  not a single squash-everything commit at the end.
- A unit is only merged once it passes the "Before Moving to the Next Unit"
  checklist in `ai-workflow-rules.md`.
- Do not combine two unrelated feature units on the same branch.

## Testing

- **Playwright (unit level)**: components, hooks, utilities, validation
  logic, and state management. Every new component with logic (not pure
  markup) gets a corresponding test.
- **Cypress (integration/E2E)**: full feature workflows (e.g. donate via
  Paystack end to end, submit-and-review a volunteer/partnership
  application, CMS publish flow), navigation, loading/empty/error state
  rendering, and auth/role gating on `/admin/*`.
- **Mocking**: use MSW (`mocks/handlers/*`) to intercept `app/api/*` calls
  in both test layers and in local dev without a live Neon connection or
  live Paystack/SMTP credentials — tests must not depend on a live database
  or live third-party services. Never build a parallel mock code path
  inside application code; the real Drizzle-backed route handler is what
  MSW's handler shape must match (see `architecture.md` → Mocking Strategy).
- When a route's real logic is a Drizzle aggregate query (e.g. back-office
  submission counts or donation totals), write that query first — the MSW
  handler is a fixture that mirrors its output shape, not a substitute for
  writing it.
- A feature is not "done" until both test layers pass for it.

## File Organization

- `app/` — routes, layouts, `app/api/*` route handlers.
- `features/<domain>/` — components, hooks, and logic scoped to one
  business domain (e.g. `features/donations/`, `features/submissions/`,
  `features/content/`).
- `components/ui/` — shadcn-generated primitives (protected).
- `components/` — shared, feature-agnostic components.
- `services/` — API client + mock service layer.
- `db/` — Drizzle schema, migrations, client.
- `mocks/` — mock data factories (dev/test only, excluded from prod build).
- `hooks/`, `state/`, `types/`, `utils/`, `config/`, `assets/`, `tests/` —
  as described in `architecture.md`.

---

## UX, Error Handling & Performance Standards

These are binding acceptance criteria for every feature, not aspirational
guidance. A feature is not "done" until it satisfies the checklist at the
bottom of this section.

### Loading States
- Use skeleton loaders (matching final layout, subtle shimmer) for
  dashboard cards, tables, lists, submissions, subscriber lists, and
  donation records — never a blank white screen for a large section.
- Buttons that trigger a contained action (login, submit, save, approve,
  reject, delete, donate, subscribe) must swap their label for a
  spinner/loading state and be disabled for the duration — never allow
  double submission (critical for the donation flow).
- If an operation is expected to take longer than ~500ms, show a rotating,
  reassuring status message ("Preparing your dashboard…", "Confirming your
  donation…").
- File uploads (media library), CSV exports (submissions, subscribers), and
  other long-running processes get a real progress indicator (percentage
  and/or remaining steps), not just a spinner.

### Success States
- Every successful action gives feedback: inline confirmation, a subtle
  success banner, an animated checkmark, a button state change, or (for
  non-critical confirmations only) a toast. Avoid stacking multiple
  success popups for one action.

### Error States
- Every error message tells the user three things: what happened, why (in
  plain language), and what to do next.
- Never surface SQL errors, stack traces, Drizzle/Postgres errors,
  constraint names, internal IDs, Paystack API errors, or any backend
  implementation detail to the user. Log the technical detail server-side;
  show a clear, human message client-side.
- Placement rules:
  - **Inline** (beneath the affected field) for form/validation errors.
  - **Modal** only when the user must act before continuing (session
    expired, irreversible deletion, donation/payment failure) — always
    with a clear way forward.
  - **Toast** only for small, non-critical confirmations or background
    updates — never for errors the user must not miss.
- Every failure state offers a next step: Retry, Try Again, Refresh,
  Contact Support, or Return to Dashboard, as appropriate.

### Forms
- Disable submit until required fields are valid, and state *why* it's
  disabled ("Add a valid email address.", "Choose a donation amount.").
- Validate inline, as the user types — not only on submit.
- Show live character counts wherever a limit exists (e.g. contact message).
- Prefill known user data (name, email, prior selections) — never make the
  user re-enter what the system already has.
- Show password requirements up front and check each one live as the
  Editor/Administrator types (length, uppercase, lowercase, number, special
  character).
- Be forgiving: trim stray whitespace, auto-format phone numbers, normalise
  dates — don't reject input a human would consider obviously fine.

### Empty States
- No screen is ever just blank. Every empty state explains why it's empty,
  what the section is for, and gives a primary next action (e.g.
  "No volunteer applications yet. Applications submitted on the site will
  appear here.").
- Empty search results suggest a fix (check spelling, clear filters,
  broaden the search) with a concrete action (Clear Filters / Try Again).
- Fully-caught-up states get a small positive moment ("🎉 All submissions
  reviewed.") rather than reading as broken.

### Partial States / Graceful Degradation
- Every independent section of a page manages its own loading/success/
  error/retry state. One widget failing (e.g. the donations summary
  temporarily unavailable) must never blank or crash the rest of the
  dashboard — show that section's own error + Retry control instead.

### Progressive Disclosure & Decision Complexity
- Don't front-load every option. Expand advanced settings only on request,
  break long forms into logical multi-step sections (the volunteer
  application in particular), hide rarely-used options behind "Advanced",
  and surface the most relevant actions first.
- Prefer searchable/filterable views and grouped actions over exposing
  every choice at once; highlight the recommended/common action.

### Familiar Patterns (Jakob's Law)
- Follow conventions users already know for navigation, buttons, forms,
  tables, filters, search, menus, icons, and dialogs — via shadcn/ui
  primitives — rather than inventing new interaction patterns without a
  clear usability benefit. Account for device type, network quality
  (many visitors are on low-bandwidth connections), and accessibility
  needs.

### Performance
- Frontend: code-split and lazy-load routes/non-critical components,
  prefetch likely next pages, optimise images/assets (`next/image`),
  minimise unnecessary re-renders, debounce expensive operations (e.g.
  admin search/filter).
- Backend: avoid N+1 queries, add appropriate indexes in the Drizzle
  schema, use connection pooling against Neon, cache frequently-read
  public content, paginate large result sets, keep API responses lean.
- Infrastructure: configure health checks, sensible retry policies for
  transient failures (including Paystack/SMTP calls), and
  monitoring/logging for latency, throughput, and error rates — without
  exposing any of that detail to end users.
- The public homepage must remain interactive within ~3s on a throttled
  3G-equivalent connection, given GGI's rural/low-bandwidth audience.

### Accessibility & Resilience
- Full keyboard navigation and visible focus states throughout.
- Semantic HTML + ARIA where needed; WCAG 2.1/2.2 AA colour contrast —
  verify the pink/navy/cream brand palette combinations specifically.
- Respect `prefers-reduced-motion`.
- Preserve user input across a transient failure (don't clear the
  volunteer application or donation form because a save/charge request
  failed) and auto-retry recoverable operations where it's safe to do so.

### Definition of Done (per feature)
A feature is complete only when it:
1. Implements loading, success, error, and empty states as specified above.
2. Gives clear, actionable, non-technical feedback for every failure.
3. Validates input inline and prevents invalid submission.
4. Degrades gracefully at the component level (no full-page failures).
5. Follows Jakob's Law, Hick's Law, and Progressive Disclosure.
6. Meets accessibility requirements.
7. Passes Playwright unit tests and Cypress integration tests.
8. Passes `npm run lint`, `npm run type-check`, and `npm run build`.
9. Has no technical error detail leaking to the client.