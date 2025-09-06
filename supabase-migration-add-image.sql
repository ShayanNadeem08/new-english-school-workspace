-- Migration: Add image_url column to existing students table
-- Run this in your Supabase SQL Editor if you already have the students table

-- Add image_url column to existing students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN students.image_url IS 'Stores base64 encoded image data for student photos';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'students' 
ORDER BY ordinal_position;
