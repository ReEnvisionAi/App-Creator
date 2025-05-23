/*
  # Add authentication and row level security policies
  
  1. Schema Changes
    - Add user_id column to chat table
    - Create index on user_id
    - Enable RLS on storage.objects table
    - Add storage policies for screenshots bucket
  
  2. Security
    - Drop existing public access policies
    - Add RLS policies for authenticated users on chat and message tables
    - Add storage policies to allow authenticated users to upload screenshots
    - Policies ensure users can only access their own data
*/

-- First add the user_id column and index
ALTER TABLE chat ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS chat_user_id_idx ON chat(user_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON chat;
DROP POLICY IF EXISTS "Allow public read access" ON message;

-- Create policies for chat table
CREATE POLICY "Users can read own chats"
ON chat FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats"
ON chat FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats"
ON chat FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats"
ON chat FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Create policies for message table
CREATE POLICY "Users can read own messages"
ON message FOR SELECT TO authenticated
USING (
  chat_id IN (
    SELECT id FROM chat WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own messages"
ON message FOR INSERT TO authenticated
WITH CHECK (
  chat_id IN (
    SELECT id FROM chat WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own messages"
ON message FOR UPDATE TO authenticated
USING (
  chat_id IN (
    SELECT id FROM chat WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own messages"
ON message FOR DELETE TO authenticated
USING (
  chat_id IN (
    SELECT id FROM chat WHERE user_id = auth.uid()
  )
);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies for screenshots bucket
DROP POLICY IF EXISTS "Allow authenticated users to upload screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read screenshots" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload screenshots"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'screenshots');

CREATE POLICY "Allow authenticated users to read screenshots"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'screenshots');