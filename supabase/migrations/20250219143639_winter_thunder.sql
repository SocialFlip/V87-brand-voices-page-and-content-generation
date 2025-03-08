/*
  # Add ideas_content table
  
  1. New Tables
    - `ideas_content`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `platform_id` (uuid, references content_platforms)
      - `content_text` (text)
      - `funnel_stage` (funnel_stage enum)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Add indexes for performance
*/

-- Create ideas_content table
CREATE TABLE IF NOT EXISTS ideas_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform_id uuid REFERENCES content_platforms(id) NOT NULL,
  content_text text NOT NULL,
  funnel_stage funnel_stage NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ideas_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own ideas content"
  ON ideas_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own ideas content"
  ON ideas_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas content"
  ON ideas_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas content"
  ON ideas_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_ideas_content_user_platform ON ideas_content(user_id, platform_id);
CREATE INDEX idx_ideas_content_funnel_stage ON ideas_content(funnel_stage);
CREATE INDEX idx_ideas_content_created_at ON ideas_content(created_at);

-- Create trigger for updated_at
CREATE TRIGGER set_ideas_content_updated_at
  BEFORE UPDATE ON ideas_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();