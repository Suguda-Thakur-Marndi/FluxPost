-- Migration 002: Add 'publishing' and 'cancelled' to scheduled_posts status check
-- Purpose:
--   'publishing' enables atomic idempotency — Inngest claims a post before publishing,
--   preventing duplicate publishes if the cron fires twice.
--   'cancelled' enables safe soft-cancellation without deleting the record.
--
-- Run this against your InsForge database SQL editor or CLI before deploying
-- the updated application code.

-- Step 1: Drop the existing check constraint
ALTER TABLE scheduled_posts
  DROP CONSTRAINT IF EXISTS scheduled_posts_status_check;

-- Step 2: Add the expanded check constraint
ALTER TABLE scheduled_posts
  ADD CONSTRAINT scheduled_posts_status_check
  CHECK (status IN ('draft', 'queue', 'publishing', 'published', 'failed', 'cancelled'));

-- Step 3: Add an index on (user_id, status) for efficient status-filtered queries
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_status
  ON scheduled_posts (user_id, status);

-- Step 4: Add an index on (status, scheduled_at) for the Inngest cron poll
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status_scheduled_at
  ON scheduled_posts (status, scheduled_at)
  WHERE status IN ('queue', 'publishing');

-- Verify
-- SELECT constraint_name FROM information_schema.table_constraints
-- WHERE table_name = 'scheduled_posts' AND constraint_type = 'CHECK';
