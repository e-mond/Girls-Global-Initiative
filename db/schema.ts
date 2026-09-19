import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Unit 3 schema — staff auth, CMS content, media metadata, audit.
 * Submission / donation / subscriber tables arrive in later units.
 */

export const staffRoleEnum = pgEnum("staff_role", ["administrator", "editor"]);
export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: staffRoleEnum("role").notNull().default("editor"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

const contentTimestamps = {
  status: contentStatusEnum("status").notNull().default("draft"),
  createdById: uuid("created_by_id").references(() => users.id),
  updatedById: uuid("updated_by_id").references(() => users.id),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const pillars = pgTable("pillars", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  detail: text("detail").notNull().default(""),
  icon: text("icon").notNull().default("sparkles"),
  colour: text("colour").notNull().default("navy"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...contentTimestamps,
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  roleTitle: text("role_title").notNull(),
  bio: text("bio").notNull().default(""),
  photoMediaId: uuid("photo_media_id"),
  quote: text("quote"),
  callout1Title: text("callout_1_title"),
  callout1Body: text("callout_1_body"),
  callout2Title: text("callout_2_title"),
  callout2Body: text("callout_2_body"),
  callout3Title: text("callout_3_title"),
  callout3Body: text("callout_3_body"),
  isFounder: boolean("is_founder").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  ...contentTimestamps,
});

export const challengeTags = pgTable("challenge_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  icon: text("icon").notNull().default("tag"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...contentTimestamps,
});

export const galleryItems = pgTable("gallery_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  caption: text("caption").notNull().default(""),
  location: text("location"),
  imageMediaId: uuid("image_media_id"),
  badge: text("badge"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...contentTimestamps,
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  quote: text("quote").notNull(),
  attribution: text("attribution").notNull(),
  roleLabel: text("role_label"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...contentTimestamps,
});

export const advocacyContent = pgTable("advocacy_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...contentTimestamps,
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: text("filename").notNull(),
  storageKey: text("storage_key").notNull().unique(),
  mimeType: text("mime_type").notNull(),
  byteSize: integer("byte_size").notNull(),
  altText: text("alt_text").notNull(),
  url: text("url").notNull(),
  uploadedById: uuid("uploaded_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorUserId: uuid("actor_user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  summary: text("summary").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/** Legacy foundations table — retained for early migrations. */
export const schemaMeta = pgTable("schema_meta", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const submissionStatusEnum = pgEnum("submission_status", [
  "new",
  "in_review",
  "accepted",
  "declined",
]);

export const volunteerApplications = pgTable("volunteer_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  city: text("city"),
  interestArea: text("interest_area").notNull(),
  skills: text("skills").notNull().default(""),
  availability: text("availability").notNull().default(""),
  message: text("message").notNull().default(""),
  status: submissionStatusEnum("status").notNull().default("new"),
  statusUpdatedAt: timestamp("status_updated_at", { withTimezone: true }),
  statusUpdatedById: uuid("status_updated_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const partnershipRequests = pgTable("partnership_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  requesterName: text("requester_name").notNull(),
  email: text("email").notNull(),
  roleTitle: text("role_title").notNull(),
  organisation: text("organisation").notNull(),
  location: text("location").notNull(),
  message: text("message").notNull(),
  status: submissionStatusEnum("status").notNull().default("new"),
  statusUpdatedAt: timestamp("status_updated_at", { withTimezone: true }),
  statusUpdatedById: uuid("status_updated_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: submissionStatusEnum("status").notNull().default("new"),
  statusUpdatedAt: timestamp("status_updated_at", { withTimezone: true }),
  statusUpdatedById: uuid("status_updated_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
