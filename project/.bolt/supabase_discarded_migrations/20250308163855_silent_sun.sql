/*
  # Add avatar_url to agents table

  1. Changes
    - Add `avatar_url` column to `agents` table
    - Add storage bucket for agent avatars
    - Add storage policy for authenticated users
*/

-- Add avatar_url column to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for the avatars bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload avatars
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (regexp_match(name, '^agent-avatars/([^/]+)'))[1]
);

-- Create policy to allow authenticated users to read avatars
CREATE POLICY "Allow authenticated users to read avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');