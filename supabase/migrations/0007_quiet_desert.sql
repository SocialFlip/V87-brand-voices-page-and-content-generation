/*
  # Add Content Collections Support

  1. New Tables
    - `content_collections` - Stores collection metadata
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `collection_items` - Maps content to collections
      - `id` (uuid, primary key)
      - `collection_id` (uuid, references content_collections)
      - `content_id` (uuid, references content)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create content collections table
CREATE TABLE IF NOT EXISTS content_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create collection items table
CREATE TABLE IF NOT EXISTS collection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES content_collections(id) ON DELETE CASCADE NOT NULL,
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, content_id)
);

-- Enable RLS
ALTER TABLE content_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- Create default collections
INSERT INTO content_collections (name, description) VALUES
  ('Twitter', 'Twitter posts and threads'),
  ('LinkedIn', 'LinkedIn content'),
  ('Instagram', 'Instagram posts'),
  ('Carousel', 'Carousel content'),
  ('Story Breakdown', 'Story Breakdown content'),
  ('Mini-Guide', 'Mini guides')
ON CONFLICT (name) DO NOTHING;

-- Create policies
CREATE POLICY "Anyone can view collections"
  ON content_collections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view collection items"
  ON collection_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content
      WHERE content.id = collection_items.content_id
      AND content.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add items to collections"
  ON collection_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM content
      WHERE content.id = collection_items.content_id
      AND content.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_collection_items_content_id ON collection_items(content_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);