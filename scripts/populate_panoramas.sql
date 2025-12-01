-- Populate 360-degree panoramic images with geological feature hotspots

-- Lonar Crater Lake - 360 panorama with hotspots
UPDATE geological_sites 
SET panorama_images = '[
  {
    "url": "/images/sites/lonar-crater-360.jpg",
    "title": "360° View from Crater Rim",
    "hotspots": [
      {
        "position": {"x": 200, "y": -50, "z": 100},
        "title": "Basaltic Crater Walls",
        "description": "Dark columnar basalt formations from the meteor impact 52,000 years ago. The impact melted and fractured the Deccan Traps basalt, creating these distinctive vertical columns.",
        "feature_type": "Impact Structure"
      },
      {
        "position": {"x": -150, "y": 20, "z": -180},
        "title": "Saline Lake",
        "description": "The crater contains a saline, alkaline lake formed by groundwater seepage. The water chemistry is unique, hosting extremophile microorganisms similar to those found in Martian analog environments.",
        "feature_type": "Hydrogeology"
      },
      {
        "position": {"x": 0, "y": -100, "z": 200},
        "title": "Ejecta Blanket",
        "description": "The scattered basaltic rocks around the rim are part of the impact ejecta blanket, thrown out during the meteorite collision. These fragments show shock metamorphism features.",
        "feature_type": "Impact Debris"
      },
      {
        "position": {"x": 180, "y": 50, "z": -120},
        "title": "Ancient Temples",
        "description": "Historic temples built from the local basalt, demonstrating how geological resources have been utilized by civilizations around the crater for centuries.",
        "feature_type": "Cultural Geology"
      }
    ]
  }
]'::jsonb
WHERE name = 'Lonar Crater Lake';

-- Western Ghats - 360 panorama with geological features
UPDATE geological_sites 
SET panorama_images = '[
  {
    "url": "/images/sites/western-ghats-360.jpg",
    "title": "360° Mountain Peak View",
    "hotspots": [
      {
        "position": {"x": -200, "y": 0, "z": 150},
        "title": "Basaltic Plateau Edge",
        "description": "The Western Ghats are formed from massive Deccan Trap basalt flows from 66 million years ago. These layered formations create the distinctive step-like topography of the plateau edge.",
        "feature_type": "Volcanic Formation"
      },
      {
        "position": {"x": 150, "y": -80, "z": -100},
        "title": "Waterfall Formation",
        "description": "Waterfalls form where rivers flow over resistant basalt layers and erode softer underlying rocks. The multiple cascades show different hardness levels in the basaltic sequence.",
        "feature_type": "Erosional Feature"
      },
      {
        "position": {"x": 0, "y": 100, "z": -180},
        "title": "Laterite Soil Cap",
        "description": "The reddish soil on top is laterite, formed by intense tropical weathering of basalt over millions of years. Rich in iron and aluminum oxides, it supports unique rainforest vegetation.",
        "feature_type": "Weathering Product"
      },
      {
        "position": {"x": -100, "y": -50, "z": 200},
        "title": "Valley Formation",
        "description": "Deep valleys carved by rivers cutting through basalt layers during monsoon seasons. The erosion pattern reveals the internal structure of lava flows and creates biodiversity hotspots.",
        "feature_type": "Fluvial Erosion"
      }
    ]
  }
]'::jsonb
WHERE name = 'Western Ghats';

-- Marble Rocks Bhedaghat - 360 panorama
UPDATE geological_sites 
SET panorama_images = '[
  {
    "url": "/images/sites/marble-rocks-360.jpg",
    "title": "360° River View Between Marble Cliffs",
    "hotspots": [
      {
        "position": {"x": 180, "y": 80, "z": 100},
        "title": "Marble Cliff Stratification",
        "description": "These towering white and pink marble (crystalline limestone) cliffs show distinct bedding planes from their formation in ancient shallow seas during the Precambrian era, over 1 billion years ago.",
        "feature_type": "Sedimentary Layers"
      },
      {
        "position": {"x": -150, "y": 60, "z": -120},
        "title": "Folding Patterns",
        "description": "The marble shows dramatic folding caused by tectonic compression during the Indian Plate collision. These folds demonstrate the plastic behavior of rocks under high pressure and temperature.",
        "feature_type": "Tectonic Deformation"
      },
      {
        "position": {"x": 0, "y": -50, "z": 200},
        "title": "Narmada River Gorge",
        "description": "The Narmada River has carved this deep gorge through the marble over millions of years. The smooth surfaces and potholes show the erosive power of water-borne sediments.",
        "feature_type": "Fluvial Erosion"
      },
      {
        "position": {"x": 120, "y": 0, "z": -180},
        "title": "Color Variations",
        "description": "The pink and white banding in the marble is caused by varying amounts of iron oxide impurities during crystallization. Pure white areas have minimal impurities, while pink areas contain hematite.",
        "feature_type": "Mineralogy"
      }
    ]
  }
]'::jsonb
WHERE name LIKE '%Marble Rocks%' OR name LIKE '%Bhedaghat%';
