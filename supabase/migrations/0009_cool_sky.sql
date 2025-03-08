/*
  # Fix collection items RLS policies

  1. Changes
    - Drop existing RLS policies for collection_items
    - Create new policies that properly handle content ownership
    - Add policies for both regular and revived content

  2. Security
    - Users can only add items they own
    - Users can only view their own items
    - Users can only delete their own items
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view collection items" ON collection_items;
DROP POLICY IF EXISTS "Users can add items to collections" ON collection_items;

-- Create new policies
CREATE POLICY "Users can view their collection items"
  ON collection_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content c
      WHERE c.id = collection_items.content_id
      AND c.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM revived_content rc
      WHERE rc.id = collection_items.content_id
      AND rc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add their content to collections"
  ON collection_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM content c
      WHERE c.id = collection_items.content_id
      AND c.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM revived_content rc
      WHERE rc.id = collection_items.content_id
      AND rc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their collection items"
  ON collection_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content c
      WHERE c.id = collection_items.content_id
      AND c.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM revived_content rc
      WHERE rc.id = collection_items.content_id
      AND rc.user_id = auth.uid()
    )
  );