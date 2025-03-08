/*
  # Add brand voice column to generated content

  1. Changes
    - Add brand_voice_id column to generated_content table
    - Add foreign key constraint to brand_voice_profiles table
    - Add index for better query performance
*/

-- Add brand_voice_id column
ALTER TABLE generated_content 
ADD COLUMN IF NOT EXISTS brand_voice_id UUID REFERENCES brand_voice_profiles(id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_generated_content_brand_voice 
ON generated_content(brand_voice_id);