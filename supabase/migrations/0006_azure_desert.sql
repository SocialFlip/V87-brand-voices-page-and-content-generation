/*
  # Add Twitter Thread platform

  1. Changes
    - Add Twitter Thread platform to content_platforms table
    - Keep existing platform names unchanged

  2. Security
    - No changes to RLS policies
*/

-- Insert Twitter Thread platform if it doesn't exist
INSERT INTO content_platforms (name, icon_name, color)
VALUES 
  ('Twitter Thread', 'FiTwitter', '#000000')
ON CONFLICT (name) DO UPDATE 
SET 
  icon_name = EXCLUDED.icon_name,
  color = EXCLUDED.color;