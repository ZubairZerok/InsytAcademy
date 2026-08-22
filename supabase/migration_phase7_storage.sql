-- Storage Bucket RLS Policies for Avatars
-- To be executed in the Supabase SQL Editor if frontend upload fails due to RLS policies.

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Public Select access for any avatar object
CREATE POLICY "Public Select Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- 2. Insert policy: Authenticated users can insert their own avatar
CREATE POLICY "Insert Own Avatar" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 3. Update policy: Authenticated users can update their own avatar
CREATE POLICY "Update Own Avatar" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 4. Delete policy: Authenticated users can delete their own avatar
CREATE POLICY "Delete Own Avatar" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
