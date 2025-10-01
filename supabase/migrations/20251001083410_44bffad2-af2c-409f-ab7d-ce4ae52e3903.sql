-- Create storage bucket for camera videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'camera-videos',
  'camera-videos',
  true,
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
);

-- Create RLS policies for camera videos bucket
CREATE POLICY "Anyone can view camera videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'camera-videos');

CREATE POLICY "Authenticated users can upload camera videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'camera-videos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update their camera videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'camera-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete camera videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'camera-videos' AND auth.role() = 'authenticated');