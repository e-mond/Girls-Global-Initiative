# GGI — UI Context & Design System

## 1. Design Direction

### Theme

Girls Global Initiative (GGI) should feel like a **warm, human, youth-led NGO** rather than a corporate platform or technology product.

The visual experience should communicate:

* Girls' empowerment
* Hope
* Dignity
* Community
* Trust
* Youth leadership
* Education
* Health and wellbeing
* Opportunity
* Real-world impact

The website must remain credible to donors, institutional partners and other stakeholders while feeling approachable and relevant to the girls and communities GGI serves.

Prioritise:

* Authentic photography
* Human storytelling
* Clear hierarchy
* Warmth
* Accessibility
* Strong typography
* Generous spacing
* Meaningful visual storytelling

Avoid:

* Generic corporate styling
* Excessive gradients
* Overly futuristic/tech aesthetics
* Excessive glassmorphism
* Decorative UI with no purpose
* Excessive animations
* Dense dashboard-style presentation on public pages

This is first and foremost a **girls' rights, empowerment and community storytelling website**.

---

# 2. Design Reference — Source of Truth

The approved homepage design is the authoritative visual reference:

**`GGIHomepage.png`**

Agents must **open and inspect `GGIHomepage.png` before building, modifying or restyling any page**.

Do not rely solely on the written description.

The reference establishes the project's:

* Header and navigation
* Hero composition
* Headline hierarchy
* Floating image-card treatment
* Quote-card treatment
* Pillar strip
* Origin/challenge section
* Challenge tags
* Vision/mission card pair
* Four-pillar "What We Do" section
* Founder spotlight
* "Where We Work" gallery
* "Get Involved" cards
* CTA bands
* Footer structure
* Spacing rhythm
* Card treatment
* Corner radius
* Shadow weight
* Typography hierarchy

The reference applies to the **entire product**, not only the homepage.

Where a page is not directly represented in the reference — such as:

* Admin back-office
* Pillar detail pages
* Donation flow
* Volunteer forms
* Contact forms
* Content management screens

extend the established GGI visual language rather than creating an unrelated design system.

Do not introduce new colours, typography systems, spacing systems or component styles without a genuine design requirement.

---

# 3. Brand Colours

All UI must use design tokens.

**Do not hardcode hex colour values inside components.**

## Brand Tokens

| Role          | CSS Variable      |     Value | Primary Usage                                              |
| ------------- | ----------------- | --------: | ---------------------------------------------------------- |
| Brand Navy    | `--brand-navy`    | `#041B4B` | Header, footer, dark bands, primary text on light surfaces |
| Brand Sky     | `--brand-sky`     | `#00B0F2` | Secondary actions, links, accents                          |
| Brand Magenta | `--brand-magenta` | `#E00286` | Primary CTAs, active states, important highlights          |

These brand values remain consistent across themes.

Do not introduce another colour that competes with the three core brand colours.

---

# 4. Semantic Colour Tokens

Semantic tokens must be used for application states and theme-dependent surfaces.

| Role            | CSS Variable        |     Light |      Dark |
| --------------- | ------------------- | --------: | --------: |
| Page Background | `--bg-base`         | `#FDF6EC` | `#0A1220` |
| Surface         | `--bg-surface`      | `#FFFFFF` | `#101B33` |
| Primary Text    | `--text-primary`    | `#101828` | `#F2F4F7` |
| Muted Text      | `--text-muted`      | `#5B6472` | `#94A3B8` |
| Inverse Text    | `--text-on-inverse` | `#FFFFFF` | `#FFFFFF` |
| Border          | `--border-default`  | `#E4E7EC` | `#1E293B` |
| Error           | `--state-error`     | `#D92D20` | `#E06A61` |
| Success         | `--state-success`   | `#12B76A` | `#3FA873` |
| Warning         | `--state-warning`   | `#F0A500` | `#F0A500` |
| Information     | `--state-info`      | `#00B0F2` | `#5B9BD6` |

If Release 1.0 is light-mode only, the light theme is authoritative.

However, define the dark tokens now so the system does not need to be redesigned later.

---

# 5. Brand Band Rules

The following sections use **Brand Navy** rather than semantic surface colours:

* Hero
* "How It Started" / Origin band
* Founder spotlight
* "Get Involved" / "Ready to Help" CTA bands
* Footer

These are fixed brand sections.

They should remain visually consistent regardless of light/dark theme.

---

# 6. Colour Usage Rules

### Primary Action

`--brand-magenta` is the primary action colour.

Use it for actions such as:

* Support a Girl
* Donate & Support
* Important conversion actions

Do not introduce another primary button colour.

### Secondary Action

`--brand-sky` is the secondary accent.

Use it for:

* Links
* Secondary CTAs
* Supporting accents
* Selected secondary states

Do not use sky blue interchangeably with magenta for primary actions.

### Navy

Use Brand Navy for:

* Header
* Footer
* Dark editorial bands
* Strong headings
* High-contrast brand sections

### Section Backgrounds

Public editorial sections may use warm cream and soft pastel variations derived from the approved brand palette.

Do not introduce arbitrary new hex colours.

---

# 7. Accessibility & Contrast

Colour choices must meet **WCAG 2.2 AA** requirements.

Before finalising the design, verify contrast for at minimum:

* Navy on cream
* Navy on white
* Magenta on cream
* White on magenta
* White on navy
* Sky blue on appropriate light surfaces
* Muted text on page backgrounds

Do not use a brand colour for text simply because it looks visually appropriate.

If a colour combination fails accessibility requirements, adjust the treatment rather than weakening accessibility.

---

# 8. Typography

Use the approved GGI typography system.

| Purpose            | Font            | Variable         |
| ------------------ | --------------- | ---------------- |
| UI / Body          | Red Hat Text    | `--font-sans`    |
| Display / Headings | Red Hat Display | `--font-display` |
| Code               | JetBrains Mono  | `--font-mono`    |

### Red Hat Display

Use for:

* Public hero headlines
* Page titles
* Section headings
* Major editorial statements
* Founder spotlight headings
* Admin operational headings where appropriate

### Red Hat Text

Use for:

* Body copy
* Navigation
* Forms
* Tables
* Buttons
* Labels
* Metadata
* Notifications

### Typography Rules

* Use the approved Tailwind typography scale.
* Avoid arbitrary one-off font sizes.
* Maintain consistent heading hierarchy.
* Avoid excessive font weights.
* Keep body text readable on mobile and desktop.
* Maintain sensible line lengths for long-form content.

---

# 9. Border Radius

Use the established radius system:

| Context           | Class          |
| ----------------- | -------------- |
| Small UI          | `rounded-md`   |
| Buttons           | `rounded-lg`   |
| Badges / Pills    | `rounded-full` |
| Cards / Panels    | `rounded-xl`   |
| Modals / Overlays | `rounded-2xl`  |

Hero image cards and major feature cards should favour `rounded-xl` or `rounded-2xl`.

Do not create arbitrary radius values for individual components.

---

# 10. Elevation & Surface Treatment

GGI should use **subtle elevation** rather than heavy visual effects.

Prioritise:

1. Layout hierarchy
2. Typography
3. Spacing
4. Colour
5. Borders
6. Subtle elevation

Do not use shadows simply for decoration.

Avoid:

* Heavy drop shadows
* Excessive glowing effects
* Neumorphism
* Excessive glassmorphism

Cards should feel soft and approachable without making the interface visually heavy.

---

# 11. Component Library

Use:

**shadcn/ui + Tailwind CSS**

Components belong in:

```text
components/ui/
```

Use shadcn primitives where an appropriate component exists.

Do not rebuild standard primitives unnecessarily.

Use accessible primitives for:

* Dialogues
* Dropdowns
* Tabs
* Tooltips
* Selects
* Menus
* Forms
* Tables
* Alerts

Custom components should be introduced when the product requires behaviour or presentation that existing primitives do not provide.

---

# 12. Icons

Use:

**Lucide React**

Use stroke-based icons.

Standard sizes:

* `h-4 w-4` — inline / compact UI
* `h-5 w-5` — buttons and common controls

Icons should reinforce meaning.

Do not use icons purely as decoration when they add visual noise.

Do not mix multiple icon libraries without a specific reason.

---

# 13. Public Website Layout

The public website should be:

* Content-first
* Mobile-first
* Responsive
* Story-driven
* Accessible
* Image-led where appropriate

Use a centred max-width content system.

The public navigation should provide clear access to the site's major areas.

The header should remain consistent across public pages.

The footer should follow the approved GGI structure.

Do not duplicate information unnecessarily between the header, page body and footer.

---

# 14. Public Storytelling Hierarchy

Public pages should generally prioritise:

1. Understanding GGI
2. Building trust
3. Showing the organisation's work
4. Showing people and community context
5. Providing meaningful ways to participate
6. Presenting donation/support actions

Do not turn every page into a donation page.

The public experience should tell the story before asking for support.

---

# 15. Admin Back-Office

The administrative interface may be more information-dense than the public website but must remain visually connected to the GGI brand.

Use shadcn/ui components and the same design tokens.

### Structure

Desktop:

```text
┌───────────────┬─────────────────────────────┐
│               │ Top Bar                     │
│   Sidebar     ├─────────────────────────────┤
│               │                             │
│               │ Main Content                │
│               │                             │
└───────────────┴─────────────────────────────┘
```

Sidebar areas may include:

* Dashboard
* Content
* Submissions
* Donations
* Subscribers
* Users
* Settings
* Audit

Only expose areas that are actually supported by the product requirements.

### Responsive Behaviour

On smaller screens:

* Collapse the sidebar.
* Use an accessible off-canvas navigation pattern.
* Preserve access to all major functions.
* Avoid forcing wide desktop tables onto small screens.

---

# 16. Admin Dashboard

The dashboard should prioritise operational information.

Lead with:

* Pending/important work
* Recent activity
* Relevant operational metrics

Supporting information can include:

* Subscriber information
* Donation summaries once the donation system is actually live
* Other verified operational metrics

Never display fabricated statistics.

A metric that has no real data must not be represented as zero merely to make the dashboard look complete.

---

# 17. Tables

Admin tables must be:

* Sortable where useful
* Filterable
* Searchable where appropriate
* Paginated
* Responsive
* Keyboard accessible

Use semantic table markup.

Every table must handle:

* Loading
* Success
* Empty
* Error
* Pagination
* Retry where appropriate

For mobile, use responsive strategies such as:

* Horizontal scrolling where appropriate
* Reduced columns
* Row expansion
* Alternative card presentation where appropriate

Do not simply allow important information to become unreadably compressed.

---

# 18. Multi-Step Forms

Long forms should use progressive disclosure.

For volunteer or other multi-step workflows:

* Display progress.
* Break information into logical sections.
* Keep each step focused.
* Provide clear Back and Continue actions.
* Preserve entered information.
* Validate before moving forward.
* Clearly identify missing information.
* Provide a review step where appropriate.

Do not create unnecessarily long single-page forms.

---

# 19. Forms & Input UX

Forms must follow the engineering standards defined in `code-standards.md`.

Required behaviour includes:

* Client-side validation for immediate feedback
* Server-side validation as the authoritative boundary
* Inline validation
* Clear required-field indicators
* Character counts where limits exist
* Smart prefilling where appropriate
* Forgiving formatting
* Accessible labels
* Meaningful error messages
* Submission loading states
* Duplicate-submission protection

Never rely on disabled buttons alone to explain why a form cannot be submitted.

---

# 20. Loading States

Every asynchronous interface must have an intentional loading state.

Use:

### Skeletons

For large content areas:

* Dashboard cards
* Tables
* Lists
* Profiles
* Content sections

### Spinners

For contained operations:

* Save
* Submit
* Refresh
* Approve
* Delete
* Send

### Progress Indicators

For measurable long-running operations:

* Uploads
* Imports
* Exports
* Bulk actions

Avoid blank screens.

Avoid unnecessary loading animations for extremely fast operations.

---

# 21. Success States

Every meaningful successful user action should provide appropriate feedback.

Examples:

* Saved
* Submitted
* Updated
* Sent
* Deleted

Feedback may be:

* Inline
* Button state
* Small status indicator
* Banner
* Toast

Do not use a large modal for every successful action.

---

# 22. Error States

Every meaningful failure must communicate:

1. What happened
2. Why it happened when safe and useful
3. What the user should do next

Never expose:

* Database errors
* SQL errors
* ORM errors
* Stack traces
* Internal IDs
* Server exceptions
* Implementation details

Use:

* Inline errors for field problems
* Modals only when user attention/action is required
* Toasts for non-critical notifications

Important errors must not depend solely on temporary toast messages.

---

# 23. Empty States

Every meaningful empty state must explain:

* Why it is empty
* What the section is for
* What the user can do next

Where appropriate, provide a primary action.

Search with no results should provide recovery guidance such as:

* Check spelling
* Clear filters
* Broaden the search
* Try another term

Successful empty states may communicate completion positively.

---

# 24. Partial States & Graceful Degradation

Each major section should manage its own:

* Data
* Loading state
* Success state
* Error state
* Empty state
* Retry behaviour

One failed API request must not unnecessarily destroy the entire page.

For example:

```text
Applications       ✓ Loaded
Notifications      ✓ Loaded
Analytics          ⚠ Temporarily unavailable

                    [Retry]
```

Prefer component-level recovery over unnecessary full-page error screens.

---

# 25. Responsive & Inclusive Design

Design for the actual diversity of GGI users.

Do not assume:

* Everyone has a modern phone.
* Everyone has a large screen.
* Everyone has fast internet.
* Everyone has high digital literacy.
* Everyone interacts with the interface in the same way.

Account for:

* Mobile
* Tablet
* Desktop
* Small screens
* Touch interaction
* Keyboard navigation
* Screen readers
* Slow networks
* Limited bandwidth
* Different age groups
* Different levels of technical proficiency

Responsive design is not simply shrinking desktop layouts.

The interaction model itself should adapt when necessary.

---

# 26. Accessibility

Target **WCAG 2.2 AA**.

Ensure:

* Keyboard navigation
* Visible focus states
* Semantic HTML
* Accessible form labels
* Meaningful button names
* Appropriate ARIA
* Sufficient colour contrast
* Reduced-motion support
* Accessible dialogues
* Accessible navigation
* Screen-reader compatibility

Do not use colour as the only way to communicate status.

---

# 27. Motion

Motion should communicate:

* State changes
* Hierarchy
* Interaction feedback
* Spatial relationships

Use short opacity/transform transitions where appropriate.

Avoid:

* Excessive animation
* Distracting background motion
* Decorative animation that delays interaction

Respect:

```text
prefers-reduced-motion
```

---

# 28. Image & Photography Direction

Photography is a major part of the GGI identity.

Prioritise imagery that feels:

* Authentic
* Human
* Community-oriented
* Respectful
* Youthful
* Hopeful
* Culturally appropriate

Avoid generic corporate stock photography where possible.

Do not fabricate photographs or represent unverified programme activities as real.

When final GGI photography is unavailable, use clearly replaceable placeholders during development rather than presenting fictional imagery as documented impact.

Optimise all images for performance and responsive delivery.

---

# 29. Content & Data Honesty

Never invent:

* Impact statistics
* Beneficiary counts
* Programme numbers
* Locations
* Partnerships
* Awards
* Testimonials
* Donor figures
* Success rates
* Programme outcomes

If real data does not exist, use an appropriate empty state or clearly marked placeholder.

Public-facing metrics must come from verified data.

Visual design must never make unavailable data appear real.

Do not display `0` simply because data has not yet been loaded.

Distinguish between:

* Loading
* No data
* Not applicable
* Error
* Actual zero

---

# 30. Performance-Aware UI

UI decisions must respect the engineering performance standards.

The interface should:

* Lazy-load non-critical content
* Optimise images
* Avoid unnecessary JavaScript
* Avoid unnecessary client-side rendering
* Minimise bundle size
* Avoid unnecessary API calls
* Debounce expensive search/filter operations
* Paginate large datasets
* Preserve responsive performance on lower-powered devices

Do not add visual effects that significantly increase page weight without a meaningful UX benefit.

---

# 31. Security-Aware UI

The UI must never be treated as the security boundary.

Frontend behaviour may:

* Hide unavailable actions
* Display role-specific navigation
* Improve UX

But server-side authorisation remains authoritative.

Never expose sensitive information simply because a user cannot currently see it in the UI.

Do not place secrets in:

* Client components
* Public environment variables
* HTML
* JavaScript bundles
* URLs
* Browser storage unnecessarily

---

# 32. Data & Admin Integrity

Admin interfaces must reflect actual backend state.

Do not create fake:

* Dashboard metrics
* Activity feeds
* Donation totals
* Submission counts
* User counts
* Audit records

Loading data should display a loading state.

Unavailable data should display an appropriate unavailable/error state.

Actual zero should be visually distinct from unavailable data.

---

# 33. Architecture & Technology Alignment

The UI system must remain aligned with the application's architecture.

Use:

* TypeScript with strict type checking
* Tailwind CSS
* shadcn/ui
* Lucide React
* Runtime schema validation
* Server-side validation
* Server-side authorisation
* Typed API contracts where practical
* Secure database access
* Automated testing

Do not introduce a new UI library simply to solve a problem already handled by the existing design system.

Do not create duplicate implementations of standard components.

---

# 34. Design Token Enforcement

Components must consume design tokens rather than hardcoded visual values.

Avoid:

```tsx
<div className="bg-[#041B4B]">
```

Prefer semantic/token-based styling.

The same applies to:

* Colours
* Typography
* Radius
* Spacing
* Shadows
* States

The purpose is to allow the GGI design system to evolve centrally without rewriting individual pages.

---

# 35. Reusable Design Patterns

Before creating a new pattern, check whether an existing GGI pattern already solves the problem.

Prefer reusable patterns for:

* Page headers
* Section headers
* CTA sections
* Cards
* Forms
* Tables
* Empty states
* Error states
* Loading states
* Dialogues
* Navigation
* Status indicators

Avoid route-specific one-off components unless the page genuinely requires unique behaviour.

---

# 36. Page Rhythm

Use consistent:

* Container widths
* Section spacing
* Heading hierarchy
* Vertical rhythm
* Grid gaps
* Card spacing

Do not create route-specific arbitrary spacing simply to make one page visually match another.

The homepage reference establishes the overall rhythm.

New pages should feel like they belong to the same website.

---

# 37. Hierarchy Before Decoration

Every page should establish:

1. One clear page purpose
2. One primary heading
3. One primary action or next step where applicable
4. A deliberate reading order

Only then should decorative elements be introduced.

Visual decoration must never compete with the content.

---

# 38. Surface Intent

Use cards when content is:

* Bounded
* Actionable
* Comparable
* Operational

Examples:

* Pillar cards
* Get Involved cards
* Admin records
* Metrics
* Submission items

Use open sections for narrative content such as:

* Origin story
* Mission
* Founder story
* Editorial content

Do not place every piece of content inside a card.

---

# 39. Section Labels

Public editorial labels such as:

* OUR ORIGIN
* WHAT WE DO
* GET INVOLVED

should follow a consistent small-label treatment based on the reference design.

Admin labels should remain compact and functional.

Do not turn every administrative label into a decorative pill.

---

# 40. Public Conversion Hierarchy

The public experience should establish trust before asking for support.

Recommended conceptual order:

```text
Story
↓
Mission
↓
Challenges
↓
Work / Pillars
↓
Founder / People
↓
Impact / Communities
↓
Ways to Get Involved
↓
Support / Donate
```

This is a design principle, not a requirement that every page use this exact sequence.

Do not front-load donation requests at the expense of GGI's story.

---

# 41. Admin Operational Hierarchy

Admin pages should prioritise information based on operational importance.

Generally:

```text
Urgent / Pending Work
        ↓
Recent Activity
        ↓
Primary Metrics
        ↓
Supporting Information
        ↓
Secondary Actions
```

Do not give visual prominence to metrics merely because they are available.

Importance should determine hierarchy.

---

# 42. No Fabricated UI

During development, mock data may only be used where explicitly permitted by the implementation plan.

Mock data must never be mistaken for production data.

When mock data is required:

* Make its purpose clear in development.
* Keep it isolated.
* Make replacement straightforward.
* Never expose fake impact statistics publicly.
* Never allow mock values to reach production unintentionally.

---

# 43. Design Reference Compliance

Before marking any page complete, compare it against:

**`GGIHomepage.png`**

Check:

* Colour usage
* Typography
* Spacing
* Radius
* Card treatment
* Image treatment
* CTA hierarchy
* Section rhythm
* Navigation
* Footer
* Responsive behaviour

The goal is not pixel-copying every page.

The goal is maintaining the **same visual language and design quality**.

---

# 44. Definition of Done — UI

A UI feature is complete only when:

* It follows the GGI design system.
* It uses approved design tokens.
* It uses existing components where appropriate.
* It is responsive.
* It is keyboard accessible.
* It meets WCAG 2.2 AA requirements.
* It has loading behaviour.
* It has success feedback where appropriate.
* It has meaningful error handling.
* It has an intentional empty state.
* It handles partial failures where applicable.
* It does not expose technical errors.
* It does not display fabricated data.
* It performs acceptably on lower-powered devices.
* It respects reduced motion.
* It works across supported screen sizes.
* It has been compared against the approved visual reference.
* It does not introduce an unnecessary new design pattern.

---

# 45. Visual Priority

When making design decisions, prioritise in this order:

1. **Accessibility**
2. **Content clarity**
3. **Usability**
4. **Brand consistency**
5. **Responsive behaviour**
6. **Performance**
7. **Visual polish**
8. **Decorative effects**

A visually impressive component that is confusing, inaccessible, slow or inconsistent with GGI should not be accepted.

---

# 46. Final Design Principle

GGI should feel like a **real organisation run by real people working with real communities**.

The interface should communicate:

> **Human first. Girls first. Community first.**

Technology should support the story, not become the story.
