/*
  # Add content type to revived content

  1. Changes
    - Add content_type column to revived_content table
    - Add index for content_type column
*/

-- Add content_type column if it doesn't exist
ALTER TABLE revived_content 
ADD COLUMN IF NOT EXISTS content_type text;

-- Create index for content_type
CREATE INDEX IF NOT EXISTS idx_revived_content_type 
ON revived_content(content_type);

-- Update existing rows to have 'blog' as default content_type
UPDATE revived_content 
SET content_type = 'blog'
WHERE content_type IS NULL;