-- Update existing Odisha geological sites with real images

UPDATE geological_sites SET image_url = '/images/sites/chilika-lake.jpg' WHERE name = 'Chilika Lake Region';
UPDATE geological_sites SET image_url = '/images/sites/granite-rocks.jpg' WHERE name = 'Dhauli Hills';
UPDATE geological_sites SET image_url = '/images/sites/caves.jpg' WHERE name = 'Udayagiri Caves';
UPDATE geological_sites SET image_url = '/images/sites/coastal-rocks.jpg' WHERE name = 'Gopalpur Beach';
UPDATE geological_sites SET image_url = '/images/sites/athirapally-falls.jpg' WHERE name = 'Khandadhar Waterfall';
UPDATE geological_sites SET image_url = '/images/sites/western-ghats.jpg' WHERE name = 'Simlipal National Park';
UPDATE geological_sites SET image_url = '/images/sites/rock-formations.jpg' WHERE name LIKE '%Hills%' AND state = 'Odisha';
UPDATE geological_sites SET image_url = '/images/sites/coastal-rocks.jpg' WHERE name LIKE '%Beach%' AND state = 'Odisha';
UPDATE geological_sites SET image_url = '/images/sites/athirapally-falls.jpg' WHERE name LIKE '%Waterfall%' OR name LIKE '%Falls%';
