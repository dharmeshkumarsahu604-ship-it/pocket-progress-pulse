-- Comprehensive Indian Geological Sites Data
-- This adds sites from major Indian states

-- Rajasthan
INSERT INTO geological_sites (name, description, country, state, district, latitude, longitude, rock_types, geological_formation, age, significance, accessibility, best_visit_time, image_url) VALUES
('Aravalli Mountain Range', 'One of the oldest mountain ranges in the world, featuring ancient fold mountains with rich mineral deposits', 'India', 'Rajasthan', 'Multiple Districts', 25.5788, 74.8289, ARRAY['Granite', 'Gneiss', 'Quartzite', 'Marble'], 'Aravalli Supergroup', 'Proterozoic (2.5-1.8 billion years)', 'Oldest mountain range in India, critical for studying early crustal evolution and Precambrian geology', 'Moderate', 'October to March', '/placeholder.svg'),

('Sariska Tiger Reserve', 'Ancient Precambrian rocks with significant tectonic features and mineral wealth', 'India', 'Rajasthan', 'Alwar', 27.2833, 76.3333, ARRAY['Quartzite', 'Schist', 'Granite'], 'Alwar Group', 'Proterozoic', 'Important for understanding Aravalli orogeny and metamorphic processes', 'Moderate', 'October to March', '/placeholder.svg'),

-- Maharashtra  
('Deccan Traps', 'Massive flood basalt province covering most of Maharashtra, one of largest volcanic features on Earth', 'India', 'Maharashtra', 'Multiple Districts', 19.0760, 72.8777, ARRAY['Basalt', 'Tuff', 'Breccia'], 'Deccan Volcanic Province', 'Cretaceous-Paleogene (66 million years)', 'One of largest volcanic provinces globally, linked to K-Pg mass extinction event', 'Easy', 'Year-round', '/placeholder.svg'),

('Lonar Crater Lake', 'Only known impact crater in basaltic rock, created by meteorite impact', 'India', 'Maharashtra', 'Buldhana', 19.9833, 76.5167, ARRAY['Basalt', 'Impact breccia', 'Shocked quartz'], 'Impact structure in Deccan basalts', 'Pleistocene (50,000 years)', 'Unique meteorite impact crater, critical for impact geology and planetary science', 'Easy', 'October to March', '/placeholder.svg'),

('Ajanta Caves', 'Rock-cut caves in Deccan basalt showcasing volcanic rock characteristics', 'India', 'Maharashtra', 'Aurangabad', 20.5520, 75.7033, ARRAY['Basalt', 'Volcanic ash'], 'Deccan Traps', 'Cretaceous basalts', 'Demonstrates weathering and cave formation in volcanic rocks', 'Easy', 'October to March', '/placeholder.svg'),

-- Karnataka
('Western Ghats Karnataka', 'Ancient landmass with laterite plateaus and high-grade metamorphic rocks', 'India', 'Karnataka', 'Multiple Districts', 15.2993, 74.1240, ARRAY['Laterite', 'Gneiss', 'Granite', 'Schist'], 'Peninsular Gneissic Complex', 'Archean (3.0-2.5 billion years)', 'Among oldest continental crusts on Earth, biodiversity and geological hotspot', 'Moderate', 'October to May', '/placeholder.svg'),

('Hampi Boulder Formations', 'Spectacular granite boulder landscape with unique weathering patterns', 'India', 'Karnataka', 'Vijayanagara', 15.3350, 76.4600, ARRAY['Granite', 'Gneiss'], 'Closepet Granite', 'Archean', 'Iconic granite weathering features, important archaeological and geological site', 'Easy', 'October to February', '/placeholder.svg'),

('Kudremukh Iron Ore Range', 'Rich iron ore deposits in Precambrian rocks', 'India', 'Karnataka', 'Chikmagalur', 13.2544, 75.5781, ARRAY['Banded Iron Formation', 'Schist', 'Quartzite'], 'Dharwar Supergroup', 'Archean', 'Major iron ore deposits, important for studying BIF formation', 'Moderate', 'September to May', '/placeholder.svg'),

-- Tamil Nadu
('Nilgiri Hills', 'High-elevation terrain with Precambrian metamorphic rocks', 'India', 'Tamil Nadu', 'Nilgiris', 11.4064, 76.6932, ARRAY['Charnockite', 'Gneiss', 'Granulite'], 'Southern Granulite Terrain', 'Archean-Proterozoic', 'High-grade metamorphic rocks recording extreme crustal conditions', 'Moderate', 'April to June, September to November', '/placeholder.svg'),

('Kodaikanal Pillar Rocks', 'Spectacular columnar rock formations', 'India', 'Tamil Nadu', 'Dindigul', 10.2381, 77.4892, ARRAY['Granite', 'Gneiss'], 'Peninsular Gneiss', 'Archean', 'Vertical rock formations showing weathering patterns', 'Easy', 'April to June, September to January', '/placeholder.svg'),

-- Kerala
('Athirapally Waterfalls', 'Spectacular waterfall over laterite and gneiss formations', 'India', 'Kerala', 'Thrissur', 10.2854, 76.5703, ARRAY['Laterite', 'Gneiss', 'Schist'], 'Western Ghat formations', 'Archean basement', 'Demonstrates tropical weathering and laterite formation', 'Easy', 'June to September, December to May', '/placeholder.svg'),

-- Gujarat
('Gir National Park', 'Deccan basalt terrain with unique geological features', 'India', 'Gujarat', 'Junagadh', 21.1750, 70.7950, ARRAY['Basalt', 'Laterite'], 'Deccan Traps', 'Cretaceous-Paleogene', 'Volcanic rock formations with rich biodiversity', 'Moderate', 'December to March', '/placeholder.svg'),

('Rann of Kutch', 'Largest salt desert in the world with unique geological processes', 'India', 'Gujarat', 'Kutch', 23.7337, 69.8597, ARRAY['Salt deposits', 'Clay', 'Sand'], 'Recent alluvial and evaporite deposits', 'Quaternary', 'Active salt flat formation, tectonic processes, and sediment deposition', 'Moderate', 'November to February', '/placeholder.svg'),

-- Madhya Pradesh
('Bhimbetka Rock Shelters', 'Ancient rock shelters in sandstone with archaeological significance', 'India', 'Madhya Pradesh', 'Raisen', 22.9394, 77.6100, ARRAY['Sandstone', 'Quartzite'], 'Vindhyan Supergroup', 'Proterozoic', 'Rock art and sandstone weathering patterns', 'Easy', 'October to March', '/placeholder.svg'),

('Marble Rocks Bhedaghat', 'Spectacular white marble gorge carved by Narmada River', 'India', 'Madhya Pradesh', 'Jabalpur', 23.1315, 79.8088, ARRAY['Marble', 'Limestone'], 'Metamorphosed carbonates', 'Proterozoic', 'Stunning metamorphic marble formations and river erosion', 'Easy', 'October to March', '/placeholder.svg'),

-- Uttarakhand
('Himalayan Front Ranges', 'Young mountain ranges with active tectonic processes', 'India', 'Uttarakhand', 'Multiple Districts', 30.0668, 79.0193, ARRAY['Limestone', 'Sandstone', 'Slate', 'Quartzite'], 'Lesser Himalayan Sequence', 'Proterozoic-Cambrian', 'Active mountain building, fold and thrust tectonics, earthquake studies', 'Difficult', 'April to June, September to November', '/placeholder.svg'),

('Valley of Flowers', 'High-altitude valley with exposed Himalayan geology', 'India', 'Uttarakhand', 'Chamoli', 30.7268, 79.6008, ARRAY['Schist', 'Gneiss', 'Granite'], 'Higher Himalayan Crystallines', 'Precambrian-Paleozoic', 'High-grade metamorphic rocks of Himalayan orogeny', 'Difficult', 'June to September', '/placeholder.svg'),

-- Himachal Pradesh
('Rohtang Pass', 'High-altitude pass showing glacial geology and Himalayan structure', 'India', 'Himachal Pradesh', 'Kullu', 32.3726, 77.2492, ARRAY['Granite', 'Gneiss', 'Schist'], 'Higher Himalayan Crystallines', 'Precambrian', 'Glacial features, active erosion, and metamorphic rocks', 'Moderate', 'May to October', '/placeholder.svg'),

-- Jammu & Kashmir
('Ladakh Ranges', 'Trans-Himalayan geology with ophiolite suites and collision zone rocks', 'India', 'Jammu & Kashmir', 'Ladakh', 34.1526, 77.5771, ARRAY['Ophiolite', 'Granite', 'Volcanic rocks'], 'Indus Suture Zone', 'Mesozoic-Cenozoic', 'Records India-Asia collision, ophiolites marking ancient ocean floor', 'Difficult', 'May to September', '/placeholder.svg'),

-- West Bengal
('Darjeeling Himalayan Hills', 'Lesser Himalayan formations with rich geological diversity', 'India', 'West Bengal', 'Darjeeling', 27.0360, 88.2627, ARRAY['Slate', 'Phyllite', 'Quartzite', 'Limestone'], 'Lesser Himalayan Sequence', 'Proterozoic', 'Himalayan metamorphism and thrust tectonics', 'Moderate', 'March to May, October to November', '/placeholder.svg'),

-- Assam  
('Kaziranga Floodplains', 'Active floodplain with recent alluvial deposits', 'India', 'Assam', 'Golaghat', 26.5775, 93.1711, ARRAY['Alluvium', 'Sand', 'Clay'], 'Brahmaputra alluvial deposits', 'Recent Quaternary', 'Active river dynamics, sediment deposition, and floodplain evolution', 'Moderate', 'November to April', '/placeholder.svg'),

-- Andhra Pradesh
('Belum Caves', 'Longest cave system in India formed in limestone', 'India', 'Andhra Pradesh', 'Kurnool', 15.1153, 78.0447, ARRAY['Limestone', 'Dolomite'], 'Kurnool Group', 'Proterozoic', 'Extensive cave system demonstrating karst processes', 'Easy', 'October to March', '/placeholder.svg'),

('Gandikota Canyon', 'Grand Canyon of India carved by Pennar River through granite', 'India', 'Andhra Pradesh', 'Kadapa', 14.7692, 78.2769, ARRAY['Granite', 'Gneiss'], 'Peninsular Gneiss', 'Archean', 'Spectacular river erosion features in ancient crystalline rocks', 'Moderate', 'October to March', '/placeholder.svg'),

-- Telangana
('Hyderabad Granite Hills', 'Ancient granite plutons forming rocky outcrops', 'India', 'Telangana', 'Hyderabad', 17.3850, 78.4867, ARRAY['Granite', 'Gneiss'], 'Peninsular Gneissic Complex', 'Archean', 'Exposed Precambrian basement rocks', 'Easy', 'October to February', '/placeholder.svg'),

-- Goa
('Dudhsagar Waterfalls', 'Multi-tiered waterfall over Deccan basalt', 'India', 'Goa', 'South Goa', 15.3144, 74.3144, ARRAY['Basalt', 'Laterite'], 'Deccan Traps', 'Cretaceous-Paleogene', 'Volcanic rock formations with laterite weathering', 'Moderate', 'October to January', '/placeholder.svg'),

-- Chhattisgarh
('Chitrakote Waterfalls', 'Widest waterfall in India over Deccan basalt', 'India', 'Chhattisgarh', 'Bastar', 19.2017, 81.8492, ARRAY['Basalt', 'Sandstone'], 'Deccan Traps and Gondwana', 'Cretaceous-Paleogene', 'Demonstrates river erosion in volcanic terrain', 'Moderate', 'October to March', '/placeholder.svg'),

-- Jharkhand
('Parasnath Hills', 'Highest peak in Jharkhand with Precambrian rocks', 'India', 'Jharkhand', 'Giridih', 23.9625, 86.1625, ARRAY['Quartzite', 'Phyllite', 'Schist'], 'Chhotanagpur Gneissic Complex', 'Archean-Proterozoic', 'Ancient metamorphic rocks and mineral deposits', 'Moderate', 'October to March', '/placeholder.svg'),

-- Meghalaya
('Cherrapunji Limestone Caves', 'Extensive limestone cave systems in one of wettest places on Earth', 'India', 'Meghalaya', 'East Khasi Hills', 25.2611, 91.7320, ARRAY['Limestone', 'Sandstone'], 'Sylhet Limestone Formation', 'Cretaceous-Paleogene', 'Active karst processes, cave formation in high rainfall area', 'Moderate', 'October to May', '/placeholder.svg'),

('Living Root Bridges Area', 'Unique geological terrain supporting ancient bridge-building traditions', 'India', 'Meghalaya', 'East Khasi Hills', 25.2627, 91.8828, ARRAY['Sandstone', 'Limestone', 'Shale'], 'Tertiary sedimentary rocks', 'Paleogene-Neogene', 'High rainfall weathering patterns and erosion', 'Difficult', 'October to May', '/placeholder.svg')

ON CONFLICT DO NOTHING;
