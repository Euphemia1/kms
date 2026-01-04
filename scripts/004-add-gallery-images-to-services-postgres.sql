-- Migration: Add gallery_images column to services table (PostgreSQL)
-- This script adds the gallery_images column to the services table if it doesn't exist

-- For PostgreSQL
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS gallery_images JSONB,
ADD COLUMN IF NOT EXISTS features JSONB;