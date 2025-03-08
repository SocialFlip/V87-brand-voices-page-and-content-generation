/*
  # Add uniqueness constraint to content table

  1. Changes
    - Add a unique constraint to prevent duplicate content per user and platform
    - Add a function to normalize content text for comparison
    - Add a partial index to optimize duplicate checking
*/

-- Create a function to normalize text for comparison
CREATE OR REPLACE FUNCTION normalize_content(text_content text)
RETURNS text AS $$
BEGIN
  -- Trim whitespace, convert to lowercase, and remove multiple spaces
  RETURN regexp_replace(lower(trim(text_content)), '\s+', ' ', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add a unique constraint using the normalized content
CREATE UNIQUE INDEX IF NOT EXISTS unique_content_per_user_platform ON content (
  user_id,
  platform_id,
  (normalize_content(content_text))
)
WHERE status != 'archived';

-- Add a partial index to optimize duplicate checking
CREATE INDEX IF NOT EXISTS idx_content_normalized ON content (
  user_id,
  platform_id,
  (normalize_content(content_text))
)
WHERE status != 'archived';