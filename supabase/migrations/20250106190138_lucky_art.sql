/*
  # Create Generated Content Table
  
  1. New Tables
    - `generated_content`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `platform_id` (uuid, references content_platforms)
      - `content_text` (text)
      - `normalized_content` (text)
      - `status` (content_status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create generated content table
CREATE TABLE IF NOT EXISTS generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  platform_id uuid REFERENCES content_platforms(id) NOT NULL,
  content_text text NOT NULL,
  normalized_content text,
  status content_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own generated content"
  ON generated_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own generated content"
  ON generated_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated content"
  ON generated_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated content"
  ON generated_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX idx_generated_content_platform_id ON generated_content(platform_id);
CREATE INDEX idx_generated_content_created_at ON generated_content(created_at);

-- Add trigger for updated_at
CREATE TRIGGER set_generated_content_updated_at
  BEFORE UPDATE ON generated_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for normalized content
CREATE TRIGGER generated_content_normalize_trigger
  BEFORE INSERT OR UPDATE ON generated_content
  FOR EACH ROW
  EXECUTE FUNCTION update_normalized_content();