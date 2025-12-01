-- Add images array field to geological_sites table
-- This will store multiple images with metadata (caption, type, season)
ALTER TABLE geological_sites
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Add a comment explaining the structure
COMMENT ON COLUMN geological_sites.images IS 'Array of image objects with structure: [{url: string, caption: string, type: string, season?: string}]';

-- Migrate existing image_url data to images array
UPDATE geological_sites
SET images = jsonb_build_array(
  jsonb_build_object(
    'url', image_url,
    'caption', 'Main view of ' || name,
    'type', 'main'
  )
)
WHERE image_url IS NOT NULL AND images = '[]'::jsonb;