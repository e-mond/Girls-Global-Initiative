# AI Workflow Rules

## Approach

Build this project incrementally using a spec-driven workflow. The BRD and
PRD (`GGI-BRD.md`, `GGI-PRD.md`) define *what* the product must do.
`project-overview.md`, `architecture.md`, `code-standards.md`, and
`ui-context.md` define *how* to build it and with what technology. Always
implement against these documents — do not infer or invent product behavior,
data fields, or workflow states that aren't in the BRD/PRD, and do not
deviate from the fixed tech stack in `architecture.md`.

Development uses real `app/api/*` route handlers (Drizzle-backed) from the
start. When `DATABASE_URL` is unset, or Paystack/SMTP credentials are unset,
or mock mode is enabled, **MSW** intercepts those routes at the HTTP boundary
(see `mocks/` and `architecture.md` → Mocking Strategy). The app must remain
fully demoable and testable offline via MSW at every stage; there is no
parallel mock business-logic layer inside the app.

## Scoping Rules

- Work on one feature unit at a time (one row of the roadmap in
  `progress-tracker.md`).
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries (e.g. a public form and an
  unrelated admin reporting endpoint) in a single implementation step.

## When to Split Work

Split an implementation step if it combines:

- UI changes and unrelated backend/API changes that don't share a feature.
- Multiple unrelated API routes or unrelated database entities.
- Behavior not clearly defined in the BRD/PRD or context files — resolve
  the ambiguity first (see below) instead of guessing and building on the
  guess.
- More than one persona/role's workflow at once (e.g. building the Admin
  content management screens and the public donation flow in the same step).

If a change cannot be verified end to end quickly (build it, exercise it
against mock data, see it work), the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the BRD, PRD, or context
  files.
- If a requirement is ambiguous, resolve it in the relevant context file
  (usually `project-overview.md` or `progress-tracker.md` → Architecture
  Decisions) before implementing against it.
- If a requirement is missing entirely, add it as an Open Question in
  `progress-tracker.md` before continuing, and pick the most conservative,
  BRD/PRD-consistent default rather than blocking.

## Protected Files

Do not modify the following unless explicitly instructed:

- `components/ui/*` — shadcn-generated primitives; regenerate via the
  shadcn CLI rather than hand-editing.
- `db/migrations/*` (historical migrations) — never edit a migration that
  has already been applied; create a new one.
- Any third-party library internals (`node_modules`, generated lockfiles
  aside from normal install/update).

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries → `architecture.md`
- Storage model or schema decisions → `architecture.md` +
  `progress-tracker.md` (Architecture Decisions)
- Code conventions or standards → `code-standards.md`
- Feature scope or product behavior clarifications → `project-overview.md`
- Visual/UX conventions → `ui-context.md`

## Git & Delivery Workflow

- Create a feature branch per implementation unit:
  `feature/<unit-slug>`.
- Commit at logical checkpoints within the unit with clear messages.
- Only merge a branch once the "Before Moving to the Next Unit" checklist
  below passes in full.

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope, against
   mock data (no live Neon/Paystack/SMTP required).
2. No invariant defined in `architecture.md` was violated.
3. The unit satisfies the Definition of Done in `code-standards.md`
   (loading/success/error/empty states, accessibility, no leaked technical
   errors).
4. Playwright unit tests and Cypress integration tests for the unit pass.
5. `progress-tracker.md` reflects the completed work (move the unit from
   "Next Up"/"In Progress" to "Completed", update Session Notes).
6. `npm run lint`, `npm run type-check`, and `npm run build` all pass.
7. The work is committed on its feature branch.