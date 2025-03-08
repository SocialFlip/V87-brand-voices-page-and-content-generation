-- Add normalized_content column if it doesn't exist
ALTER TABLE revived_content 
ADD COLUMN IF NOT EXISTS normalized_content text;

-- Create index for normalized_content
CREATE INDEX IF NOT EXISTS idx_revived_content_normalized 
ON revived_content(normalized_content) 
WHERE normalized_content IS NOT NULL;

-- Update trigger function to handle normalized_content
CREATE OR REPLACE FUNCTION update_revived_content_normalized()
RETURNS TRIGGER AS $$
BEGIN
  -- Simply set normalized_content to the same as content_text
  -- We're not doing complex normalization anymore
  NEW.normalized_content := NEW.content_text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for normalized_content
DROP TRIGGER IF EXISTS revived_content_normalize_trigger ON revived_content;
CREATE TRIGGER revived_content_normalize_trigger
  BEFORE INSERT OR UPDATE ON revived_content
  FOR EACH ROW
  EXECUTE FUNCTION update_revived_content_normalized();

-- Update existing rows
UPDATE revived_content 
SET normalized_content = content_text
WHERE normalized_content IS NULL;