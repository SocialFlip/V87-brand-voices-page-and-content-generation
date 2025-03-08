/*
  # Add Industry News Support
  
  1. Changes
    - Add industry_news type to content_type column
    - Add index for industry news content
    - Update existing content_type validation
*/

-- Add index for industry news content type
CREATE INDEX IF NOT EXISTS idx_revived_content_industry_news 
ON revived_content(content_type) 
WHERE content_type = 'industry';

-- Update any existing null content_types
UPDATE revived_content 
SET content_type = 'blog'
WHERE content_type IS NULL;

-- Add comment to document content types
COMMENT ON COLUMN revived_content.content_type IS 'Content types: blog, video, yturl, image, industry';