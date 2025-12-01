-- Add panoramic images and hotspots to geological sites

-- Add panorama_images column to store 360-degree photos with hotspots
ALTER TABLE geological_sites
ADD COLUMN IF NOT EXISTS panorama_images JSONB DEFAULT '[]'::jsonb;

-- Add comment explaining the structure
COMMENT ON COLUMN geological_sites.panorama_images IS 'Array of panoramic image objects with structure: [{url: string, title: string, hotspots: [{position: {x: number, y: number, z: number}, title: string, description: string, feature_type: string}]}]';