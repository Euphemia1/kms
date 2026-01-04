-- Add media fields to projects and job_postings tables

-- Add gallery_images field to projects table as JSON
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_images JSON DEFAULT '[]';

-- Add featured_video field to projects table (if not already added)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured_video TEXT;

-- Add featured_video field to job_postings table
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS featured_video TEXT;