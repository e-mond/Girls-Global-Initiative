# Accessibility

Girls Global Initiative aims for **WCAG 2.2 Level AA** principles on the public website and staff dashboard. This document describes intent, tooling and known limits. It does **not** claim a full formal audit or that the site is “fully accessible.”

## What we implement

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and a skip link on public and admin shells
- Visible `:focus-visible` outlines / rings within the brand system
- Keyboard access for primary navigation, mobile menus, admin drawer and notifications (Escape, focus trap, focus restore)
- Form labels, required-field legends, `aria-required`, field/error association where practical
- Meaningful image `alt` text for illustrative content; empty `alt` for decorative collage images
- `prefers-reduced-motion` via global CSS and Framer Motion `useReducedMotion`
- Touch targets sized around 44px where controls are interactive

## Testing

Automated (Playwright, no extra packages):

- `tests/unit/mobile-a11y.spec.ts` — mobile menu + overflow
- `tests/unit/a11y-public.spec.ts` — skip link, landmarks, footer legal links, keyboard menu

Manual checklist before release:

- Tab through homepage, donate, contact, admin login and one admin list page
- Open/close mobile menu and About menu with keyboard only
- Confirm reduced-motion preference does not hide essential content
- Spot-check contrast on navy footer links and magenta error text

## Reporting barriers

Visitors can use `/accessibility` or email the contact address on that page. Staff should log issues without inventing compliance claims.

## Status

| Area | Status |
| --- | --- |
| WCAG 2.2 AA review (targeted) | Implemented (ongoing) |
| Keyboard / focus | Implemented |
| Screen-reader labels (core forms/nav) | Implemented |
| Contrast verification | Partially verified — brand tokens; residual risk on muted text |
| Accessibility testing | Implemented (smoke + landmark tests) |
| Formal third-party audit | Awaiting configuration / GGI decision |
