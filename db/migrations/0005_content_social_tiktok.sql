ALTER TABLE "site_settings" ADD COLUMN "social_tiktok" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "social_x";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "social_youtube";
