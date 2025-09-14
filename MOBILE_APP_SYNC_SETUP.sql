-- COMPLETE MOBILE APP SYNC SETUP
-- This script ensures admin dashboard is fully synced with mobile app database
-- Run this after running the CLEANUP_ADMIN.sql script

-- 1. Ensure all required tables exist with correct mobile app structure
-- First drop existing tables to avoid conflicts
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.worker_applications CASCADE;

-- Create profiles table with proper UUID generation
CREATE TABLE public.profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id uuid, -- Optional reference to auth.users (no foreign key constraint)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic user information
  full_name TEXT,
  username TEXT UNIQUE,
  email TEXT UNIQUE, -- Make email unique to prevent duplicates
  phone TEXT,
  phone_number TEXT, -- For mobile app compatibility
  role TEXT CHECK (role IN ('citizen', 'worker', 'admin')) DEFAULT 'citizen',
  
  -- Worker specific fields
  department TEXT,
  speciality TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  status TEXT DEFAULT 'offline',
  
  -- Location tracking
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  
  -- Approval workflow
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by uuid, -- No foreign key constraint
  application_id uuid,
  
  -- Additional fields
  avatar_url TEXT,
  device_info JSONB
);

-- 2. Tasks table with mobile app compatibility
CREATE TABLE public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Task details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Street Lighting', 'Water Supply', 'Sanitation', 'Drainage', 
    'Waste Management', 'Road Maintenance', 'Electrical', 'Other'
  )),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'assigned', 'in_progress', 'completed', 'verified'
  )),
  
  -- Location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT NOT NULL,
  
  -- People involved
  citizen_id uuid REFERENCES profiles(id),
  citizen_name TEXT NOT NULL,
  citizen_phone TEXT,
  assigned_worker_id uuid REFERENCES profiles(id),
  
  -- Timeline
  assigned_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Completion data
  completion_photo TEXT,
  completion_notes TEXT,
  
  -- Photos array for mobile app
  photos TEXT[]
);

-- 3. Worker applications table
CREATE TABLE public.worker_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  phone TEXT,
  
  -- Work Details
  department TEXT NOT NULL,
  speciality TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  education TEXT,
  previous_work TEXT,
  
  -- Document Verification
  id_card_url TEXT,
  id_card_type TEXT,
  id_card_number TEXT,
  
  -- Application Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by uuid, -- No foreign key constraint
  rejection_reason TEXT,
  admin_notes TEXT,
  
  -- Contact & Emergency Info
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Skills and Qualifications
  skills TEXT[],
  certifications TEXT[],
  
  -- Auth Integration
  auth_user_id uuid, -- No foreign key constraint
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert REAL Kolkata demo data matching mobile app
INSERT INTO public.tasks (id, title, description, category, priority, status, latitude, longitude, address, citizen_name, citizen_phone, created_at) VALUES 
-- Task 1: Street Light near DLF IT Park
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Broken Street Light near DLF IT Park', 'Street light pole is broken and causing darkness in the evening. Urgent repair needed for safety.', 'Street Lighting', 'urgent', 'pending', 22.5725, 88.4310, 'DLF IT Park, Action Area I, Sector V, Kolkata', 'Ramesh Kumar', '+91 9876543210', NOW() - INTERVAL '2 hours'),

-- Task 2: Water supply issue at tech city
('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Water Supply Interruption at Tech City', 'No water supply for the past 2 days in Tech City area. Residents are facing severe difficulty.', 'Water Supply', 'high', 'assigned', 22.5650, 88.4250, 'Tech City, Action Area II, Sector V, Kolkata', 'Sunita Devi', '+91 9876543211', NOW() - INTERVAL '1 day'),

-- Task 3: Garbage collection issue at TCS
('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'Garbage Collection Issue at TCS Campus', 'Garbage has not been collected for 3 days near TCS office complex. Bad smell affecting office environment.', 'Waste Management', 'medium', 'in_progress', 22.5695, 88.4280, 'TCS Campus, Action Area III, Sector V, Kolkata', 'Rajesh Agarwal', '+91 9876543212', NOW() - INTERVAL '3 days'),

-- Task 4: Central Park maintenance
('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 'Central Park Maintenance Required', 'Regular maintenance and cleaning of the Central Park area near City Centre Mall.', 'Sanitation', 'low', 'completed', 22.5785, 88.4320, 'Central Park, Action Area I, Sector V, Kolkata', 'KMC Office Sector V', '+91 9876543213', NOW() - INTERVAL '5 days'),

-- Task 5: Drainage near Webel Bhawan
('6ba7b814-9dad-11d1-80b4-00c04fd430c8', 'Drainage Blockage near Webel Bhawan', 'Severe waterlogging due to blocked drainage system near Webel Bhawan. Road becomes impassable during rain.', 'Drainage', 'high', 'pending', 22.5775, 88.4335, 'Webel Bhawan, Action Area III, Sector V, Kolkata', 'Local Residents Committee', '+91 9876543214', NOW() - INTERVAL '6 hours'),

-- Task 6: Street light at Eco Park
('6ba7b815-9dad-11d1-80b4-00c04fd430c9', 'Flickering Street Light at Eco Park', 'Multiple street lights flickering and some completely dark near Eco Park entrance.', 'Street Lighting', 'medium', 'assigned', 22.5845, 88.4420, 'Eco Park, Action Area II, New Town, Kolkata', 'Park Security', '+91 9876543215', NOW() - INTERVAL '12 hours'),

-- Task 7: Road pothole at Salt Lake
('6ba7b816-9dad-11d1-80b4-00c04fd430ca', 'Large Pothole on Major Road', 'Dangerous pothole causing traffic issues and vehicle damage on main road.', 'Road Maintenance', 'urgent', 'pending', 22.5735, 88.4200, 'AA Block, Salt Lake, Sector I, Kolkata', 'Traffic Police', '+91 9876543216', NOW() - INTERVAL '4 hours'),

-- Task 8: Waste management at City Centre
('6ba7b817-9dad-11d1-80b4-00c04fd430cb', 'Overflowing Dustbins at City Centre', 'Multiple garbage bins overflowing near City Centre Mall, creating hygiene issues.', 'Waste Management', 'high', 'in_progress', 22.5795, 88.4305, 'City Centre, Action Area I, Sector V, Kolkata', 'Mall Management', '+91 9876543217', NOW() - INTERVAL '8 hours')

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  priority = EXCLUDED.priority,
  status = EXCLUDED.status,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  address = EXCLUDED.address,
  citizen_name = EXCLUDED.citizen_name,
  citizen_phone = EXCLUDED.citizen_phone,
  updated_at = NOW();

-- 5. Create admin profile for the specific user
-- This ensures the admin can login successfully with their email: 2004anishshit@gmail.com
INSERT INTO public.profiles (full_name, username, email, phone, role, department, approval_status, created_at, updated_at) 
VALUES ('Admin User', 'admin', '2004anishshit@gmail.com', '+91 9999999999', 'admin', 'Administration', 'approved', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  approval_status = 'approved',
  department = 'Administration',
  updated_at = NOW();

-- 6. Create function to link auth user to admin profile after authentication
CREATE OR REPLACE FUNCTION public.link_auth_to_admin_profile(user_id uuid, user_email text)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET auth_user_id = user_id, 
      updated_at = NOW()
  WHERE email = user_email AND role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create demo workers that can be used for task assignment
-- Note: These workers will have NULL auth_user_id since they don't have auth.users entries
-- They can still be used for demonstration and testing
INSERT INTO public.profiles (full_name, username, phone, role, department, speciality, approval_status, created_at, updated_at) VALUES 
('Ravi Kumar (Electrician)', 'ravi_electric', '+91 9876543301', 'worker', 'Electrical', 'Street Light Repair', 'approved', NOW(), NOW()),
('Suman Das (Plumber)', 'suman_water', '+91 9876543302', 'worker', 'Water Supply', 'Pipeline Repair', 'approved', NOW(), NOW()),
('Kiran Singh (Cleaner)', 'kiran_sanitation', '+91 9876543303', 'worker', 'Sanitation', 'Waste Management', 'approved', NOW(), NOW()),
('Amit Ghosh (Engineer)', 'amit_drainage', '+91 9876543304', 'worker', 'Public Works', 'Drainage System', 'approved', NOW(), NOW()),
('Priya Sharma (Supervisor)', 'priya_roads', '+91 9876543305', 'worker', 'Roads', 'Road Maintenance', 'approved', NOW(), NOW())

ON CONFLICT (username) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  speciality = EXCLUDED.speciality,
  approval_status = EXCLUDED.approval_status,
  updated_at = NOW();

-- Get the actual IDs of the inserted workers for task assignment
-- Store worker IDs in variables for task assignment
DO $$
DECLARE
  worker_electrician_id uuid;
  worker_plumber_id uuid;
  worker_cleaner_id uuid;
  worker_engineer_id uuid;
  worker_supervisor_id uuid;
BEGIN
  -- Get worker IDs
  SELECT id INTO worker_electrician_id FROM public.profiles WHERE username = 'ravi_electric';
  SELECT id INTO worker_plumber_id FROM public.profiles WHERE username = 'suman_water';
  SELECT id INTO worker_cleaner_id FROM public.profiles WHERE username = 'kiran_sanitation';
  SELECT id INTO worker_engineer_id FROM public.profiles WHERE username = 'amit_drainage';
  SELECT id INTO worker_supervisor_id FROM public.profiles WHERE username = 'priya_roads';

-- 8. Assign tasks to workers for realistic data using dynamic IDs
  -- Assign street light task to electrician
  IF worker_electrician_id IS NOT NULL THEN
    UPDATE public.tasks SET 
      assigned_worker_id = worker_electrician_id, 
      assigned_at = NOW() - INTERVAL '1 hour'
    WHERE id = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  END IF;

  -- Assign water supply task to plumber
  IF worker_plumber_id IS NOT NULL THEN
    UPDATE public.tasks SET 
      assigned_worker_id = worker_plumber_id, 
      assigned_at = NOW() - INTERVAL '12 hours'
    WHERE id = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
  END IF;

  -- Assign garbage task to cleaner
  IF worker_cleaner_id IS NOT NULL THEN
    UPDATE public.tasks SET 
      assigned_worker_id = worker_cleaner_id, 
      assigned_at = NOW() - INTERVAL '2 days',
      started_at = NOW() - INTERVAL '1 day'
    WHERE id = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';
  END IF;

  -- Assign completed park maintenance to cleaner
  IF worker_cleaner_id IS NOT NULL THEN
    UPDATE public.tasks SET 
      assigned_worker_id = worker_cleaner_id, 
      assigned_at = NOW() - INTERVAL '4 days',
      started_at = NOW() - INTERVAL '3 days',
      completed_at = NOW() - INTERVAL '1 day'
    WHERE id = '6ba7b813-9dad-11d1-80b4-00c04fd430c8';
  END IF;

  -- Assign Eco Park light to electrician
  IF worker_electrician_id IS NOT NULL THEN
    UPDATE public.tasks SET 
      assigned_worker_id = worker_electrician_id, 
      assigned_at = NOW() - INTERVAL '8 hours'
    WHERE id = '6ba7b815-9dad-11d1-80b4-00c04fd430c9';
  END IF;

  -- Assign City Centre waste to cleaner
  IF worker_cleaner_id IS NOT NULL THEN
    UPDATE public.tasks SET 
      assigned_worker_id = worker_cleaner_id, 
      assigned_at = NOW() - INTERVAL '6 hours',
      started_at = NOW() - INTERVAL '4 hours'
    WHERE id = '6ba7b817-9dad-11d1-80b4-00c04fd430cb';
  END IF;

END $$;

-- 9. Enable RLS on all tables (optional for testing)
-- ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.worker_applications ENABLE ROW LEVEL SECURITY;

-- 10. Create permissive policies for testing and demo purposes
-- These policies allow all operations for demonstration
DROP POLICY IF EXISTS "Allow all access to tasks" ON public.tasks;
CREATE POLICY "Allow all access to tasks" ON public.tasks
FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to profiles" ON public.profiles;
CREATE POLICY "Allow all access to profiles" ON public.profiles
FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to applications" ON public.worker_applications;
CREATE POLICY "Allow all access to applications" ON public.worker_applications
FOR ALL USING (true);

-- 11. Enable real-time for admin dashboard
ALTER publication supabase_realtime ADD TABLE public.tasks;
ALTER publication supabase_realtime ADD TABLE public.worker_applications;
ALTER publication supabase_realtime ADD TABLE public.profiles;

-- 12. Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES 
('task-photos', 'task-photos', true),
('worker-documents', 'worker-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Anyone can view task photos" ON storage.objects;
CREATE POLICY "Anyone can view task photos" ON storage.objects
FOR SELECT USING (bucket_id = 'task-photos');

DROP POLICY IF EXISTS "Anyone can view worker documents" ON storage.objects;
CREATE POLICY "Anyone can view worker documents" ON storage.objects
FOR SELECT USING (bucket_id = 'worker-documents');

-- Final verification
SELECT 'Mobile app sync setup complete!' as status;
SELECT COUNT(*) as total_tasks FROM public.tasks;
SELECT COUNT(*) as total_workers FROM public.profiles WHERE role = 'worker';
SELECT COUNT(*) as admin_profiles FROM public.profiles WHERE role = 'admin';
SELECT 
  status, 
  COUNT(*) as count 
FROM public.tasks 
GROUP BY status 
ORDER BY status;

-- Show task assignment status
SELECT 
  'Task Assignment Status:' as info,
  COUNT(CASE WHEN assigned_worker_id IS NOT NULL THEN 1 END) as assigned_tasks,
  COUNT(CASE WHEN assigned_worker_id IS NULL THEN 1 END) as unassigned_tasks
FROM public.tasks;