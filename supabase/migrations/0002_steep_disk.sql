/*
  # Content Management System Schema

  1. New Tables
    - `content_platforms`
      - Lookup table for supported platforms
    - `content`
      - Main content storage
    - `scheduled_content`
      - Content scheduling information
    - `content_history`
      - Content revision history

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users
*/

-- Create enum for content status
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE platform_status AS ENUM ('pending', 'posted', 'failed');

-- Create platforms lookup table
CREATE TABLE IF NOT EXISTS content_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(50) UNIQUE NOT NULL,
  icon_name varchar(50),
  color varchar(7),
  created_at timestamptz DEFAULT now()
);

-- Insert default platforms
INSERT INTO content_platforms (name, icon_name, color) VALUES
  ('LinkedIn', 'FiLinkedin', '#0077B5'),
  ('Twitter', 'FiTwitter', '#000000'),
  ('Instagram', 'FiInstagram', '#E4405F'),
  ('Carousel', 'FiGrid', '#01BDCB')
ON CONFLICT (name) DO NOTHING;

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  platform_id uuid REFERENCES content_platforms(id) NOT NULL,
  content_text text NOT NULL,
  source_url text,
  status content_status DEFAULT 'draft',
  is_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scheduled_content table
CREATE TABLE IF NOT EXISTS scheduled_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  scheduled_at timestamptz NOT NULL,
  platform_status platform_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content_history table
CREATE TABLE IF NOT EXISTS content_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content_text text NOT NULL,
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;

-- Platforms policies (read-only for authenticated users)
CREATE POLICY "Anyone can view platforms"
  ON content_platforms FOR SELECT
  TO authenticated
  USING (true);

-- Content policies
CREATE POLICY "Users can create their own content"
  ON content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own content"
  ON content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own content"
  ON content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content"
  ON content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Scheduled content policies
CREATE POLICY "Users can schedule their own content"
  ON scheduled_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their scheduled content"
  ON scheduled_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their scheduled content"
  ON scheduled_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their scheduled content"
  ON scheduled_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Content history policies
CREATE POLICY "Users can view their content history"
  ON content_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create content history"
  ON content_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_platform_id ON content(platform_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_content_user_id ON scheduled_content(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_content_scheduled_at ON scheduled_content(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_content_history_content_id ON content_history(content_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create content history trigger function
CREATE OR REPLACE FUNCTION create_content_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.content_text != NEW.content_text THEN
    INSERT INTO content_history (content_id, user_id, content_text)
    VALUES (NEW.id, NEW.user_id, OLD.content_text);
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_content_updated_at
  BEFORE UPDATE ON scheduled_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER track_content_history
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION create_content_history();