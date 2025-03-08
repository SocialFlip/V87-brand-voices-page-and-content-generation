/*
  # Add Ideas Content Platform
  
  1. Changes
    - Adds Ideas Content platform to content_platforms table
    - Sets icon and color for consistent UI
*/

-- Add Ideas Content platform if it doesn't exist
INSERT INTO content_platforms (name, icon_name, color)
VALUES 
  ('Ideas Content', 'FiFileText', '#4B5563')
ON CONFLICT (name) DO UPDATE 
SET 
  icon_name = EXCLUDED.icon_name,
  color = EXCLUDED.color;