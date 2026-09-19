# Business Requirements Document (BRD)
## Girls Global Initiative — Website & Digital Platform

| | |
|---|---|
| **Document version** | 1.0 |
| **Status** | Draft for review |
| **Date** | 18 September 2026 |
| **Organisation** | Girls Global Initiative (GGI) |
| **Prepared for** | GGI Leadership / Founder & Executive Director |

---

## 1. Executive Summary

Girls Global Initiative (GGI) is a youth-led organisation advancing the rights, dignity, health, wellbeing and education of girls in rural, remote and underserved communities. GGI requires a public-facing website and a companion administrative back-office to:

- Communicate GGI's mission, origin story, leadership and programme pillars to donors, volunteers, partners and the communities it serves.
- Convert visitors into donors, mentors/volunteers, advocates and community partners.
- Allow GGI staff to manage site content, respond to enquiries, track donations and volunteer applications, and grow a newsletter subscriber base — without needing a developer for routine updates.

This document defines the business rationale, scope, stakeholders and business-level requirements for the platform. Detailed functional and technical requirements are defined in the accompanying Product Requirements Document (PRD).

---

## 2. Business Background

GGI was founded from a conversation between two young women who recognised the risks facing girls in their communities — poverty, early pregnancy, school dropout, limited access to menstrual health information, lack of guidance and limited opportunity — and organised a response around four pillars: **Rights & Dignity, Health & Wellbeing, Confidence & Growth, and Mentorship & Opportunity**.

The organisation currently has no dedicated digital platform capable of scaling its storytelling, fundraising and volunteer recruitment beyond in-person and informal channels. A professional website is required to build credibility with institutional donors and partners, and to give the organisation an operational tool (the back-office) for day-to-day content and stakeholder management.

---

## 3. Business Objectives

| # | Objective | Rationale |
|---|---|---|
| BO-1 | Establish a credible, professional digital presence | Institutional donors and partners expect a website before engaging |
| BO-2 | Increase donations | "Support a girl" / "Donate & support" are primary calls to action throughout the homepage |
| BO-3 | Grow the volunteer/mentor pipeline | "Volunteer & mentor" is a named pillar of engagement |
| BO-4 | Grow an engaged supporter base | Monthly newsletter ("Letters for her future") |
| BO-5 | Enable community and school partnerships | "Is your community next?" invites inbound partnership requests |
| BO-6 | Reduce operational dependency on developers | Non-technical staff must be able to update content, review submissions and manage subscribers via an admin back-office |
| BO-7 | Protect the safety and dignity of the girls, families and communities represented | GGI works with a vulnerable population; the platform must handle imagery, stories and any personal data with care |

---

## 4. Stakeholders

| Stakeholder | Interest |
|---|---|
| Founder & Executive Director (Philomena Ofori Larbi) | Public voice of the organisation; approves messaging, leadership content |
| GGI programme/communications staff | Day-to-day content updates, responding to enquiries and applications |
| Donors (individual & institutional) | Need clarity on mission, impact and a trustworthy way to give |
| Volunteers & mentors | Need a clear, low-friction way to apply |
| Communities, schools, local partners | Need a way to request GGI's involvement |
| Site visitors / general public | Need to understand GGI's story and how to get involved |
| Developer/technical team | Builds and maintains the platform |

---

## 5. Scope

### 5.1 In Scope

- Public marketing website (homepage plus supporting pages: Our story, What we do incl. 4 pillar detail pages, Founder/Team, Communities/Where we work, Get involved, Contact).
- Donation intent capture and payment processing.
- Volunteer/mentor application form and workflow.
- Community/partnership request form and workflow.
- Newsletter signup and subscriber management.
- General contact form.
- Admin/back-office portal for staff to manage the above plus site content (pillars, team, quotes/testimonials, community stories, tags/statistics shown on the origin section).
- Basic role-based access for back-office users (e.g., Administrator, Editor).
- Responsive design for mobile, tablet and desktop.
- Accessibility and performance baseline appropriate to the audience (including low-bandwidth users in rural/remote areas).

### 5.2 Out of Scope (Phase 1)

- Full donor CRM / recurring-giving management beyond basic donation capture and receipts.
- Mobile native apps.
- Multi-language localisation (may be a future phase; content structure should not preclude it).
- Girl/beneficiary-facing case management or health-record systems.
- Payroll, HR or internal operations tooling unrelated to the public platform.

---

## 6. Business Requirements

Requirements are grouped by business function. Each maps to sections of the approved homepage design.

### 6.1 Storytelling & Brand Presence
- BR-1: The site must present GGI's mission, vision, origin story and the four programme pillars clearly to a first-time visitor.
- BR-2: The site must present the Founder/leadership with a personal, trust-building narrative (quote, photo, bio, credibility markers).
- BR-3: The site must showcase where GGI works (rural/remote/underserved communities) with supporting imagery and captions.

### 6.2 Fundraising
- BR-4: Visitors must be able to donate from multiple entry points (hero CTA, "Get involved" card, footer/global CTA) via **Paystack**; GGI's organisation account details must also be displayed as a direct-transfer alternative.
- BR-5: The organisation must be able to accept donations securely through Paystack and issue a confirmation/receipt.
- BR-6: Staff must be able to view a record of donations synced from Paystack in the back-office (subject to what Paystack legally permits GGI to store).

### 6.3 Volunteer & Mentor Recruitment
- BR-7: Visitors must be able to submit a volunteer/mentor application through the site.
- BR-8: Staff must be able to review, and update the status of, volunteer applications in the back-office.
- BR-9: Applicants should receive automatic acknowledgement of a successful submission.

### 6.4 Community & Partnership Requests
- BR-10: Communities, schools and local leaders must be able to submit a request for GGI's involvement ("Invite GGI" / "Partner with us").
- BR-11: Staff must be able to review and manage these requests in the back-office.

### 6.5 Advocacy & Supporter Growth
- BR-12: Visitors must be able to subscribe to a monthly newsletter ("Letters for her future") with a single email field.
- BR-13: Staff must be able to export or manage the subscriber list, and subscribers must be able to unsubscribe.
- BR-14: The site should support a "Raise your voice" advocacy path (e.g., sharing tools, an advocacy toolkit or petition — to be scoped further in Phase 1 detailed design).

### 6.6 General Enquiries
- BR-15: Visitors must be able to contact GGI directly ("Contact us").
- BR-16: Contact submissions must reach staff reliably and be logged for follow-up.

### 6.7 Content Operations (Back-Office)
- BR-17: Non-technical staff must be able to update key content — pillar descriptions, team/leadership bios, quotes, community photos and captions, the challenge tags shown in the origin section ("Poverty", "Early pregnancy", etc.) — without a developer.
- BR-18: The back-office must support image uploads and management for the above content.
- BR-19: Access to the back-office must be restricted to authorised GGI staff, with distinct permission levels (e.g., an Administrator able to manage users, versus an Editor limited to content).
- BR-20: All significant back-office actions (publishing content, changing an application status, exporting subscriber data) must be attributable to the staff member who performed them.

### 6.8 Safeguarding & Data Protection
- BR-21: Because GGI's work concerns girls and vulnerable communities, the platform must not collect or publish identifying information about minors beyond what is explicitly approved for publication (e.g., approved photography with consent already obtained offline).
- BR-22: Personal data collected via forms (donor, volunteer, partner, subscriber) must be handled in line with applicable data protection principles: collected for a stated purpose, stored securely, and not shared without consent.
- BR-23: The organisation must be able to respond to a request to delete or export an individual's submitted data.

---

## 7. Assumptions & Constraints

**Assumptions**
- GGI will provide final copy, imagery (with consent for use), the brand logo, UI/image references for design direction, Paystack account credentials, and organisation account details for the direct-transfer alternative.
- The Founder/leadership will provide sign-off on final messaging and any content representing named individuals.
- GGI staff will be available for back-office training prior to launch.
- Brand colour palette is confirmed: Deep Navy (`#041b4b`), Vivid Sky Blue (`#00b0f2`), Magenta Pink (`#e00286`).

**Constraints**
- Budget allows for an admin/back-office feature in Phase 1 (confirmed).
- The technology stack is predetermined (see PRD §7 — Technical Architecture).
- A meaningful share of the target audience (rural/remote communities, mobile-first users) may be on slower networks — performance on low bandwidth is a hard constraint, not an enhancement.
- The site must be maintainable by a small technical team; unnecessary architectural complexity should be avoided.

---

## 8. Success Metrics (Business KPIs)

| Metric | Target (indicative — to be agreed with GGI) |
|---|---|
| Donation conversion rate from CTA clicks | Baseline to be established post-launch, then improve quarter over quarter |
| Volunteer/mentor applications per month | Baseline to be established post-launch |
| Newsletter subscribers | Growth month over month |
| Community/partnership requests submitted | Tracked from launch |
| Average page load on 3G-equivalent connection | Under 3 seconds for the homepage |
| Back-office content update turnaround (staff, no developer) | Same-day for routine updates |

---

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Paystack account setup delayed by GGI | Low — donations not blocked | Organisation account details displayed as a direct-transfer fallback while Paystack is set up |
| Imagery/stories of minors published without proper consent | High — safeguarding and reputational risk | Editorial approval workflow in back-office; consent tracked before publish |
| Low-bandwidth users unable to load the site | Medium — excludes core audience | Performance budget enforced from the start (PRD NFRs) |
| SMTP-based email (reused from SekoFund) has weaker deliverability/tracking than a dedicated provider | Low-Medium — may affect newsletter reach as list grows | Monitor deliverability; revisit provider in a later phase if volume grows |
| Staff unable to use the back-office without ongoing developer support | Medium — undermines BO-6 | Usability testing with actual GGI staff before launch; training/documentation |
| Scope creep beyond Phase 1 | Medium — timeline/budget risk | Formal change control against this BRD |

---

## 10. Approval

| Role | Name | Sign-off |
|---|---|---|
| Founder & Executive Director | Philomena Ofori Larbi | Pending |
| Project Owner / Developer | | Pending |

---

## 11. Glossary

- **BRD** — Business Requirements Document: describes *why* and *what* from a business perspective.
- **PRD** — Product Requirements Document: describes *how* the business requirements are delivered as product/technical features.
- **Back-office** — internal administrative portal used by GGI staff, not shown to the public.
- **NFR** — Non-Functional Requirement (performance, security, accessibility, etc.).
