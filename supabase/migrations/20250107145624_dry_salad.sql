-- Create brand voice table
CREATE TABLE IF NOT EXISTS brand_voice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  company_name text,
  positioning text,
  tone_of_voice text,
  industry_keywords text,
  target_audience text,
  brand_values text,
  avoid_language text,
  writing_style text,
  content_examples text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE brand_voice ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own brand voice"
  ON brand_voice FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own brand voice"
  ON brand_voice FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand voice"
  ON brand_voice FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_brand_voice_updated_at
  BEFORE UPDATE ON brand_voice
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();