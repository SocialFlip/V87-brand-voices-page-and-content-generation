/*
  # Add content type tracking to collection items

  1. Changes
    - Add content_type column to collection_items table
    - Add is_revived column to collection_items table
    - Add indexes for improved query performance

  2. Notes
    - content_type can be 'regular' or 'revived'
    - is_revived is a boolean flag for quick filtering
*/

-- Add new columns
ALTER TABLE collection_items 
ADD COLUMN IF NOT EXISTS content_type text DEFAULT 'regular',
ADD COLUMN IF NOT EXISTS is_revived boolean DEFAULT false;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_collection_items_content_type 
ON collection_items(content_type);

CREATE INDEX IF NOT EXISTS idx_collection_items_is_revived 
ON collection_items(is_revived);