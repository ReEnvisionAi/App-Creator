/*
  # Create schema and migrate tables

  1. Schema Changes
    - Create app schema
    - Create tables in app schema
    - Add indexes and foreign keys
  
  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Create app schema
CREATE SCHEMA IF NOT EXISTS app;

-- Create tables in app schema
CREATE TABLE IF NOT EXISTS app.generated_app (
  id text PRIMARY KEY DEFAULT nanoid(5),
  model text NOT NULL,
  prompt text NOT NULL,
  code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS generated_app_id_idx ON app.generated_app(id);

CREATE TABLE IF NOT EXISTS app.chat (
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

CREATE INDEX IF NOT EXISTS chat_user_id_idx ON app.chat(user_id);

CREATE TABLE IF NOT EXISTS app.message (
  id text PRIMARY KEY DEFAULT nanoid(16),
  role text NOT NULL,
  content text NOT NULL,
  chat_id text NOT NULL REFERENCES app.chat(id) ON DELETE CASCADE,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS message_chat_id_idx ON app.message(chat_id);

-- Enable RLS
ALTER TABLE app.generated_app ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.message ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON app.generated_app
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can read own chats" ON app.chat
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON app.chat
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON app.chat
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON app.chat
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own messages" ON app.message
  FOR SELECT TO authenticated
  USING (
    chat_id IN (
      SELECT id FROM app.chat WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages" ON app.message
  FOR INSERT TO authenticated
  WITH CHECK (
    chat_id IN (
      SELECT id FROM app.chat WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own messages" ON app.message
  FOR UPDATE TO authenticated
  USING (
    chat_id IN (
      SELECT id FROM app.chat WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own messages" ON app.message
  FOR DELETE TO authenticated
  USING (
    chat_id IN (
      SELECT id FROM app.chat WHERE user_id = auth.uid()
    )
  );