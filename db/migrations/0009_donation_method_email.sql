ALTER TYPE "public"."donation_status" ADD VALUE IF NOT EXISTS 'pending_verification';--> statement-breakpoint
ALTER TYPE "public"."donation_status" ADD VALUE IF NOT EXISTS 'rejected';--> statement-breakpoint
CREATE TYPE "public"."donation_method" AS ENUM('paystack', 'direct');--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "method" "donation_method" DEFAULT 'paystack' NOT NULL;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "transfer_reference" text;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "donor_note" text;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "email_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "email_last_error" text;
