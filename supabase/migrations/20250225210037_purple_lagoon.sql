-- Drop the unique constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'unique_user_platform_idea'
    AND table_name = 'content_ideas'
  ) THEN
    ALTER TABLE content_ideas DROP CONSTRAINT unique_user_platform_idea;
  END IF;
END $$;

-- Drop any related indexes
DROP INDEX IF EXISTS idx_unique_user_platform_idea;

-- Create new indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_ideas_user_platform_topic 
ON content_ideas(user_id, platform_id, topic);

COMMENT ON TABLE content_ideas IS 'Stores user content ideas with multiple ideas allowed per platform';