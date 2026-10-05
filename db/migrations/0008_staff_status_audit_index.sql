CREATE TYPE "public"."staff_status" AS ENUM('active', 'invited', 'disabled');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "staff_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at" DESC);