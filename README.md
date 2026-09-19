# Girls Global Initiative (GGI)

Public website and admin back-office for Girls Global Initiative.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM, Neon
Postgres, Docker, Playwright, Cypress, MSW, Paystack, SMTP.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

With `NEXT_PUBLIC_ENABLE_MSW=true` (default in `.env.example`), the app boots
without a live Neon, Paystack, or SMTP connection.

## Scripts

- `npm run dev` — local development server
- `npm run lint` — ESLint
- `npm run type-check` — TypeScript (`tsc --noEmit`)
- `npm run test` — Playwright unit/smoke tests
- `npm run test:e2e` — Cypress end-to-end smoke
- `npm run build` — production build

## Documentation

See `project-overview.md`, `GGI-BRD.md`, `GGI-PRD.md`, `architecture.md`, and
`docs/PROJECT-UNDERSTANDING.md`.
