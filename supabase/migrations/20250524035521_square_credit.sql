/*
  # Fix schema and add authentication

  1. Schema Changes
    - Move tables to public schema
    - Add user_id column to chat table
    - Create indexes for performance
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add public read access where needed
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS generated_app;

-- Create tables in public schema
CREATE TABLE IF NOT EXISTS generated_app (
  id text PRIMARY KEY DEFAULT nanoid(5),
  model text NOT NULL,
  prompt text NOT NULL,
  code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS generated_app_id_idx ON generated_app(id);

CREATE TABLE IF NOT EXISTS chat (
  id text PRIMARY KEY DEFAULT nanoid(16),
  model text NOT NULL,
  quality text NOT NULL,
  prompt text NOT NULL,
  title text NOT NULL,
  llama_coder_version text DEFAULT 'v2',
  shadcn boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS chat_user_id_idx ON chat(user_id);

CREATE TABLE IF NOT EXISTS message (
  id text PRIMARY KEY DEFAULT nanoid(16),
  role text NOT NULL,
  content text NOT NULL,
  chat_id text NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS message_chat_id_idx ON message(chat_id);

-- Enable RLS
ALTER TABLE generated_app ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE message ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON generated_app
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can read own chats" ON chat
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON chat
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chat
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chat
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own messages" ON message
  FOR SELECT TO authenticated
  USING (
    chat_id IN (
      SELECT id FROM chat WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages" ON message
  FOR INSERT TO authenticated
  WITH CHECK (
    chat_id IN (
      SELECT id FROM chat WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own messages" ON message
  FOR UPDATE TO authenticated
  USING (
    chat_id IN (
      SELECT id FROM chat WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own messages" ON message
  FOR DELETE TO authenticated
  USING (
    chat_id IN (
      SELECT id FROM chat WHERE user_id = auth.uid()
    )
  );