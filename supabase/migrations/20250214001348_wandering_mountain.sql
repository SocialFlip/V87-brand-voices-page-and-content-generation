-- Create enum for funnel stages
CREATE TYPE funnel_stage AS ENUM ('TOFU', 'MOFU', 'BOFU');

-- Create ideas table
CREATE TABLE IF NOT EXISTS content_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform_id uuid REFERENCES content_platforms(id) NOT NULL,
  topic text NOT NULL,
  idea_text text NOT NULL,
  funnel_stage funnel_stage NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own ideas"
  ON content_ideas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own ideas"
  ON content_ideas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas"
  ON content_ideas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas"
  ON content_ideas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_content_ideas_user_platform ON content_ideas(user_id, platform_id);
CREATE INDEX idx_content_ideas_funnel_stage ON content_ideas(funnel_stage);
CREATE INDEX idx_content_ideas_created_at ON content_ideas(created_at);

-- Create trigger for updated_at
CREATE TRIGGER set_content_ideas_updated_at
  BEFORE UPDATE ON content_ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to check idea limits per platform
CREATE OR REPLACE FUNCTION check_idea_limit()
RETURNS trigger AS $$
BEGIN
  IF (
    SELECT count(*)
    FROM content_ideas
    WHERE user_id = NEW.user_id
    AND platform_id = NEW.platform_id
  ) >= 25 THEN
    RAISE EXCEPTION 'Idea limit reached for this platform (maximum 25)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create idea limit trigger
CREATE TRIGGER enforce_idea_limit
  BEFORE INSERT ON content_ideas
  FOR EACH ROW
  EXECUTE FUNCTION check_idea_limit();