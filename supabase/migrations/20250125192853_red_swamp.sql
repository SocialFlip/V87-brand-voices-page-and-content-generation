-- Update personal_stories column structure
ALTER TABLE brand_voice
DROP COLUMN IF EXISTS personal_stories;

ALTER TABLE brand_voice
ADD COLUMN personal_stories jsonb DEFAULT jsonb_build_object(
  'stories', jsonb_build_array(),
  'selected_story', null
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_voice_personal_stories 
ON brand_voice USING gin(personal_stories);

-- Update any existing records to have the correct structure
UPDATE brand_voice
SET personal_stories = jsonb_build_object(
  'stories', COALESCE(personal_stories->'stories', jsonb_build_array()),
  'selected_story', personal_stories->>'selected_story'
)
WHERE personal_stories IS NULL OR personal_stories->>'stories' IS NULL;