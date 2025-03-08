-- Drop existing duplicate content constraints and triggers
DROP TRIGGER IF EXISTS prevent_duplicate_content_trigger ON content;
DROP FUNCTION IF EXISTS prevent_duplicate_content();
DROP INDEX IF EXISTS unique_strict_content_per_user_platform;
DROP INDEX IF EXISTS idx_content_strict_normalized;

-- Remove normalized_content column if not needed
ALTER TABLE content DROP COLUMN IF EXISTS normalized_content;
ALTER TABLE generated_content DROP COLUMN IF EXISTS normalized_content;
ALTER TABLE revived_content DROP COLUMN IF EXISTS normalized_content;

-- Drop normalize functions if not needed elsewhere
DROP FUNCTION IF EXISTS normalize_content();
DROP FUNCTION IF EXISTS strict_normalize_content();

-- Update content table to remove unique constraints
ALTER TABLE content DROP CONSTRAINT IF EXISTS unique_content_per_user_platform;
ALTER TABLE generated_content DROP CONSTRAINT IF EXISTS unique_generated_content_per_user_platform;
ALTER TABLE revived_content DROP CONSTRAINT IF EXISTS unique_revived_content_per_user_platform;