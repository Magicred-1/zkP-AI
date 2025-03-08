/*
  # Add avatar URL to agents table

  1. Changes
    - Add `avatar_url` column to `agents` table for storing agent profile images
    
  2. Security
    - No changes to RLS policies needed as existing policies cover the new column
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE agents ADD COLUMN avatar_url text;
  END IF;
END $$;