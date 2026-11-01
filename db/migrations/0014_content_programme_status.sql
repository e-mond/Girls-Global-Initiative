ALTER TYPE "public"."content_status" ADD VALUE IF NOT EXISTS 'scheduled';--> statement-breakpoint
ALTER TYPE "public"."content_status" ADD VALUE IF NOT EXISTS 'archived';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "programme_status" text DEFAULT 'scheduled' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "timezone" text DEFAULT 'Africa/Accra';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "revised_starts_on" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "status_note" text;
