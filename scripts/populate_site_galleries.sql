-- Populate image galleries for geological sites with multiple views

-- Chilika Lake (Odisha) - Multiple angles and seasons
UPDATE geological_sites 
SET images = '[
  {"url": "/images/sites/chilika-lake.jpg", "caption": "Main view of Chilika Lake", "type": "main"},
  {"url": "/images/sites/chilika-lake-aerial.jpg", "caption": "Aerial view showing the vast lagoon with scattered islands", "type": "aerial", "season": "sunset"},
  {"url": "/images/sites/chilika-lake-closeup.jpg", "caption": "Shallow brackish water with sedimentary deposits", "type": "closeup", "season": "morning"},
  {"url": "/images/sites/chilika-lake-winter.jpg", "caption": "Winter scene with migratory flamingos", "type": "wildlife", "season": "winter"}
]'::jsonb
WHERE name = 'Chilika Lake';

-- Lonar Crater Lake (Maharashtra) - Different angles
UPDATE geological_sites 
SET images = '[
  {"url": "/images/sites/lonar-crater-lake.jpg", "caption": "Lonar Crater Lake from the rim", "type": "main"},
  {"url": "/images/sites/lonar-crater-wide.jpg", "caption": "Wide angle view of the circular meteor impact crater", "type": "aerial"},
  {"url": "/images/sites/lonar-crater-rocks.jpg", "caption": "Close-up of dark basaltic rock formations at crater rim", "type": "geological", "season": "golden hour"},
  {"url": "/images/sites/lonar-crater.jpg", "caption": "Panoramic view of the ancient crater", "type": "panoramic"}
]'::jsonb
WHERE name = 'Lonar Crater Lake';

-- Western Ghats - Multiple perspectives
UPDATE geological_sites 
SET images = '[
  {"url": "/images/sites/western-ghats.jpg", "caption": "Western Ghats mountain range", "type": "main"},
  {"url": "/images/sites/western-ghats-monsoon.jpg", "caption": "Lush rainforest with mist-covered peaks and waterfalls", "type": "landscape", "season": "monsoon"},
  {"url": "/images/sites/western-ghats-formations.jpg", "caption": "Layered basaltic rock formations showing plateau edge", "type": "geological", "season": "sunset"}
]'::jsonb
WHERE name = 'Western Ghats';

-- Deccan Traps (Maharashtra) - Geological formations
UPDATE geological_sites 
SET images = '[
  {"url": "/images/sites/deccan-traps.jpg", "caption": "Deccan Traps basaltic formations", "type": "main"},
  {"url": "/images/sites/deccan-traps-layers.jpg", "caption": "Massive layered basaltic lava flows creating step-like plateau", "type": "geological"}
]'::jsonb
WHERE name = 'Deccan Traps';

-- Marble Rocks/Bhedaghat - Different views
UPDATE geological_sites 
SET images = '[
  {"url": "/images/sites/marble-rocks.jpg", "caption": "Marble Rocks along Narmada River", "type": "main"},
  {"url": "/images/sites/marble-rocks-bhedaghat.jpg", "caption": "Towering marble cliffs from river level", "type": "closeup"}
]'::jsonb
WHERE name LIKE '%Marble Rocks%' OR name LIKE '%Bhedaghat%';
