/*
  # Add normalized_content column
  
  1. Changes
    - Add normalized_content column to content table
    - Update existing rows with normalized content
    - Add trigger to maintain normalized content
*/

-- Add normalized_content column
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS normalized_content text;

-- Update existing rows
UPDATE content 
SET normalized_content = normalize_content(content_text)
WHERE normalized_content IS NULL;

-- Create trigger function to maintain normalized content
CREATE OR REPLACE FUNCTION update_normalized_content()
RETURNS TRIGGER AS $$
BEGIN
  NEW.normalized_content := normalize_content(NEW.content_text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS content_normalize_trigger ON content;
CREATE TRIGGER content_normalize_trigger
  BEFORE INSERT OR UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_normalized_content();