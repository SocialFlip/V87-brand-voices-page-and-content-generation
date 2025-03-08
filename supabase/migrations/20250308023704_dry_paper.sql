/*
  # Brand Voice Profiles Schema

  1. New Tables
    - `brand_voice_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - Name of the brand voice profile
      - `tone` (text) - Tone characteristics
      - `style` (text) - Style characteristics
      - `description` (text) - Comprehensive description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on brand_voice_profiles table
    - Add policies for:
      - Select: Users can read their own profiles
      - Insert: Users can create their own profiles
      - Update: Users can update their own profiles
      - Delete: Users can delete their own profiles

  3. Changes
    - Add trigger for updated_at timestamp
*/

-- Create brand voice profiles table
CREATE TABLE IF NOT EXISTS brand_voice_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  tone text,
  style text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_brand_voice_profiles_updated_at
  BEFORE UPDATE ON brand_voice_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE brand_voice_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own brand voice profiles"
  ON brand_voice_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brand voice profiles"
  ON brand_voice_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand voice profiles"
  ON brand_voice_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand voice profiles"
  ON brand_voice_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_brand_voice_profiles_user_id ON brand_voice_profiles(user_id);

-- Add constraint to prevent duplicate names per user
ALTER TABLE brand_voice_profiles
  ADD CONSTRAINT unique_user_voice_name UNIQUE (user_id, name);

-- Add constraint to limit profiles per user (max 5)
CREATE OR REPLACE FUNCTION check_brand_voice_profiles_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM brand_voice_profiles WHERE user_id = NEW.user_id) >= 5 THEN
    RAISE EXCEPTION 'Maximum limit of 5 brand voice profiles reached';
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER enforce_brand_voice_profiles_limit
  BEFORE INSERT ON brand_voice_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_brand_voice_profiles_limit();