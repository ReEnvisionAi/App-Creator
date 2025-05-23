/*
  # Add public read access to chat table
  
  1. Changes
    - Add policy to allow public read access to all chats
    
  2. Security
    - Allows unauthenticated users to read chat data
    - Maintains existing policies for authenticated users
*/

CREATE POLICY "Allow public read access" 
ON chat
FOR SELECT 
TO public
USING (true);