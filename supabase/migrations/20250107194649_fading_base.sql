-- Add guide_content column to brand_voice table
ALTER TABLE brand_voice 
ADD COLUMN guide_content jsonb;

-- Create index for better query performance
CREATE INDEX idx_brand_voice_guide_content ON brand_voice USING gin(guide_content);