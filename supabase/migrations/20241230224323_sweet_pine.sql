/*
  # Prevent duplicate content

  1. Changes
    - Add unique constraint for content text per user and platform
    - Add function to compare normalized content
    - Add trigger to prevent duplicates on insert/update
  
  2. Security
    - Maintains existing RLS policies
*/

-- Drop existing indexes that might conflict
DROP INDEX IF EXISTS unique_content_per_user_platform;
DROP INDEX IF EXISTS idx_content_normalized;

-- Create a more strict normalized content function
CREATE OR REPLACE FUNCTION strict_normalize_content(text_content text)
RETURNS text AS $$
BEGIN
  -- Remove all whitespace, convert to lowercase, and remove special characters
  RETURN regexp_replace(
    regexp_replace(
      lower(text_content),
      '\s+',
      '',
      'g'
    ),
    '[^a-z0-9]',
    '',
    'g'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add normalized_content column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content' AND column_name = 'normalized_content'
  ) THEN
    ALTER TABLE content ADD COLUMN normalized_content text;
  END IF;
END $$;

-- Update existing content with normalized values
UPDATE content 
SET normalized_content = strict_normalize_content(content_text)
WHERE normalized_content IS NULL OR normalized_content != strict_normalize_content(content_text);

-- Create unique index using strict normalization
CREATE UNIQUE INDEX unique_strict_content_per_user_platform ON content (
  user_id,
  platform_id,
  (strict_normalize_content(content_text))
) WHERE status != 'archived';

-- Create trigger function to prevent duplicates
CREATE OR REPLACE FUNCTION prevent_duplicate_content()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for duplicates
  IF EXISTS (
    SELECT 1 FROM content
    WHERE user_id = NEW.user_id
    AND platform_id = NEW.platform_id
    AND id != NEW.id
    AND status != 'archived'
    AND strict_normalize_content(content_text) = strict_normalize_content(NEW.content_text)
  ) THEN
    RAISE EXCEPTION 'Duplicate content detected for this platform'
      USING HINT = 'Content already exists for this platform';
  END IF;
  
  -- Update normalized_content
  NEW.normalized_content := strict_normalize_content(NEW.content_text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS prevent_duplicate_content_trigger ON content;
CREATE TRIGGER prevent_duplicate_content_trigger
  BEFORE INSERT OR UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION prevent_duplicate_content();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_content_strict_normalized ON content (
  user_id,
  platform_id,
  (strict_normalize_content(content_text))
) WHERE status != 'archived';