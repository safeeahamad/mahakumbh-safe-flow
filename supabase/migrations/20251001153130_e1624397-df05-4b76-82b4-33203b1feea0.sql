-- Create camera_allocations table
CREATE TABLE public.camera_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  camera_id INTEGER NOT NULL CHECK (camera_id BETWEEN 1 AND 5),
  user_email TEXT NOT NULL,
  camera_name TEXT NOT NULL,
  location TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(camera_id)
);

-- Enable RLS
ALTER TABLE public.camera_allocations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view camera allocations
CREATE POLICY "Anyone can view camera allocations"
ON public.camera_allocations
FOR SELECT
USING (true);

-- Policy: Only authenticated users can insert their own allocation
CREATE POLICY "Users can manage their own allocation"
ON public.camera_allocations
FOR ALL
USING (auth.jwt() ->> 'email' = user_email);

-- Create camera_streams table to store active stream URLs
CREATE TABLE public.camera_streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  camera_id INTEGER NOT NULL CHECK (camera_id BETWEEN 1 AND 5),
  user_email TEXT NOT NULL,
  stream_url TEXT,
  is_live BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(camera_id)
);

-- Enable RLS
ALTER TABLE public.camera_streams ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view streams
CREATE POLICY "Anyone can view streams"
ON public.camera_streams
FOR SELECT
USING (true);

-- Policy: Users can update their own stream
CREATE POLICY "Users can manage their own stream"
ON public.camera_streams
FOR ALL
USING (auth.jwt() ->> 'email' = user_email);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_camera_stream_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_camera_streams_updated_at
BEFORE UPDATE ON public.camera_streams
FOR EACH ROW
EXECUTE FUNCTION public.update_camera_stream_timestamp();