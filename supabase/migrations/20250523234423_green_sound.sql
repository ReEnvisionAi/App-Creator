/*
  # Create app schema and migrate tables

  1. Schema Changes
    - Create app schema
    - Move existing tables to app schema
    - Add user_id column to chat table
    - Create indexes
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create app schema
CREATE SCHEMA IF NOT EXISTS app;

-- Move tables to app schema
ALTER TABLE IF EXISTS public.generated_app SET SCHEMA app;
ALTER TABLE IF EXISTS public.chat SET SCHEMA app;
ALTER TABLE IF EXISTS public.message SET SCHEMA app;

-- Recreate indexes in app schema
CREATE INDEX IF NOT EXISTS generated_app_id_idx ON app.generated_app(id);
CREATE INDEX IF NOT EXISTS chat_user_id_idx ON app.chat(user_id);
CREATE INDEX IF NOT EXISTS message_chat_id_idx ON app.message(chat_id);

-- Enable RLS
ALTER TABLE app.generated_app ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.message ENABLE ROW LEVEL SECURITY;

-- Create policies for chat table
CREATE POLICY "Users can read own chats"
ON app.chat FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats"
ON app.chat FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats"
ON app.chat FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats"
ON app.chat FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Create policies for message table
CREATE POLICY "Users can read own messages"
ON app.message FOR SELECT TO authenticated
USING (
  chat_id IN (
    SELECT id FROM app.chat WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own messages"
ON app.message FOR INSERT TO authenticated
WITH CHECK (
  chat_id IN (
    SELECT id FROM app.chat WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own messages"
ON app.message FOR UPDATE TO authenticated
USING (
  chat_id IN (
    SELECT id FROM app.chat WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own messages"
ON app.message FOR DELETE TO authenticated
USING (
  chat_id IN (
    SELECT id FROM app.chat WHERE user_id = auth.uid()
  )
);