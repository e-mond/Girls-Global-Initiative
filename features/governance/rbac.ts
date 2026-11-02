import { z } from "zod";

export const staffRoleSchema = z.enum(["administrator", "editor"]);
export type StaffRole = z.infer<typeof staffRoleSchema>;

export const contentStatusSchema = z.enum([
  "draft",
  "scheduled",
  "published",
  "archived",
]);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

/** Explicit event programme lifecycle (not inferred from missing data). */
export const programmeStatusSchema = z.enum([
  "scheduled",
  "cancelled",
  "postponed",
]);
export type ProgrammeStatus = z.infer<typeof programmeStatusSchema>;

export const contentEntitySchema = z.enum([
  "pillars",
  "team_members",
  "challenge_tags",
  "gallery_items",
  "testimonials",
  "advocacy_content",
  "news_posts",
  "events",
]);
export type ContentEntity = z.infer<typeof contentEntitySchema>;

export function canAccessAdmin(role: StaffRole | undefined | null): boolean {
  return role === "administrator" || role === "editor";
}

export function canManageUsers(role: StaffRole | undefined | null): boolean {
  return role === "administrator";
}

export function canManageSettings(role: StaffRole | undefined | null): boolean {
  return role === "administrator";
}

/** Plain-language capability guide for Admin → Users (BR-19). */
export const STAFF_ROLE_GUIDE: Record<
  StaffRole,
  {
    label: string;
    summary: string;
    can: string[];
    cannot: string[];
  }
> = {
  editor: {
    label: "Editor",
    summary: "Day-to-day website and inbox work.",
    can: [
      "Create, edit, schedule and publish content (news, events, gallery, team, and more)",
      "Upload and manage media",
      "Review contact, volunteer and partnership submissions",
      "View donations and newsletter subscribers",
      "Send subscriber broadcasts (where enabled)",
    ],
    cannot: [
      "Invite or disable staff accounts",
      "Change another person’s role",
      "Change site-wide settings",
      "Use privacy look-up / erase tools",
      "Open the full audit history",
    ],
  },
  administrator: {
    label: "Administrator",
    summary: "Full staff workspace control.",
    can: [
      "Everything an Editor can do",
      "Invite staff and send password set-up links",
      "Change staff roles (Editor ↔ Administrator)",
      "Disable or re-enable staff access",
      "Update organisation settings",
      "Look up and erase personal data on request",
      "Review the audit history",
    ],
    cannot: [],
  },
};
