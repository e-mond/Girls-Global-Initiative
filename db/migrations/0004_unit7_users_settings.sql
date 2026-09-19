CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"social_facebook" text DEFAULT '' NOT NULL,
	"social_instagram" text DEFAULT '' NOT NULL,
	"social_x" text DEFAULT '' NOT NULL,
	"social_youtube" text DEFAULT '' NOT NULL,
	"social_linkedin" text DEFAULT '' NOT NULL,
	"footer_contact_email" text DEFAULT '' NOT NULL,
	"seo_default_title" text DEFAULT '' NOT NULL,
	"seo_default_description" text DEFAULT '' NOT NULL,
	"cta_donate_url" text DEFAULT '/get-involved/donate' NOT NULL,
	"cta_volunteer_url" text DEFAULT '/get-involved/volunteer' NOT NULL,
	"cta_partner_url" text DEFAULT '/partner' NOT NULL,
	"updated_by_id" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;