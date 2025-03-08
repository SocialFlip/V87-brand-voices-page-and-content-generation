-- Add call_to_actions column to brand_voice table
ALTER TABLE brand_voice
ADD COLUMN IF NOT EXISTS call_to_actions jsonb DEFAULT jsonb_build_object(
  'ctas', jsonb_build_array(),
  'selected_cta', null
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_voice_call_to_actions 
ON brand_voice USING gin(call_to_actions);

-- Update any existing records to have the correct structure
UPDATE brand_voice
SET call_to_actions = jsonb_build_object(
  'ctas', COALESCE(call_to_actions->'ctas', jsonb_build_array()),
  'selected_cta', call_to_actions->>'selected_cta'
)
WHERE call_to_actions IS NULL OR call_to_actions->>'ctas' IS NULL;