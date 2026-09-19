CREATE TYPE "public"."donation_frequency" AS ENUM('one_time', 'monthly_intent');--> statement-breakpoint
CREATE TYPE "public"."donation_status" AS ENUM('pending', 'success', 'failed', 'abandoned');--> statement-breakpoint
CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"paystack_event_id" text,
	"amount_minor" integer NOT NULL,
	"currency" text DEFAULT 'GHS' NOT NULL,
	"frequency" "donation_frequency" DEFAULT 'one_time' NOT NULL,
	"status" "donation_status" DEFAULT 'pending' NOT NULL,
	"donor_name" text,
	"donor_email" text,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"channel" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "donations_reference_unique" UNIQUE("reference"),
	CONSTRAINT "donations_paystack_event_id_unique" UNIQUE("paystack_event_id")
);
