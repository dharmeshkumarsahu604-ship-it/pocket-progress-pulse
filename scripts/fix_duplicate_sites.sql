-- Delete duplicate geological sites (keeping the first entry of each)
DELETE FROM geological_sites 
WHERE id IN (
  '3cec2e2a-0ee6-400a-b5c4-ed27a337f880', 'b2cc14c5-247e-437f-b5ef-7a90e2ed23fa',
  'de6fb171-02af-4643-82ba-af0cd282e307', '1424056e-bd34-4e3c-a367-990bdc5dd873',
  '9f9e00db-934f-4b2f-833e-6351b9e570ec', '099cfcec-7755-4fe5-8e9c-97b255c7d885',
  '7fd0df53-4931-4012-8cad-c3c52be019e6', '797d4e42-dcd6-4a14-8ce9-a3fbf50c5c8c',
  '9d29158a-2a73-40b3-91cc-08f096f8ae9d', '47ec10e4-ae57-4222-8825-396d0e0b104c',
  '7130981f-9d1d-47bd-916c-b2b419aec147', 'f94514c4-8d05-4679-b8e2-5dfc04bd5a30',
  '64d09827-59e6-4ebe-849d-56f57ca93358', '8445c030-eb76-4840-bf51-4c9d2455a8b8',
  '2808a962-de15-4f1d-bbd1-3e0561637301', '72314bcb-85bf-4afa-bf7c-1ecb266fb9c6',
  'aa356fb2-6393-42e3-9658-3fcc86c24664', '238ebe6b-4940-4f83-a660-deb1fc94c2f8',
  'e54c7d77-90a4-4f8d-8f6c-acd8044279af', '97c20366-0514-4695-9560-9060d9b38f14',
  '70078416-a4ee-4ab1-87ed-f8283f7abd3b', '2b79e1d9-ff00-49c2-a902-47ebb0c33fe8',
  'e150833d-d100-433f-b7e6-c74c3df1fffe', '1ed4c900-f6b7-4224-b96a-ece680799651',
  '98bb26c1-f3e7-4cd0-8fa9-5c95a536e7fd', 'df2b4abc-26e2-4f7a-b00c-667226e8bb9f',
  '865f872e-68b4-476f-b234-5f8be88d7961', '63aae78e-2baf-4fa7-9a3d-32fd9d47e003',
  'cf0f6388-b311-4f73-8cca-15fda9dc643b', '1cafadb1-193d-448c-95f6-5e478c39829c'
);

-- Add diverse geological sites from underrepresented Indian states
INSERT INTO geological_sites (name, description, country, state, district, latitude, longitude, rock_types, geological_formation, age, significance, accessibility, best_visit_time, image_url)
VALUES
  -- Punjab
  ('Ropar Wetlands', 'Ancient floodplain deposits and quaternary sediments along the Sutlej River with rich archaeological and geological significance', 'India', 'Punjab', 'Rupnagar', 30.9606, 76.5345, ARRAY['Alluvium', 'Quaternary deposits'], 'Floodplain sediments', 'Quaternary', 'Important for studying river dynamics and sediment deposition in the Indo-Gangetic plains', 'Easy', 'October to March', '/images/sites/coastal-rocks.jpg'),
  
  -- Haryana
  ('Aravalli Ridges Faridabad', 'Southern extension of the Aravalli Range with ancient quartzite formations and metamorphic rocks', 'India', 'Haryana', 'Faridabad', 28.4089, 77.3178, ARRAY['Quartzite', 'Schist', 'Phyllite'], 'Aravalli Supergroup', 'Proterozoic (1.8-2.5 billion years)', 'One of the oldest mountain ranges on Earth, representing ancient orogeny', 'Moderate', 'October to March', '/images/sites/aravalli.jpg'),
  
  -- Bihar
  ('Rajgir Hills', 'Ancient granite hills with hot springs, Buddhist sites, and diverse geological features', 'India', 'Bihar', 'Nalanda', 25.0285, 85.4211, ARRAY['Granite', 'Gneiss', 'Basalt'], 'Chhotanagpur Granite-Gneiss Complex', 'Precambrian', 'Historic site with diverse rock formations, thermal springs, and ancient volcanic activity', 'Easy', 'October to March', '/images/sites/granite-rocks.jpg'),
  
  -- Delhi
  ('Delhi Ridge', 'Northern extension of Aravalli Range with ancient quartzite outcrops in urban setting', 'India', 'Delhi', 'Central Delhi', 28.7041, 77.1025, ARRAY['Quartzite', 'Mica schist', 'Phyllite'], 'Aravalli Supergroup', 'Proterozoic (1.5 billion years)', 'Ancient rock formations within urban landscape providing ecological services', 'Easy', 'Year-round', '/images/sites/rock-formations.jpg'),
  
  -- Sikkim
  ('Khangchendzonga Region', 'Himalayan metamorphic rocks, glacial formations, and high-altitude geology', 'India', 'Sikkim', 'North Sikkim', 27.7025, 88.1475, ARRAY['Gneiss', 'Schist', 'Granite', 'Migmatite'], 'Higher Himalayan Crystalline', 'Paleozoic-Mesozoic', 'World third-highest peak with complex geology showing continental collision', 'Difficult', 'April to June, September to November', '/images/sites/himalayan-range.jpg'),
  
  -- Nagaland
  ('Dzukou Valley', 'Tertiary sandstone formations creating a unique valley ecosystem at high altitude', 'India', 'Nagaland', 'Kohima', 25.5160, 94.1086, ARRAY['Sandstone', 'Shale', 'Siltstone'], 'Indo-Myanmar Ranges', 'Tertiary', 'Unique valley formation with seasonal biodiversity and distinct sedimentary layers', 'Moderate', 'June to September', '/images/sites/valley-of-flowers.jpg'),
  
  -- Mizoram
  ('Phawngpui Blue Mountain', 'Sedimentary rock formations of the Indo-Myanmar ranges with unique flora', 'India', 'Mizoram', 'Saiha', 22.6380, 93.0190, ARRAY['Sandstone', 'Shale', 'Mudstone'], 'Surma Group', 'Tertiary (Miocene)', 'Highest peak in Mizoram with panoramic views and rich biodiversity', 'Moderate', 'October to March', '/images/sites/rock-formations.jpg'),
  
  -- Manipur
  ('Loktak Lake', 'Freshwater lake with floating phumdis (biomass islands) and quaternary deposits', 'India', 'Manipur', 'Bishnupur', 24.5552, 93.7791, ARRAY['Alluvium', 'Peat', 'Organic deposits'], 'Quaternary deposits', 'Holocene', 'Unique floating islands and wetland ecosystem, only floating lake in the world', 'Easy', 'October to March', '/images/sites/chilika-lake.jpg'),
  
  -- Tripura
  ('Jampui Hills', 'Tertiary sandstone and shale formations with distinct stratification', 'India', 'Tripura', 'North Tripura', 23.9742, 92.2047, ARRAY['Sandstone', 'Shale', 'Conglomerate'], 'Surma and Tipam Groups', 'Tertiary', 'Scenic hills with distinct geological layers visible in road cuts', 'Moderate', 'October to March', '/images/sites/rock-formations.jpg'),
  
  -- Arunachal Pradesh
  ('Tawang Monastery Area', 'High-altitude Himalayan formations with gneiss, granite, and complex tectonics', 'India', 'Arunachal Pradesh', 'Tawang', 27.5861, 91.8586, ARRAY['Gneiss', 'Granite', 'Schist', 'Marble'], 'Higher Himalayan Crystalline', 'Paleozoic', 'Complex tectonic zone near Indo-Tibetan border showing thrust faults', 'Difficult', 'April to October', '/images/sites/himalayan-range.jpg'),
  
  -- Pondicherry
  ('Auroville Geological Site', 'Coastal laterite and sedimentary formations showing tropical weathering', 'India', 'Pondicherry', 'Viluppuram', 12.0059, 79.8101, ARRAY['Laterite', 'Sandstone', 'Cuddalore sandstone'], 'Coastal formations', 'Quaternary', 'Excellent example of coastal weathering and laterite formation processes', 'Easy', 'November to February', '/images/sites/coastal-rocks.jpg'),
  
  -- Andaman & Nicobar
  ('Barren Island Volcano', 'India only active volcano with basaltic lava flows and fumaroles', 'India', 'Andaman & Nicobar Islands', 'North Andaman', 12.2833, 93.8583, ARRAY['Basalt', 'Volcanic ash', 'Pumice'], 'Volcanic formation', 'Holocene (active)', 'Only confirmed active volcano in South Asia, part of volcanic arc', 'Difficult (restricted access)', 'November to April', '/images/sites/rock-formations.jpg'),
  
  -- Lakshadweep
  ('Kavaratti Coral Reefs', 'Living coral reefs and atolls formed on volcanic base', 'India', 'Lakshadweep', 'Kavaratti', 10.5626, 72.6369, ARRAY['Coral limestone', 'Biogenic carbonates'], 'Coral reef formation', 'Holocene', 'Active coral reef ecosystem showing carbonate deposition', 'Moderate (permit required)', 'October to March', '/images/sites/coastal-rocks.jpg'),
  
  -- More diverse Odisha sites
  ('Nandankanan Geological Trail', 'Archaean granites and laterite formations within protected forest', 'India', 'Odisha', 'Khordha', 20.3974, 85.8159, ARRAY['Granite', 'Laterite', 'Gneiss'], 'Eastern Ghats Mobile Belt', 'Archaean', 'Ancient crystalline rocks with rich biodiversity and weathering features', 'Easy', 'October to March', '/images/sites/granite-rocks.jpg'),
  
  ('Konark Coast', 'Marine terraces and coastal sandstone formations showing sea-level changes', 'India', 'Odisha', 'Puri', 19.8876, 86.0945, ARRAY['Sandstone', 'Marine sediments', 'Beach sand'], 'Coastal formations', 'Quaternary', 'Coastal erosion, marine terrace features, and active beach processes', 'Easy', 'October to March', '/images/sites/coastal-rocks.jpg'),
  
  ('Satkosia Gorge', 'Dramatic gorge cut through Eastern Ghats rocks by Mahanadi River', 'India', 'Odisha', 'Angul', 20.5408, 84.8628, ARRAY['Granite', 'Gneiss', 'Charnockite'], 'Eastern Ghats Mobile Belt', 'Archaean-Proterozoic', 'Deep gorge formation showing river incision through ancient rocks', 'Moderate', 'October to March', '/images/sites/rock-formations.jpg'),
  
  -- Additional unique Indian sites
  ('Panna Diamond Mines', 'Only active diamond mining area in India with kimberlite pipes', 'India', 'Madhya Pradesh', 'Panna', 24.7200, 80.1940, ARRAY['Kimberlite', 'Lamproite', 'Diamond-bearing rocks'], 'Vindhyan Supergroup', 'Proterozoic (1.1 billion years)', 'India only operational diamond mine with kimberlite intrusions', 'Difficult (restricted)', 'October to March', '/images/sites/rock-formations.jpg'),
  
  ('Dholavira Archaeological Site', 'Harappan civilization site on ancient river channels', 'India', 'Gujarat', 'Kutch', 23.8873, 70.2176, ARRAY['Alluvium', 'Sandstone', 'Limestone'], 'Quaternary deposits', 'Holocene', 'Ancient river system and geological setting of Harappan civilization', 'Moderate', 'October to March', '/images/sites/rock-formations.jpg'),
  
  ('Borra Caves', 'Large limestone caves with stalactites and stalagmites', 'India', 'Andhra Pradesh', 'Visakhapatnam', 18.2833, 83.0500, ARRAY['Limestone', 'Dolomite'], 'Gondwana formations', 'Paleozoic', 'Extensive cave system showing karst topography and speleothem formation', 'Easy', 'Year-round', '/images/sites/caves.jpg'),
  
  ('Pachmarhi Biosphere', 'Sandstone plateaus with distinctive rock formations and waterfalls', 'India', 'Madhya Pradesh', 'Hoshangabad', 22.4676, 78.4330, ARRAY['Sandstone', 'Shale'], 'Gondwana and Vindhyan Supergroups', 'Paleozoic-Proterozoic', 'Unique sandstone formations, caves, and fossil-bearing rocks', 'Easy', 'October to April', '/images/sites/rock-formations.jpg')
ON CONFLICT (id) DO NOTHING;
