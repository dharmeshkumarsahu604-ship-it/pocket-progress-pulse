-- Create compass_readings table for storing Brunton compass measurements
CREATE TABLE public.compass_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('strike', 'dip', 'strike_dip', 'trend_plunge', 'bearing')),
  strike NUMERIC,
  dip NUMERIC,
  trend NUMERIC,
  plunge NUMERIC,
  bearing NUMERIC,
  azimuth NUMERIC NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  notes TEXT,
  photos TEXT[] DEFAULT '{}',
  lithology TEXT,
  structure_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.compass_readings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for compass_readings
CREATE POLICY "Users can view their own compass readings"
ON public.compass_readings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own compass readings"
ON public.compass_readings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compass readings"
ON public.compass_readings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own compass readings"
ON public.compass_readings
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries by user
CREATE INDEX idx_compass_readings_user_id ON public.compass_readings(user_id);
CREATE INDEX idx_compass_readings_created_at ON public.compass_readings(created_at DESC);