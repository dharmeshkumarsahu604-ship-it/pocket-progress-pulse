
-- Insert Borra Caves (Andhra Pradesh)
INSERT INTO geological_sites (name, description, country, state, district, latitude, longitude, rock_types, geological_formation, age, significance, accessibility, best_visit_time, image_url)
VALUES 
(
  'Borra Caves',
  'Borra Caves are one of the largest caves in India, formed by the Gosthani River flowing over limestone deposits. The caves feature stunning stalactite and stalagmite formations created over millions of years through the dissolution of limestone by carbonic acid in water. The caves extend to a depth of 80 meters and contain unique formations resembling a Shiva Lingam, human brain, and other natural sculptures.',
  'India',
  'Andhra Pradesh',
  'Visakhapatnam',
  18.2833,
  83.0333,
  ARRAY['Limestone', 'Calcium Carbonate', 'Dolomite'],
  'Karstic limestone cave formation',
  'Approximately 150 million years (Jurassic period)',
  'One of the largest and deepest caves in India with remarkable stalactite and stalagmite formations. Important for understanding karst topography and limestone dissolution processes.',
  'Well accessible with paved roads from Visakhapatnam (90 km). Cable car and walkway available inside caves.',
  'October to March',
  '/images/sites/caves.jpg'
);

-- Insert Gupteswar Cave (Odisha)
INSERT INTO geological_sites (name, description, country, state, district, latitude, longitude, rock_types, geological_formation, age, significance, accessibility, best_visit_time, image_url)
VALUES 
(
  'Gupteswar Cave',
  'Gupteswar Cave is a sacred limestone cave temple located near Jeypore in Odisha. The cave houses a naturally formed Shiva Lingam and features impressive stalactite and stalagmite formations. The cave system extends deep into the hillside with multiple chambers containing various mineral deposits and geological formations typical of karst landscapes.',
  'India',
  'Odisha',
  'Koraput',
  18.8167,
  82.5667,
  ARRAY['Limestone', 'Calcite', 'Dolomite'],
  'Karstic limestone cave with speleothems',
  'Approximately 100-150 million years',
  'Important geological site demonstrating karst topography in Eastern Ghats. Features naturally formed Shiva Lingam stalactite. Significant for studying limestone cave formation processes.',
  'Accessible by road from Jeypore (5 km). Steps lead down to the cave entrance. Moderate difficulty.',
  'October to February',
  '/images/sites/caves.jpg'
);
