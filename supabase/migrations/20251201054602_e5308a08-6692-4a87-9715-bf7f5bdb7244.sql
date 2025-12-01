-- Create virtual field trips system with narration and quizzes

-- Field trips table
CREATE TABLE field_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  site_id UUID REFERENCES geological_sites(id) ON DELETE SET NULL,
  panorama_url TEXT NOT NULL,
  duration_minutes INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Narration waypoints in the field trip
CREATE TABLE field_trip_waypoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_trip_id UUID NOT NULL REFERENCES field_trips(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  camera_position JSONB NOT NULL, -- {lon: number, lat: number}
  narration_text TEXT NOT NULL,
  narration_audio_url TEXT, -- Generated TTS audio
  duration_seconds INTEGER DEFAULT 10,
  auto_advance BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quiz questions at specific points
CREATE TABLE field_trip_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_trip_id UUID NOT NULL REFERENCES field_trips(id) ON DELETE CASCADE,
  waypoint_id UUID REFERENCES field_trip_waypoints(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')) DEFAULT 'multiple_choice',
  options JSONB, -- Array of answer options for multiple choice
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Student progress tracking
CREATE TABLE field_trip_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  field_trip_id UUID NOT NULL REFERENCES field_trips(id) ON DELETE CASCADE,
  current_waypoint_id UUID REFERENCES field_trip_waypoints(id) ON DELETE SET NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  total_possible_points INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, field_trip_id)
);

-- Quiz answers submitted by students
CREATE TABLE quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES field_trip_quizzes(id) ON DELETE CASCADE,
  field_trip_id UUID NOT NULL REFERENCES field_trips(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_earned INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

-- Enable RLS
ALTER TABLE field_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_trip_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_trip_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_trip_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for field_trips
CREATE POLICY "Anyone can view published field trips"
  ON field_trips FOR SELECT
  USING (published = true OR creator_id = auth.uid());

CREATE POLICY "Educators can create field trips"
  ON field_trips FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their field trips"
  ON field_trips FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their field trips"
  ON field_trips FOR DELETE
  USING (auth.uid() = creator_id);

-- RLS Policies for waypoints
CREATE POLICY "Users can view waypoints of accessible field trips"
  ON field_trip_waypoints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM field_trips 
      WHERE field_trips.id = field_trip_waypoints.field_trip_id 
      AND (field_trips.published = true OR field_trips.creator_id = auth.uid())
    )
  );

CREATE POLICY "Creators can manage waypoints"
  ON field_trip_waypoints FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM field_trips 
      WHERE field_trips.id = field_trip_waypoints.field_trip_id 
      AND field_trips.creator_id = auth.uid()
    )
  );

-- RLS Policies for quizzes
CREATE POLICY "Users can view quizzes of accessible field trips"
  ON field_trip_quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM field_trips 
      WHERE field_trips.id = field_trip_quizzes.field_trip_id 
      AND (field_trips.published = true OR field_trips.creator_id = auth.uid())
    )
  );

CREATE POLICY "Creators can manage quizzes"
  ON field_trip_quizzes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM field_trips 
      WHERE field_trips.id = field_trip_quizzes.field_trip_id 
      AND field_trips.creator_id = auth.uid()
    )
  );

-- RLS Policies for progress tracking
CREATE POLICY "Users can view their own progress"
  ON field_trip_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
  ON field_trip_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON field_trip_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for quiz submissions
CREATE POLICY "Users can view their own submissions"
  ON quiz_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit answers"
  ON quiz_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_field_trips_creator ON field_trips(creator_id);
CREATE INDEX idx_field_trips_published ON field_trips(published);
CREATE INDEX idx_waypoints_field_trip ON field_trip_waypoints(field_trip_id, sequence_number);
CREATE INDEX idx_quizzes_field_trip ON field_trip_quizzes(field_trip_id);
CREATE INDEX idx_progress_user_trip ON field_trip_progress(user_id, field_trip_id);
CREATE INDEX idx_submissions_user ON quiz_submissions(user_id, field_trip_id);

-- Updated_at trigger
CREATE TRIGGER update_field_trips_updated_at
  BEFORE UPDATE ON field_trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();