-- Add personal_stories column to brand_voice table
ALTER TABLE brand_voice
ADD COLUMN IF NOT EXISTS personal_stories jsonb[];

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_voice_personal_stories 
ON brand_voice USING gin(personal_stories);