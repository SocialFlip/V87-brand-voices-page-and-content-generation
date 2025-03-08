/*
  # Create revived content table and dependencies

  1. New Tables
    - `revived_content`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `platform_id` (uuid, foreign key to content_platforms)
      - `original_url` (text)
      - `content_text` (text)
      - `normalized_content` (text)
      - `status` (content_status)
      - `is_generated` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Add indexes for performance

  3. Changes
    - Add triggers for normalized content and updated_at
*/

-- Create revived content table
CREATE TABLE IF NOT EXISTS revived_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  platform_id uuid REFERENCES content_platforms(id) NOT NULL,
  original_url text NOT NULL,
  content_text text NOT NULL,
  normalized_content text,
  status content_status DEFAULT 'draft',
  is_generated boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE revived_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own revived content"
  ON revived_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own revived content"
  ON revived_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own revived content"
  ON revived_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own revived content"
  ON revived_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_revived_content_user_id ON revived_content(user_id);
CREATE INDEX IF NOT EXISTS idx_revived_content_platform_id ON revived_content(platform_id);
CREATE INDEX IF NOT EXISTS idx_revived_content_status ON revived_content(status);
CREATE INDEX IF NOT EXISTS idx_revived_content_normalized ON revived_content(normalized_content) 
WHERE status != 'archived';

-- Create unique constraint for duplicate prevention
CREATE UNIQUE INDEX IF NOT EXISTS unique_revived_content_per_user_platform ON revived_content (
  user_id,
  platform_id,
  (normalize_content(content_text))
)
WHERE status != 'archived';

-- Create triggers
CREATE TRIGGER update_revived_content_updated_at
  BEFORE UPDATE ON revived_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER revived_content_normalize_trigger
  BEFORE INSERT OR UPDATE ON revived_content
  FOR EACH ROW
  EXECUTE FUNCTION update_normalized_content();