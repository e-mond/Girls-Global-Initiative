ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "extraction_status" text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "extraction_notes" text;--> statement-breakpoint
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "extracted_raw" text;
