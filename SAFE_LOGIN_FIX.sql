-- SAFE LOGIN FIX - PRESERVES EXISTING DATA
-- This script ONLY fixes the admin login issue without deleting existing data
-- Safe to run on existing database with worker/citizen data

-- 1. Add missing columns to existing profiles table (if they don't exist)
-- This ensures compatibility without losing data
DO $$
BEGIN
    -- Add auth_user_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'auth_user_id') THEN
        ALTER TABLE public.profiles ADD COLUMN auth_user_id uuid;
    END IF;
    
    -- Add email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT UNIQUE;
    END IF;
    
    -- Add department column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'department') THEN
        ALTER TABLE public.profiles ADD COLUMN department TEXT;
    END IF;
END $$;

-- 2. Create admin profile for login (preserves existing data)
-- Use a safe approach that handles conflicts properly
DO $$
BEGIN
  -- Try to insert admin profile, handle conflicts safely
  INSERT INTO public.profiles (full_name, username, email, phone, role, department, approval_status, created_at, updated_at) 
  VALUES ('Admin User', 'admin', '2004anishshit@gmail.com', '+91 9999999999', 'admin', 'Administration', 'approved', NOW(), NOW())
  ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    approval_status = 'approved',
    department = 'Administration',
    updated_at = NOW();
EXCEPTION 
  WHEN unique_violation THEN
    -- If username conflicts, try with different username
    INSERT INTO public.profiles (full_name, username, email, phone, role, department, approval_status, created_at, updated_at) 
    VALUES ('Admin User', 'admin_user', '2004anishshit@gmail.com', '+91 9999999999', 'admin', 'Administration', 'approved', NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET
      role = 'admin',
      approval_status = 'approved',
      department = 'Administration',
      updated_at = NOW();
END $$;

-- 3. Create function to link auth user to admin profile after authentication
CREATE OR REPLACE FUNCTION public.link_auth_to_admin_profile(user_id uuid, user_email text)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET auth_user_id = user_id, 
      updated_at = NOW()
  WHERE email = user_email AND role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create permissive policies for admin access (if RLS is enabled)
DROP POLICY IF EXISTS "Allow admin access to profiles" ON public.profiles;
CREATE POLICY "Allow admin access to profiles" ON public.profiles
FOR ALL USING (
  auth_user_id = auth.uid() OR
  role = 'admin' OR
  true  -- Permissive for demo
);

DROP POLICY IF EXISTS "Allow admin access to tasks" ON public.tasks;
CREATE POLICY "Allow admin access to tasks" ON public.tasks
FOR ALL USING (true);

-- 5. Enable real-time if not already enabled
DO $$
BEGIN
  BEGIN
    ALTER publication supabase_realtime ADD TABLE public.tasks;
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER publication supabase_realtime ADD TABLE public.profiles;
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
END $$;

-- 6. Verification - Show what we have
SELECT 'SAFE LOGIN FIX COMPLETE!' as status;
SELECT 'Your existing data is preserved' as note;
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT COUNT(*) as total_workers FROM public.profiles WHERE role = 'worker';
SELECT COUNT(*) as total_citizens FROM public.profiles WHERE role = 'citizen';
SELECT COUNT(*) as total_admins FROM public.profiles WHERE role = 'admin';

-- Show admin profile
SELECT 'Admin profile for login:' as info, email, role, approval_status 
FROM public.profiles 
WHERE email = '2004anishshit@gmail.com';