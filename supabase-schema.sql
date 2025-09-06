-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  sr_no INTEGER,
  student_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  dob DATE,
  b_form_no TEXT,
  phone_no TEXT,
  father_id_no TEXT,
  class TEXT NOT NULL,
  ad_no TEXT NOT NULL,
  section TEXT NOT NULL CHECK (section IN ('boys', 'girls')),
  image_url TEXT, -- Store base64 encoded image or URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_class_section ON students(class, section);
CREATE INDEX IF NOT EXISTS idx_students_student_name ON students(student_name);
CREATE INDEX IF NOT EXISTS idx_students_ad_no ON students(ad_no);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin only)
CREATE POLICY "Admin can do everything on students" ON students
  FOR ALL USING (auth.role() = 'authenticated');

-- Note: You'll need to manually create an admin user in Supabase Auth
-- The admin should be the only user with access to this application
