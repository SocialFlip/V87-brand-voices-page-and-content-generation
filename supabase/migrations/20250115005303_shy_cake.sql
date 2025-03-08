-- First ensure the column exists before trying to drop it
DO $$ 
BEGIN
  -- For content table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content' AND column_name = 'normalized_content'
  ) THEN
    ALTER TABLE content DROP COLUMN normalized_content;
  END IF;

  -- For generated_content table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'generated_content' AND column_name = 'normalized_content'
  ) THEN
    ALTER TABLE generated_content DROP COLUMN normalized_content;
  END IF;

  -- For revived_content table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'revived_content' AND column_name = 'normalized_content'
  ) THEN
    ALTER TABLE revived_content DROP COLUMN normalized_content;
  END IF;
END $$;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS normalize_content CASCADE;
DROP FUNCTION IF EXISTS strict_normalize_content CASCADE;
DROP FUNCTION IF EXISTS prevent_duplicate_content CASCADE;

-- Drop any remaining triggers
DROP TRIGGER IF EXISTS content_normalize_trigger ON content;
DROP TRIGGER IF EXISTS generated_content_normalize_trigger ON generated_content;
DROP TRIGGER IF EXISTS revived_content_normalize_trigger ON revived_content;

-- Remove any remaining unique constraints
ALTER TABLE content DROP CONSTRAINT IF EXISTS unique_content_per_user_platform CASCADE;
ALTER TABLE generated_content DROP CONSTRAINT IF EXISTS unique_generated_content_per_user_platform CASCADE;
ALTER TABLE revived_content DROP CONSTRAINT IF EXISTS unique_revived_content_per_user_platform CASCADE;