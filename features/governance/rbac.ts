import { z } from "zod";

export const staffRoleSchema = z.enum(["administrator", "editor"]);
export type StaffRole = z.infer<typeof staffRoleSchema>;

export const contentStatusSchema = z.enum(["draft", "published"]);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const contentEntitySchema = z.enum([
  "pillars",
  "team_members",
  "challenge_tags",
  "gallery_items",
  "testimonials",
  "advocacy_content",
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
