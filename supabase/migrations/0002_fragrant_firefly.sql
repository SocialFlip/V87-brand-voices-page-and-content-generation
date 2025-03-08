/*
  # Add Story and Mini-guide platforms
  
  1. Changes
    - Add 'Story' and 'Mini-guide' to content_platforms table
  
  2. Notes
    - Only adds missing platforms
    - Preserves existing platforms
*/

INSERT INTO content_platforms (name, icon_name, color) VALUES
  ('Story', 'FiBook', '#1384CE'),
  ('Mini-guide', 'FiLayout', '#8FAEE8')
ON CONFLICT (name) DO NOTHING;