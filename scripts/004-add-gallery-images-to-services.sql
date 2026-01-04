-- Migration: Add gallery_images column to services table
-- This script adds the gallery_images column to the services table if it doesn't exist

-- For MySQL
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS gallery_images JSON,
ADD COLUMN IF NOT EXISTS features JSON;

-- Update any existing services that might have featured_images in the old format
-- to move them to the new gallery_images column if needed
-- (This is a safety measure if there were any services with images in the old featured_images column)