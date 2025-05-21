/*
  # Create screenshots bucket

  1. Storage
    - Create a new bucket called 'screenshots' for storing uploaded images
    - Enable public access to the bucket
*/

-- Create a new storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true);

-- Create a policy to allow public access to the screenshots bucket
CREATE POLICY "Allow public access to screenshots"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'screenshots');

-- Create a policy to allow authenticated users to upload screenshots
CREATE POLICY "Allow authenticated users to upload screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'screenshots');

-- Create a policy to allow authenticated users to update their own screenshots
CREATE POLICY "Allow authenticated users to update their screenshots"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'screenshots');

-- Create a policy to allow authenticated users to delete their own screenshots
CREATE POLICY "Allow authenticated users to delete their screenshots"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'screenshots');