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
