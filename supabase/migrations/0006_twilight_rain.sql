-- Update existing platform names to match exactly
UPDATE content_platforms 
SET name = 'Twitter Post'
WHERE name = 'Twitter';

-- Insert missing platforms if they don't exist
INSERT INTO content_platforms (name, icon_name, color)
VALUES 
  ('Twitter Post', 'FiTwitter', '#000000'),
  ('Twitter Thread', 'FiTwitter', '#374151'),
  ('Story Breakdown', 'FiBook', '#1384CE'),
  ('Mini-Guide', 'FiLayout', '#8FAEE8')
ON CONFLICT (name) DO UPDATE 
SET 
  icon_name = EXCLUDED.icon_name,
  color = EXCLUDED.color;