/*
  # Templates System Setup with Limit Enforcement

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `platform_id` (uuid, references content_platforms)
      - `content_text` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on templates table
    - Add policies for CRUD operations
    - Enforce 25 template limit per platform via trigger
*/

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  platform_id uuid REFERENCES content_platforms(id) NOT NULL,
  content_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create template limit trigger function
CREATE OR REPLACE FUNCTION check_template_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT count(*)
    FROM templates
    WHERE user_id = NEW.user_id
    AND platform_id = NEW.platform_id
  ) >= 25 THEN
    RAISE EXCEPTION 'Template limit reached for this platform (maximum 25)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create template limit trigger
CREATE TRIGGER enforce_template_limit
  BEFORE INSERT ON templates
  FOR EACH ROW
  EXECUTE FUNCTION check_template_limit();

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own templates"
  ON templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own templates"
  ON templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_templates_user_platform ON templates(user_id, platform_id);

-- Create updated_at trigger
CREATE TRIGGER set_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();