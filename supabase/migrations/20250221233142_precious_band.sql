-- Create hooks_content table
CREATE TABLE IF NOT EXISTS hooks_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  platform text NOT NULL,
  content_type text NOT NULL,
  hook_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hooks_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own hooks content"
  ON hooks_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own hooks content"
  ON hooks_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own hooks content"
  ON hooks_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hooks content"
  ON hooks_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_hooks_content_user_id ON hooks_content(user_id);
CREATE INDEX idx_hooks_content_hook_type ON hooks_content(hook_type);
CREATE INDEX idx_hooks_content_created_at ON hooks_content(created_at);

-- Create trigger for updated_at
CREATE TRIGGER set_hooks_content_updated_at
  BEFORE UPDATE ON hooks_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to check content limits per hook type
CREATE OR REPLACE FUNCTION check_hook_content_limit()
RETURNS trigger AS $$
BEGIN
  IF (
    SELECT count(*)
    FROM hooks_content
    WHERE user_id = NEW.user_id
    AND hook_type = NEW.hook_type
  ) >= 12 THEN
    RAISE EXCEPTION 'Limit reached: Cannot create more than 12 content items for this hook type';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create content limit trigger
CREATE TRIGGER enforce_hook_content_limit
  BEFORE INSERT ON hooks_content
  FOR EACH ROW
  EXECUTE FUNCTION check_hook_content_limit();