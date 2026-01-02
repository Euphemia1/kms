-- Add video fields to services and job_postings tables

-- Add featured_video field to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS featured_video TEXT;

-- Add featured_video field to projects table (if not already added)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured_video TEXT;

-- Add featured_video field to job_postings table
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS featured_video TEXT;