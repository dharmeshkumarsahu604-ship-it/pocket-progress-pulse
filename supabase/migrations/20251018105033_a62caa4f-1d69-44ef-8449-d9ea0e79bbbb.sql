-- Populate rocks table with initial data
INSERT INTO public.rocks (name, type, image_url, description, composition, texture, color, formation_process, hardness, grain_size, uses, locations) VALUES
('Granite', 'igneous', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'A common coarse-grained intrusive igneous rock composed primarily of quartz, feldspar, and mica.', 'Quartz (20-60%), Feldspar (10-65%), Mica (5-15%)', 'Coarse-grained, phaneritic', 'Pink, gray, white', 'Slow cooling of magma deep underground', 6.5, 'Coarse (>5mm)', 'Construction, monuments, countertops', ARRAY['Worldwide', 'Mountain regions', 'Continental crust']),

('Basalt', 'igneous', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'A dark-colored, fine-grained extrusive igneous rock composed mainly of plagioclase and pyroxene minerals.', 'Plagioclase (>50%), Pyroxene (25-40%), Olivine (<10%)', 'Fine-grained, aphanitic', 'Dark gray to black', 'Rapid cooling of lava at Earth''s surface', 6, 'Fine (<1mm)', 'Road construction, concrete aggregate, monuments', ARRAY['Oceanic crust', 'Volcanic regions', 'India (Deccan Traps)']),

('Sandstone', 'sedimentary', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'A clastic sedimentary rock composed mainly of sand-sized mineral particles or rock fragments.', 'Quartz (>50%), Feldspar, Clay minerals', 'Clastic, granular', 'Tan, brown, red, yellow, white', 'Cementation and compaction of sand', 6, 'Medium (0.06-2mm)', 'Building stone, glass manufacturing, sandblasting', ARRAY['Deserts', 'Beaches', 'River deltas', 'India (Rajasthan)']),

('Limestone', 'sedimentary', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'A sedimentary rock composed largely of the minerals calcite and aragonite, which are different crystal forms of calcium carbonate.', 'Calcium Carbonate (CaCO3) >50%', 'Crystalline to clastic', 'White, gray, cream', 'Accumulation of shell, coral, and algal debris', 3, 'Fine to coarse', 'Cement production, building stone, agricultural lime', ARRAY['Marine environments', 'Caves', 'India (Rajasthan, MP)']),

('Marble', 'metamorphic', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'A metamorphic rock composed of recrystallized carbonate minerals, most commonly calcite or dolomite.', 'Calcite or Dolomite (>90%)', 'Crystalline, granoblastic', 'White, pink, green, black (veined)', 'Metamorphism of limestone or dolomite', 3, 'Medium to coarse', 'Sculpture, architecture, decorative stone', ARRAY['Metamorphic belts', 'Mountain regions', 'India (Rajasthan)']),

('Slate', 'metamorphic', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'A fine-grained, foliated metamorphic rock that is created by the alteration of shale or mudstone by low-grade regional metamorphism.', 'Clay minerals, Quartz, Mica', 'Fine-grained, foliated', 'Gray, black, green, red', 'Low-grade metamorphism of shale', 3.5, 'Fine (<0.1mm)', 'Roofing tiles, flooring, blackboards', ARRAY['Metamorphic regions', 'India (Himachal Pradesh)']);

-- Populate minerals table with initial data
INSERT INTO public.minerals (name, chemical_formula, image_url, description, luster, hardness, color, streak, cleavage, fracture, crystal_system, specific_gravity, uses, locations) VALUES
('Quartz', 'SiO2', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'Silicon dioxide, one of the most common minerals on Earth. Forms in various colors and crystal habits.', 'Vitreous (glassy)', 7, 'Colorless, white, purple (amethyst), pink (rose quartz)', 'White', 'None', 'Conchoidal', 'Hexagonal', 2.65, 'Jewelry, glass manufacturing, electronics, watches', ARRAY['Worldwide', 'Granite', 'Sandstone', 'India (Rajasthan, Bihar)']),

('Feldspar', 'KAlSi3O8', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'A group of rock-forming minerals that make up about 60% of the Earth''s crust. Most common in igneous rocks.', 'Vitreous', 6, 'White, pink, gray, green', 'White', 'Perfect (two directions at 90°)', 'Uneven', 'Monoclinic/Triclinic', 2.56, 'Ceramics, glass, enamel glazes', ARRAY['Granite', 'Pegmatites', 'India (Rajasthan, AP)']),

('Calcite', 'CaCO3', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'Calcium carbonate mineral, the primary constituent of limestone and marble. Reacts with dilute acid.', 'Vitreous to pearly', 3, 'Colorless, white, yellow, pink', 'White', 'Perfect (three directions)', 'Conchoidal', 'Hexagonal', 2.71, 'Cement, lime, optical instruments', ARRAY['Limestone', 'Marble', 'Caves', 'India (Rajasthan, MP)']),

('Mica', 'KAl2(AlSi3O10)(F,OH)2', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'A group of sheet silicate minerals with perfect basal cleavage. Can be split into very thin, flexible sheets.', 'Vitreous to pearly', 2.5, 'Colorless, silvery, brown, green', 'White', 'Perfect (one direction)', 'Flaky', 'Monoclinic', 2.83, 'Electrical insulators, cosmetics, paint', ARRAY['Granite', 'Schist', 'India (Bihar, Rajasthan, AP)']),

('Pyrite', 'FeS2', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'Iron sulfide, known as "Fool''s Gold" due to its metallic luster and pale brass-yellow hue. Forms cubic crystals.', 'Metallic', 6.5, 'Pale brass-yellow', 'Greenish-black', 'Poor to indistinct', 'Conchoidal to uneven', 'Cubic', 5.02, 'Sulfuric acid production, jewelry (historic)', ARRAY['Hydrothermal veins', 'Sedimentary rocks', 'India (Rajasthan, Karnataka)']),

('Gypsum', 'CaSO4·2H2O', 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', 'Hydrated calcium sulfate, very soft mineral. Forms clear to white crystals and massive beds.', 'Vitreous to pearly', 2, 'Colorless, white, gray', 'White', 'Perfect (one direction)', 'Fibrous', 'Monoclinic', 2.32, 'Plaster, drywall, cement retarder', ARRAY['Evaporite deposits', 'India (Rajasthan, Tamil Nadu)']);

-- Populate geological sites table (focus on Odisha and Indian sites)
INSERT INTO public.geological_sites (name, description, country, state, district, latitude, longitude, image_url, rock_types, geological_formation, age, significance, accessibility, best_visit_time) VALUES
('Simlipal Biosphere Reserve', 'Home to ancient Precambrian rocks, granite formations, and diverse geological features including waterfalls and forest ecosystems.', 'India', 'Odisha', 'Mayurbhanj', 21.9275, 86.4484, 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', ARRAY['Granite', 'Gneiss', 'Laterite'], 'Precambrian Crystalline Complex', 'Precambrian (>540 Ma)', 'Rich in iron ore deposits, unique geological diversity', 'Good road connectivity', 'October to March'),

('Chandipur Beach', 'Unique geological site where the sea recedes up to 5km during low tide, exposing the seabed with marine sediments and fossils.', 'India', 'Odisha', 'Balasore', 21.4500, 87.0333, 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', ARRAY['Marine sediments', 'Sandstone'], 'Quaternary Coastal Deposits', 'Quaternary (<2.6 Ma)', 'Extreme tidal phenomena, marine ecology', 'Excellent road and rail access', 'October to February'),

('Khandadhar Waterfall', 'Spectacular waterfall cascading over ancient basalt and gneiss rock formations, one of the highest in Odisha.', 'India', 'Odisha', 'Sundargarh', 22.0500, 85.2167, 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', ARRAY['Basalt', 'Gneiss'], 'Deccan Trap and Precambrian basement', 'Cretaceous-Paleogene (66 Ma)', 'Geological unconformity, mining region', 'Moderate, trekking required', 'October to February'),

('Chilika Lake', 'Asia''s largest brackish water lagoon with unique sedimentary deposits, fossils, and coastal geological features.', 'India', 'Odisha', 'Puri', 19.7500, 85.3333, 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', ARRAY['Alluvial deposits', 'Marine sediments'], 'Holocene Lagoon Deposits', 'Holocene (<11,700 years)', 'Biodiversity hotspot, coastal geomorphology', 'Excellent accessibility', 'October to March'),

('Konark Sun Temple', 'Built with Khondalite rocks, showcasing ancient architectural use of local metamorphic stones.', 'India', 'Odisha', 'Puri', 19.8876, 86.0945, 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400', ARRAY['Khondalite', 'Laterite'], 'Eastern Ghats Mobile Belt', 'Proterozoic (2500-541 Ma)', 'UNESCO World Heritage Site, architectural geology', 'Excellent road access', 'October to February');

-- Create function to search rocks by type and name
CREATE OR REPLACE FUNCTION public.search_rocks(
  search_query TEXT DEFAULT NULL,
  rock_type TEXT DEFAULT NULL,
  min_hardness NUMERIC DEFAULT NULL,
  max_hardness NUMERIC DEFAULT NULL
)
RETURNS SETOF public.rocks
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM public.rocks
  WHERE 
    (search_query IS NULL OR name ILIKE '%' || search_query || '%' OR description ILIKE '%' || search_query || '%')
    AND (rock_type IS NULL OR type = rock_type)
    AND (min_hardness IS NULL OR hardness >= min_hardness)
    AND (max_hardness IS NULL OR hardness <= max_hardness)
  ORDER BY name;
$$;

-- Create function to search minerals
CREATE OR REPLACE FUNCTION public.search_minerals(
  search_query TEXT DEFAULT NULL,
  min_hardness NUMERIC DEFAULT NULL,
  max_hardness NUMERIC DEFAULT NULL
)
RETURNS SETOF public.minerals
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM public.minerals
  WHERE 
    (search_query IS NULL OR name ILIKE '%' || search_query || '%' OR description ILIKE '%' || search_query || '%')
    AND (min_hardness IS NULL OR hardness >= min_hardness)
    AND (max_hardness IS NULL OR hardness <= max_hardness)
  ORDER BY name;
$$;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE (
  total_scans BIGINT,
  total_field_notes BIGINT,
  total_voice_notes BIGINT,
  total_bookmarks BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.scan_history WHERE user_id = user_uuid),
    (SELECT COUNT(*) FROM public.field_notes WHERE user_id = user_uuid),
    (SELECT COUNT(*) FROM public.voice_notes WHERE user_id = user_uuid),
    (SELECT COUNT(*) FROM public.collections WHERE user_id = user_uuid);
$$;