-- Add content_guidelines column to brand_voice table
ALTER TABLE brand_voice 
ADD COLUMN IF NOT EXISTS content_guidelines text;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_voice_content_guidelines 
ON brand_voice(content_guidelines)
WHERE content_guidelines IS NOT NULL;