ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "kind" text DEFAULT 'news' NOT NULL;--> statement-breakpoint
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "attachment_url" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "host_label" text;
