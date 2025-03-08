/*
  # Add Hooks System
  
  1. New Tables
    - `hooks` - Stores user hooks
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on hooks table
    - Add policies for CRUD operations
*/

-- Create hooks table
CREATE TABLE IF NOT EXISTS hooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hooks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own hooks"
  ON hooks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own hooks"
  ON hooks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own hooks"
  ON hooks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hooks"
  ON hooks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_hooks_user_id ON hooks(user_id);
CREATE INDEX idx_hooks_type ON hooks(type);
CREATE INDEX idx_hooks_created_at ON hooks(created_at);

-- Create updated_at trigger
CREATE TRIGGER set_hooks_updated_at
  BEFORE UPDATE ON hooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to check hook limits
CREATE OR REPLACE FUNCTION check_hook_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT count(*)
    FROM hooks
    WHERE user_id = NEW.user_id
    AND type = NEW.type
  ) >= 12 THEN
    RAISE EXCEPTION 'Hook limit reached for this type (maximum 12)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create hook limit trigger
CREATE TRIGGER enforce_hook_limit
  BEFORE INSERT ON hooks
  FOR EACH ROW
  EXECUTE FUNCTION check_hook_limit();