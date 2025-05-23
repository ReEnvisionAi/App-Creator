/*
  # Create application schema and move tables
  
  1. New Schema
    - Create 'app' schema for application tables
    - Move existing tables from public schema
    
  2. Security
    - Grant necessary permissions
    - Update RLS policies for new schema
*/

-- Create new schema
CREATE SCHEMA IF NOT EXISTS app;

-- Move existing tables to new schema
ALTER TABLE IF EXISTS public.generated_app SET SCHEMA app;
ALTER TABLE IF EXISTS public.chat SET SCHEMA app;
ALTER TABLE IF EXISTS public.message SET SCHEMA app;

-- Update foreign key reference
ALTER TABLE app.message 
  DROP CONSTRAINT IF EXISTS message_chat_id_fkey,
  ADD CONSTRAINT message_chat_id_fkey 
    FOREIGN KEY (chat_id) REFERENCES app.chat(id) ON DELETE CASCADE;

-- Grant permissions
GRANT USAGE ON SCHEMA app TO authenticated;
GRANT USAGE ON SCHEMA app TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA app TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA app TO anon;

-- Enable RLS on tables in new schema
ALTER TABLE app.generated_app ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.message ENABLE ROW LEVEL SECURITY;

-- Drop existing policies from public schema
DROP POLICY IF EXISTS "Allow public read access" ON public.generated_app;
DROP POLICY IF EXISTS "Users can read own chats" ON public.chat;
DROP POLICY IF EXISTS "Users can insert own chats" ON public.chat;
DROP POLICY IF EXISTS "Users can update own chats" ON public.chat;
DROP POLICY IF EXISTS "Users can delete own chats" ON public.chat;
DROP POLICY IF EXISTS "Users can read own messages" ON public.message;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.message;
DROP POLICY IF EXISTS "Users can update own messages" ON public.message;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.message;

-- Create policies for tables in app schema
CREATE POLICY "Allow public read access" ON app.generated_app
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can read own chats" ON app.chat
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON app.chat
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON app.chat
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON app.chat
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can read own messages" ON app.message
  FOR SELECT TO authenticated
  USING (chat_id IN (SELECT id FROM app.chat WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own messages" ON app.message
  FOR INSERT TO authenticated
  WITH CHECK (chat_id IN (SELECT id FROM app.chat WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own messages" ON app.message
  FOR UPDATE TO authenticated
  USING (chat_id IN (SELECT id FROM app.chat WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own messages" ON app.message
  FOR DELETE TO authenticated
  USING (chat_id IN (SELECT id FROM app.chat WHERE user_id = auth.uid()));