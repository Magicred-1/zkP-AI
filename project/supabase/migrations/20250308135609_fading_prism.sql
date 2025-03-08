/*
  # Add avatar support for agents

  1. Changes
    - Add `avatar_url` column to agents table
    - Add default avatar URL for agents without custom avatars

  2. Notes
    - Uses text field for storing avatar URLs
    - Adds a default avatar URL for better UX
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE agents ADD COLUMN avatar_url text DEFAULT 'https://images.unsplash.com/photo-1675426513962-63c6022a8626?w=400&auto=format&fit=crop&q=80';
  END IF;
END $$;