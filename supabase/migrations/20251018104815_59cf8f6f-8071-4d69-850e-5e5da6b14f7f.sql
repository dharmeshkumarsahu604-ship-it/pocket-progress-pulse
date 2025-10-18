-- Create rocks table with comprehensive specimen data
CREATE TABLE public.rocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('igneous', 'sedimentary', 'metamorphic')),
  image_url TEXT,
  description TEXT NOT NULL,
  composition TEXT,
  texture TEXT,
  color TEXT,
  formation_process TEXT,
  hardness NUMERIC,
  grain_size TEXT,
  uses TEXT,
  locations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create minerals table with physical properties
CREATE TABLE public.minerals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  chemical_formula TEXT,
  image_url TEXT,
  description TEXT NOT NULL,
  luster TEXT,
  hardness NUMERIC NOT NULL,
  color TEXT,
  streak TEXT,
  cleavage TEXT,
  fracture TEXT,
  crystal_system TEXT,
  specific_gravity NUMERIC,
  uses TEXT,
  locations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create geological sites table
CREATE TABLE public.geological_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  image_url TEXT,
  rock_types TEXT[],
  geological_formation TEXT,
  age TEXT,
  significance TEXT,
  accessibility TEXT,
  best_visit_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create collections table for user bookmarks
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('rock', 'mineral', 'site')),
  item_id UUID NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

-- Create field notes table
CREATE TABLE public.field_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  location_name TEXT,
  weather_conditions TEXT,
  photos TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create voice notes table
CREATE TABLE public.voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  transcription TEXT,
  duration INTEGER,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create scan history table
CREATE TABLE public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  identified_as TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('rock', 'mineral')),
  item_id UUID,
  confidence NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.rocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minerals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geological_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rocks (public read, admin write)
CREATE POLICY "Anyone can view rocks"
  ON public.rocks
  FOR SELECT
  USING (true);

-- RLS Policies for minerals (public read, admin write)
CREATE POLICY "Anyone can view minerals"
  ON public.minerals
  FOR SELECT
  USING (true);

-- RLS Policies for geological sites (public read, admin write)
CREATE POLICY "Anyone can view geological sites"
  ON public.geological_sites
  FOR SELECT
  USING (true);

-- RLS Policies for collections
CREATE POLICY "Users can view their own collections"
  ON public.collections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collections"
  ON public.collections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
  ON public.collections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
  ON public.collections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for field notes
CREATE POLICY "Users can view their own field notes"
  ON public.field_notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own field notes"
  ON public.field_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own field notes"
  ON public.field_notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own field notes"
  ON public.field_notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for voice notes
CREATE POLICY "Users can view their own voice notes"
  ON public.voice_notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voice notes"
  ON public.voice_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice notes"
  ON public.voice_notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voice notes"
  ON public.voice_notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for scan history
CREATE POLICY "Users can view their own scan history"
  ON public.scan_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scan history"
  ON public.scan_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scan history"
  ON public.scan_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better search performance
CREATE INDEX idx_rocks_type ON public.rocks(type);
CREATE INDEX idx_rocks_name ON public.rocks(name);
CREATE INDEX idx_minerals_hardness ON public.minerals(hardness);
CREATE INDEX idx_minerals_name ON public.minerals(name);
CREATE INDEX idx_sites_state ON public.geological_sites(state);
CREATE INDEX idx_sites_country ON public.geological_sites(country);
CREATE INDEX idx_collections_user_id ON public.collections(user_id);
CREATE INDEX idx_collections_item_type ON public.collections(item_type);
CREATE INDEX idx_field_notes_user_id ON public.field_notes(user_id);
CREATE INDEX idx_voice_notes_user_id ON public.voice_notes(user_id);
CREATE INDEX idx_scan_history_user_id ON public.scan_history(user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_rocks_updated_at
  BEFORE UPDATE ON public.rocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_minerals_updated_at
  BEFORE UPDATE ON public.minerals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON public.geological_sites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_field_notes_updated_at
  BEFORE UPDATE ON public.field_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.rocks TO authenticated, anon;
GRANT SELECT ON public.minerals TO authenticated, anon;
GRANT SELECT ON public.geological_sites TO authenticated, anon;
GRANT ALL ON public.collections TO authenticated;
GRANT ALL ON public.field_notes TO authenticated;
GRANT ALL ON public.voice_notes TO authenticated;
GRANT ALL ON public.scan_history TO authenticated;