/*
  # Fix Hooks Table RLS Policies

  1. Changes
    - Drop existing policies
    - Add new RLS policies for hooks table
    - Enable RLS on hooks table
*/

-- First, drop any existing policies
DROP POLICY IF EXISTS "Users can create their own hooks" ON hooks;
DROP POLICY IF EXISTS "Users can view their own hooks" ON hooks;
DROP POLICY IF EXISTS "Users can update their own hooks" ON hooks;
DROP POLICY IF EXISTS "Users can delete their own hooks" ON hooks;

-- Enable RLS
ALTER TABLE hooks ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only"
  ON hooks FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read access for users to their own hooks"
  ON hooks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users to their own hooks"
  ON hooks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users to their own hooks"
  ON hooks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);