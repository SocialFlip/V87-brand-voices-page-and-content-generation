-- Drop normalized_content columns and related triggers
ALTER TABLE content DROP COLUMN IF EXISTS normalized_content;
ALTER TABLE generated_content DROP COLUMN IF EXISTS normalized_content;
ALTER TABLE revived_content DROP COLUMN IF EXISTS normalized_content;

-- Drop any existing triggers
DROP TRIGGER IF EXISTS content_normalize_trigger ON content;
DROP TRIGGER IF EXISTS generated_content_normalize_trigger ON generated_content;
DROP TRIGGER IF EXISTS revived_content_normalize_trigger ON revived_content;
DROP TRIGGER IF EXISTS prevent_duplicate_content_trigger ON content;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS normalize_content CASCADE;
DROP FUNCTION IF EXISTS strict_normalize_content CASCADE;
DROP FUNCTION IF EXISTS prevent_duplicate_content CASCADE;
DROP FUNCTION IF EXISTS update_normalized_content CASCADE;
DROP FUNCTION IF EXISTS update_revived_content_normalized CASCADE;

-- Drop any remaining indexes
DROP INDEX IF EXISTS idx_content_normalized;
DROP INDEX IF EXISTS idx_generated_content_normalized;
DROP INDEX IF EXISTS idx_revived_content_normalized;
DROP INDEX IF EXISTS unique_content_per_user_platform;
DROP INDEX IF EXISTS unique_strict_content_per_user_platform;