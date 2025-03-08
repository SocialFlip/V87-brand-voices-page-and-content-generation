/*
  # Global Hooks Table Setup

  1. New Tables
    - `global_hooks`
      - `id` (uuid, primary key)
      - `type` (text)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS
    - Add policies for read access and admin write access
*/

-- Create global hooks table
CREATE TABLE IF NOT EXISTS global_hooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE global_hooks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can read global hooks"
  ON global_hooks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admin can insert global hooks"
  ON global_hooks FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.email() = 'businessai360@gmail.com'
  );

CREATE POLICY "Only admin can update global hooks"
  ON global_hooks FOR UPDATE
  TO authenticated
  USING (auth.email() = 'businessai360@gmail.com')
  WITH CHECK (auth.email() = 'businessai360@gmail.com');

CREATE POLICY "Only admin can delete global hooks"
  ON global_hooks FOR DELETE
  TO authenticated
  USING (auth.email() = 'businessai360@gmail.com');

-- Create updated_at trigger
CREATE TRIGGER set_global_hooks_updated_at
  BEFORE UPDATE ON global_hooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_global_hooks_type ON global_hooks(type);
CREATE INDEX idx_global_hooks_created_at ON global_hooks(created_at);