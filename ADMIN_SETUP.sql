-- CVSamadhan Admin Dashboard Setup
-- Using existing user: 2004anishshit@gmail.com with password: anish@123
-- This script will find your existing user and create admin profile

-- 1. Create admin profile for existing user
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the existing user ID from auth.users
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = '2004anishshit@gmail.com';
    
    -- Check if user exists
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email 2004anishshit@gmail.com not found! Please check if the user exists in Supabase Dashboard > Authentication > Users';
    END IF;
    
    -- Insert admin profile for existing user
    INSERT INTO public.profiles (
      id, 
      full_name, 
      username, 
      email, 
      role, 
      approval_status,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      'Anish Admin',
      'anish_admin',
      '2004anishshit@gmail.com',
      'admin',
      'approved',
      NOW(),
      NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      approval_status = 'approved',
      full_name = 'Anish Admin',
      username = 'anish_admin',
      email = '2004anishshit@gmail.com',
      updated_at = NOW();
      
    RAISE NOTICE 'Admin profile created successfully for user: % with ID: %', '2004anishshit@gmail.com', admin_user_id;
END $$;

-- 3. Ensure we have the proper database structure
-- Create tasks table if not exists (should already exist from mobile app setup)
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  
  -- Photos array
  photos TEXT[]
);

-- 4. Ensure worker_applications table exists
CREATE TABLE IF NOT EXISTS public.worker_applications (
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
  reviewed_by uuid REFERENCES auth.users(id),
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
  auth_user_id uuid REFERENCES auth.users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insert some demo data (Kolkata area)
INSERT INTO public.tasks (id, title, description, category, priority, status, latitude, longitude, address, citizen_name, citizen_phone, created_at) VALUES 
-- Task 1: Street Light near DLF IT Park
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Broken Street Light near DLF IT Park', 'Street light pole is broken and causing darkness in the evening. Urgent repair needed for safety.', 'Street Lighting', 'urgent', 'pending', 22.5725, 88.4310, 'DLF IT Park, Action Area I, Sector V, Kolkata', 'Ramesh Kumar', '+91 9876543210', NOW()),

-- Task 2: Water supply issue at tech city
('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Water Supply Interruption at Tech City', 'No water supply for the past 2 days in Tech City area. Residents are facing severe difficulty.', 'Water Supply', 'high', 'pending', 22.5650, 88.4250, 'Tech City, Action Area II, Sector V, Kolkata', 'Sunita Devi', '+91 9876543211', NOW()),

-- Task 3: Garbage collection issue at TCS
('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'Garbage Collection Issue at TCS Campus', 'Garbage has not been collected for 3 days near TCS office complex. Bad smell affecting office environment.', 'Waste Management', 'medium', 'pending', 22.5695, 88.4280, 'TCS Campus, Action Area III, Sector V, Kolkata', 'Rajesh Agarwal', '+91 9876543212', NOW()),

-- Task 4: Central Park maintenance
('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 'Central Park Maintenance Required', 'Regular maintenance and cleaning of the Central Park area near City Centre Mall.', 'Sanitation', 'low', 'in_progress', 22.5785, 88.4320, 'Central Park, Action Area I, Sector V, Kolkata', 'KMC Office Sector V', '+91 9876543213', NOW()),

-- Task 5: Drainage near Webel Bhawan
('6ba7b814-9dad-11d1-80b4-00c04fd430c8', 'Drainage Blockage near Webel Bhawan', 'Severe waterlogging due to blocked drainage system near Webel Bhawan. Road becomes impassable during rain.', 'Drainage', 'high', 'pending', 22.5775, 88.4335, 'Webel Bhawan, Action Area III, Sector V, Kolkata', 'Local Residents Committee', '+91 9876543214', NOW())

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

-- 6. Create some demo workers
INSERT INTO public.profiles (id, full_name, username, phone, role, department, speciality, approval_status, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Ravi Kumar (Electrician)', 'ravi_electric', '+91 9876543301', 'worker', 'Electrical', 'Street Light Repair', 'approved', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Suman Das (Plumber)', 'suman_water', '+91 9876543302', 'worker', 'Water Supply', 'Pipeline Repair', 'approved', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Kiran Singh (Cleaner)', 'kiran_sanitation', '+91 9876543303', 'worker', 'Sanitation', 'Waste Management', 'approved', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Amit Ghosh (Engineer)', 'amit_drainage', '+91 9876543304', 'worker', 'Public Works', 'Drainage System', 'approved', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Priya Sharma (Supervisor)', 'priya_roads', '+91 9876543305', 'worker', 'Roads', 'Road Maintenance', 'approved', NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  username = EXCLUDED.username,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  speciality = EXCLUDED.speciality,
  approval_status = EXCLUDED.approval_status,
  updated_at = NOW();

-- 7. Create some demo worker applications
INSERT INTO public.worker_applications (
  id, full_name, email, username, phone, department, speciality, 
  status, auth_user_id, created_at, updated_at
) VALUES 
('7ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Rohit Mehta', 'rohit.mehta@example.com', 'rohit_mehta', '+91 9876543401', 'Electrical', 'Transformer Maintenance', 'pending', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('7ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Anita Banerjee', 'anita.banerjee@example.com', 'anita_ban', '+91 9876543402', 'Sanitation', 'Public Toilet Cleaning', 'pending', '00000000-0000-0000-0000-000000000002', NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  phone = EXCLUDED.phone,
  department = EXCLUDED.department,
  speciality = EXCLUDED.speciality,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 8. Assign some tasks to workers
UPDATE public.tasks SET 
  assigned_worker_id = '550e8400-e29b-41d4-a716-446655440001', 
  assigned_at = NOW()
WHERE id = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

UPDATE public.tasks SET 
  assigned_worker_id = '550e8400-e29b-41d4-a716-446655440002', 
  assigned_at = NOW()
WHERE id = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';

-- 9. Enable RLS if not already enabled
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_applications ENABLE ROW LEVEL SECURITY;

-- 10. Create admin-friendly policies
CREATE POLICY "Admins can manage all tasks" ON public.tasks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage all applications" ON public.worker_applications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 11. Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 12. Create storage buckets for photos
INSERT INTO storage.buckets (id, name, public) VALUES 
('task-photos', 'task-photos', true),
('worker-documents', 'worker-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view task photos" ON storage.objects
FOR SELECT USING (bucket_id = 'task-photos');

CREATE POLICY "Anyone can view worker documents" ON storage.objects
FOR SELECT USING (bucket_id = 'worker-documents');

-- Final check
SELECT 'Setup complete! You can now login with:' as message;
SELECT 'Email: 2004anishshit@gmail.com' as login_email;
SELECT 'Password: anish@123' as login_password;
SELECT 'Admin profile has been created successfully!' as status;

-- Check data
SELECT COUNT(*) as total_tasks FROM public.tasks;
SELECT COUNT(*) as total_workers FROM public.profiles WHERE role = 'worker';
SELECT COUNT(*) as pending_applications FROM public.worker_applications WHERE status = 'pending';
SELECT COUNT(*) as admin_profiles FROM public.profiles WHERE role = 'admin';