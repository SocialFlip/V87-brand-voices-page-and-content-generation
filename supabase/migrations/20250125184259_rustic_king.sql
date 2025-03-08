-- Add conversational_rhythm column to brand_voice table
ALTER TABLE brand_voice
ADD COLUMN IF NOT EXISTS conversational_rhythm jsonb DEFAULT jsonb_build_object(
  'sections', jsonb_build_array(),
  'post_length', jsonb_build_object(
    'type', 'short',
    'opening_style', '',
    'closing_style', '',
    'emoji_usage', 'none'
  )
);

-- Update emotional_vocabulary column structure if it doesn't match expected format
UPDATE brand_voice
SET emotional_vocabulary = jsonb_build_object(
  'sections', jsonb_build_array(
    jsonb_build_object(
      'id', 1,
      'excited_phrases', jsonb_build_array(),
      'problem_phrases', jsonb_build_array(),
      'solution_phrases', jsonb_build_array()
    ),
    jsonb_build_object(
      'id', 2,
      'excited_phrases', jsonb_build_array(),
      'problem_phrases', jsonb_build_array(),
      'solution_phrases', jsonb_build_array()
    ),
    jsonb_build_object(
      'id', 3,
      'excited_phrases', jsonb_build_array(),
      'problem_phrases', jsonb_build_array(),
      'solution_phrases', jsonb_build_array()
    ),
    jsonb_build_object(
      'id', 4,
      'excited_phrases', jsonb_build_array(),
      'problem_phrases', jsonb_build_array(),
      'solution_phrases', jsonb_build_array()
    ),
    jsonb_build_object(
      'id', 5,
      'excited_phrases', jsonb_build_array(),
      'problem_phrases', jsonb_build_array(),
      'solution_phrases', jsonb_build_array()
    )
  ),
  'selected_section', null
)
WHERE emotional_vocabulary IS NULL OR emotional_vocabulary->>'sections' IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_voice_conversational_rhythm 
ON brand_voice USING gin(conversational_rhythm);