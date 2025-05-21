/*
  # Create initial tables

  1. New Tables
    - `generated_app`
      - `id` (text, primary key)
      - `model` (text)
      - `prompt` (text)
      - `code` (text)
      - `created_at` (timestamptz)
    - `chat`
      - `id` (text, primary key)
      - `model` (text)
      - `quality` (text)
      - `prompt` (text)
      - `title` (text)
      - `llama_coder_version` (text)
      - `shadcn` (boolean)
      - `created_at` (timestamptz)
    - `message`
      - `id` (text, primary key)
      - `role` (text)
      - `content` (text)
      - `chat_id` (text, foreign key)
      - `position` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create generated_app table
CREATE TABLE IF NOT EXISTS generated_app (
  id text PRIMARY KEY DEFAULT nanoid(5),
  model text NOT NULL,
  prompt text NOT NULL,
  code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS generated_app_id_idx ON generated_app(id);

-- Create chat table
CREATE TABLE IF NOT EXISTS chat (
  id text PRIMARY KEY DEFAULT nanoid(16),
  model text NOT NULL,
  quality text NOT NULL,
  prompt text NOT NULL,
  title text NOT NULL,
  llama_coder_version text DEFAULT 'v2',
  shadcn boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create message table
CREATE TABLE IF NOT EXISTS message (
  id text PRIMARY KEY DEFAULT nanoid(16),
  role text NOT NULL,
  content text NOT NULL,
  chat_id text NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS message_chat_id_idx ON message(chat_id);

-- Enable Row Level Security
ALTER TABLE generated_app ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE message ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON generated_app
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access" ON chat
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access" ON message
  FOR SELECT TO public USING (true);

-- Create nanoid function if it doesn't exist
CREATE OR REPLACE FUNCTION nanoid(size int DEFAULT 21)
RETURNS text AS $$
DECLARE
  id text := '';
  i int := 0;
  urlAlphabet char(64) := 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';
  bytes bytea;
BEGIN
  bytes := gen_random_bytes(size);
  WHILE i < size LOOP
    id := id || substr(urlAlphabet, get_byte(bytes, i) % 64 + 1, 1);
    i := i + 1;
  END LOOP;
  RETURN id;
END;
$$ LANGUAGE plpgsql VOLATILE;