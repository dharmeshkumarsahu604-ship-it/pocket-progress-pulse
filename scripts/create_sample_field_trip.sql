-- Create a sample virtual field trip for Lonar Crater

-- Note: Replace 'YOUR_USER_ID' with an actual user ID from your auth.users table

-- Insert field trip
INSERT INTO field_trips (
  creator_id,
  title,
  description,
  panorama_url,
  duration_minutes,
  difficulty_level,
  published
) VALUES (
  'YOUR_USER_ID', -- Replace with actual user ID
  'Discovering Lonar Crater: A Meteorite Impact Journey',
  'Explore the geological wonders of Lonar Crater, a 52,000-year-old meteorite impact site. Learn about impact geology, basaltic formations, and unique saline lake ecosystems through interactive narration and quizzes.',
  '/images/sites/lonar-crater-360.jpg',
  25,
  'intermediate',
  true
) RETURNING id;

-- Get the field trip ID from above and use it below

-- Insert waypoint 1: Introduction at crater rim
INSERT INTO field_trip_waypoints (
  field_trip_id,
  sequence_number,
  camera_position,
  narration_text,
  duration_seconds,
  auto_advance
) VALUES (
  'FIELD_TRIP_ID', -- Replace with the ID from above
  1,
  '{"lon": 0, "lat": 0}',
  'Welcome to Lonar Crater! You are standing at the rim of one of the most remarkable geological features in India. This circular depression was formed about 52,000 years ago when a meteorite traveling at tremendous speed struck the Earth, creating this massive impact crater in the Deccan Traps basalt.',
  15,
  true
);

-- Insert waypoint 2: Basaltic walls
INSERT INTO field_trip_waypoints (
  field_trip_id,
  sequence_number,
  camera_position,
  narration_text,
  duration_seconds,
  auto_advance
) VALUES (
  'FIELD_TRIP_ID',
  2,
  '{"lon": 45, "lat": -10}',
  'Look at these dark, columnar basalt formations along the crater walls. The intense heat and pressure from the meteorite impact melted and fractured the Deccan Traps basalt. Notice the vertical columns - these formed as the rock cooled and contracted after the impact. This is a classic example of shock metamorphism.',
  18,
  true
);

-- Insert quiz 1: About the crater formation
INSERT INTO field_trip_quizzes (
  field_trip_id,
  waypoint_id,
  question,
  question_type,
  options,
  correct_answer,
  explanation,
  points
) VALUES (
  'FIELD_TRIP_ID',
  (SELECT id FROM field_trip_waypoints WHERE field_trip_id = 'FIELD_TRIP_ID' AND sequence_number = 2),
  'What caused the columnar jointing in the basalt at Lonar Crater?',
  'multiple_choice',
  '["Volcanic eruption and lava cooling", "Meteorite impact, melting, and rapid cooling", "Erosion by water over millions of years", "Tectonic plate movement"]'::jsonb,
  'Meteorite impact, melting, and rapid cooling',
  'The columnar joints formed when the basalt was melted by the impact and then rapidly cooled. As it cooled, it contracted and fractured into these distinctive vertical columns - a process similar to drying mud cracking, but on a much larger scale.',
  15
);

-- Insert waypoint 3: Saline lake
INSERT INTO field_trip_waypoints (
  field_trip_id,
  sequence_number,
  camera_position,
  narration_text,
  duration_seconds,
  auto_advance
) VALUES (
  'FIELD_TRIP_ID',
  3,
  '{"lon": -60, "lat": 5}',
  'At the bottom of the crater lies a unique saline and alkaline lake, formed by groundwater seepage. The water chemistry here is quite unusual - it has high pH and salinity levels. This creates a special environment that hosts extremophile microorganisms, similar to those scientists study as analogs for potential life on Mars!',
  20,
  true
);

-- Insert quiz 2: About the lake
INSERT INTO field_trip_quizzes (
  field_trip_id,
  waypoint_id,
  question,
  question_type,
  options,
  correct_answer,
  explanation,
  points
) VALUES (
  'FIELD_TRIP_ID',
  (SELECT id FROM field_trip_waypoints WHERE field_trip_id = 'FIELD_TRIP_ID' AND sequence_number = 3),
  'True or False: The organisms living in Lonar Crater lake are studied as analogs for potential life on Mars.',
  'true_false',
  '["True", "False"]'::jsonb,
  'True',
  'Correct! The extreme conditions in the crater lake - high salinity, high pH, and unique chemistry - make it an excellent analog for studying how life might exist in extreme environments on other planets.',
  10
);

-- Insert waypoint 4: Ejecta blanket
INSERT INTO field_trip_waypoints (
  field_trip_id,
  sequence_number,
  camera_position,
  narration_text,
  duration_seconds,
  auto_advance
) VALUES (
  'FIELD_TRIP_ID',
  4,
  '{"lon": 120, "lat": -15}',
  'These scattered rocks around the crater rim are part of the ejecta blanket - material that was thrown out during the impact. Some of these fragments traveled hundreds of meters! Scientists study these rocks because they show features of shock metamorphism, providing evidence of the extreme conditions during the impact.',
  17,
  true
);

-- Insert final quiz
INSERT INTO field_trip_quizzes (
  field_trip_id,
  waypoint_id,
  question,
  question_type,
  options,
  correct_answer,
  explanation,
  points
) VALUES (
  'FIELD_TRIP_ID',
  (SELECT id FROM field_trip_waypoints WHERE field_trip_id = 'FIELD_TRIP_ID' AND sequence_number = 4),
  'Approximately how old is Lonar Crater?',
  'multiple_choice',
  '["5,200 years old", "52,000 years old", "520,000 years old", "5.2 million years old"]'::jsonb,
  '52,000 years old',
  'Lonar Crater was formed approximately 52,000 years ago during the Pleistocene epoch. This makes it one of the youngest impact craters on Earth, and one of the best preserved in basaltic rock.',
  15
);
