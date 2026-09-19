CREATE TYPE "public"."submission_status" AS ENUM('new', 'in_review', 'accepted', 'declined');--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"status_updated_at" timestamp with time zone,
	"status_updated_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partnership_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_name" text NOT NULL,
	"email" text NOT NULL,
	"role_title" text NOT NULL,
	"organisation" text NOT NULL,
	"location" text NOT NULL,
	"message" text NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"status_updated_at" timestamp with time zone,
	"status_updated_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "volunteer_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"city" text,
	"interest_area" text NOT NULL,
	"skills" text DEFAULT '' NOT NULL,
	"availability" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"status_updated_at" timestamp with time zone,
	"status_updated_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_status_updated_by_id_users_id_fk" FOREIGN KEY ("status_updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partnership_requests" ADD CONSTRAINT "partnership_requests_status_updated_by_id_users_id_fk" FOREIGN KEY ("status_updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_applications" ADD CONSTRAINT "volunteer_applications_status_updated_by_id_users_id_fk" FOREIGN KEY ("status_updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;