-- SIMPLE MOBILE APP SYNC SETUP
-- This script provides a simpler approach to sync with mobile app
-- Run this if you encounter foreign key constraint errors

-- 1. First, let's modify the profiles table to be more flexible
-- Drop and recreate the table if needed
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id uuid, -- Optional reference to auth.users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic user information
  full_name TEXT,
  username TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('citizen', 'worker', 'admin')) DEFAULT 'citizen',
  
  -- Worker specific fields
  department TEXT,
  speciality TEXT,
  approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  status TEXT DEFAULT 'active',
  
  -- Location tracking
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8)
);

-- 2. Recreate tasks table with simpler structure
DROP TABLE IF EXISTS public.tasks CASCADE;

CREATE TABLE public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Task details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT NOT NULL,
  
  -- People involved
  citizen_id uuid,
  citizen_name TEXT NOT NULL,
  citizen_phone TEXT,
  assigned_worker_id uuid REFERENCES public.profiles(id),
  
  -- Timeline
  assigned_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Photos array for mobile app
  photos TEXT[]
);

-- 3. Create some demo workers
INSERT INTO public.profiles (full_name, username, phone, role, department, speciality, approval_status) VALUES 
('Ravi Kumar', 'ravi_electrician', '+91 9876543301', 'worker', 'Electrical', 'Street Light Repair', 'approved'),
('Suman Das', 'suman_plumber', '+91 9876543302', 'worker', 'Water Supply', 'Pipeline Repair', 'approved'),
('Kiran Singh', 'kiran_cleaner', '+91 9876543303', 'worker', 'Sanitation', 'Waste Management', 'approved'),
('Amit Ghosh', 'amit_engineer', '+91 9876543304', 'worker', 'Public Works', 'Drainage System', 'approved'),
('Priya Sharma', 'priya_supervisor', '+91 9876543305', 'worker', 'Roads', 'Road Maintenance', 'approved')

ON CONFLICT (username) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  department = EXCLUDED.department,
  speciality = EXCLUDED.speciality,
  updated_at = NOW();

-- 4. Insert demo tasks from Kolkata
INSERT INTO public.tasks (title, description, category, priority, status, latitude, longitude, address, citizen_name, citizen_phone, created_at) VALUES 
('Broken Street Light near DLF IT Park', 'Street light pole is broken and causing darkness in the evening. Urgent repair needed for safety.', 'Street Lighting', 'urgent', 'pending', 22.5725, 88.4310, 'DLF IT Park, Action Area I, Sector V, Kolkata', 'Ramesh Kumar', '+91 9876543210', NOW() - INTERVAL '2 hours'),

('Water Supply Interruption at Tech City', 'No water supply for the past 2 days in Tech City area. Residents are facing severe difficulty.', 'Water Supply', 'high', 'pending', 22.5650, 88.4250, 'Tech City, Action Area II, Sector V, Kolkata', 'Sunita Devi', '+91 9876543211', NOW() - INTERVAL '1 day'),

('Garbage Collection Issue at TCS Campus', 'Garbage has not been collected for 3 days near TCS office complex. Bad smell affecting office environment.', 'Waste Management', 'medium', 'pending', 22.5695, 88.4280, 'TCS Campus, Action Area III, Sector V, Kolkata', 'Rajesh Agarwal', '+91 9876543212', NOW() - INTERVAL '3 days'),

('Central Park Maintenance Required', 'Regular maintenance and cleaning of the Central Park area near City Centre Mall.', 'Sanitation', 'low', 'completed', 22.5785, 88.4320, 'Central Park, Action Area I, Sector V, Kolkata', 'KMC Office Sector V', '+91 9876543213', NOW() - INTERVAL '5 days'),

('Drainage Blockage near Webel Bhawan', 'Severe waterlogging due to blocked drainage system near Webel Bhawan. Road becomes impassable during rain.', 'Drainage', 'high', 'pending', 22.5775, 88.4335, 'Webel Bhawan, Action Area III, Sector V, Kolkata', 'Local Residents Committee', '+91 9876543214', NOW() - INTERVAL '6 hours'),

('Flickering Street Light at Eco Park', 'Multiple street lights flickering and some completely dark near Eco Park entrance.', 'Street Lighting', 'medium', 'pending', 22.5845, 88.4420, 'Eco Park, Action Area II, New Town, Kolkata', 'Park Security', '+91 9876543215', NOW() - INTERVAL '12 hours'),

('Large Pothole on Major Road', 'Dangerous pothole causing traffic issues and vehicle damage on main road.', 'Road Maintenance', 'urgent', 'pending', 22.5735, 88.4200, 'AA Block, Salt Lake, Sector I, Kolkata', 'Traffic Police', '+91 9876543216', NOW() - INTERVAL '4 hours'),

('Overflowing Dustbins at City Centre', 'Multiple garbage bins overflowing near City Centre Mall, creating hygiene issues.', 'Waste Management', 'high', 'pending', 22.5795, 88.4305, 'City Centre, Action Area I, Sector V, Kolkata', 'Mall Management', '+91 9876543217', NOW() - INTERVAL '8 hours')

ON CONFLICT (id) DO NOTHING;

-- 5. Assign some tasks to workers
UPDATE public.tasks SET 
  assigned_worker_id = (SELECT id FROM public.profiles WHERE username = 'ravi_electrician' LIMIT 1),
  assigned_at = NOW() - INTERVAL '1 hour',
  status = 'assigned'
WHERE title LIKE '%Street Light%' AND assigned_worker_id IS NULL;

UPDATE public.tasks SET 
  assigned_worker_id = (SELECT id FROM public.profiles WHERE username = 'suman_plumber' LIMIT 1),
  assigned_at = NOW() - INTERVAL '12 hours',
  status = 'assigned'
WHERE title LIKE '%Water Supply%' AND assigned_worker_id IS NULL;

UPDATE public.tasks SET 
  assigned_worker_id = (SELECT id FROM public.profiles WHERE username = 'kiran_cleaner' LIMIT 1),
  assigned_at = NOW() - INTERVAL '2 days',
  started_at = NOW() - INTERVAL '1 day',
  status = 'in_progress'
WHERE title LIKE '%Garbage%' AND assigned_worker_id IS NULL;

-- 6. Enable RLS (optional, can disable for testing)
-- ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for testing
DROP POLICY IF EXISTS "Allow all access to tasks" ON public.tasks;
CREATE POLICY "Allow all access to tasks" ON public.tasks
FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to profiles" ON public.profiles;
CREATE POLICY "Allow all access to profiles" ON public.profiles
FOR ALL USING (true);

-- 7. Verification queries
SELECT 'Setup completed successfully!' as status;
SELECT COUNT(*) as total_tasks FROM public.tasks;
SELECT COUNT(*) as total_workers FROM public.profiles WHERE role = 'worker';
SELECT 
  status, 
  COUNT(*) as count 
FROM public.tasks 
GROUP BY status 
ORDER BY status;

-- Show some sample data
SELECT 
  t.title,
  t.status,
  t.category,
  p.full_name as assigned_worker
FROM public.tasks t
LEFT JOIN public.profiles p ON t.assigned_worker_id = p.id
ORDER BY t.created_at DESC
LIMIT 5;