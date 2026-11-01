ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "story_video_embed_url" text DEFAULT '' NOT NULL;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "founder_video_embed_url" text DEFAULT '' NOT NULL;
