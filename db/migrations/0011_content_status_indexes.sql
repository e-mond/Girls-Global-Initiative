-- Speed published-content filters used by public SSR (Error 1102 mitigation).
CREATE INDEX IF NOT EXISTS "pillars_status_sort_idx" ON "pillars" ("status", "sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_members_status_sort_idx" ON "team_members" ("status", "sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_members_founder_status_idx" ON "team_members" ("is_founder", "status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenge_tags_status_sort_idx" ON "challenge_tags" ("status", "sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gallery_items_status_sort_idx" ON "gallery_items" ("status", "sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "news_posts_status_sort_idx" ON "news_posts" ("status", "sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_status_sort_idx" ON "events" ("status", "sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "testimonials_status_sort_idx" ON "testimonials" ("status", "sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocacy_content_status_sort_idx" ON "advocacy_content" ("status", "sort_order");
