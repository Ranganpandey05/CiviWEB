-- Clean up duplicate admin profiles and fix database
-- Run this to remove old admin profiles and keep only your current one

-- 1. Check current admin profiles
SELECT 'Current admin profiles:' as info;
SELECT id, full_name, email, role, approval_status 
FROM public.profiles 
WHERE role = 'admin';

-- 2. Remove any admin profiles that are NOT your current user
-- Keep only the admin profile for 2004anishshit@gmail.com
DELETE FROM public.profiles 
WHERE role = 'admin' 
AND email != '2004anishshit@gmail.com';

-- 3. Ensure your admin profile is correct
UPDATE public.profiles 
SET 
  full_name = 'Anish Admin',
  username = 'anish_admin', 
  role = 'admin',
  approval_status = 'approved',
  updated_at = NOW()
WHERE email = '2004anishshit@gmail.com';

-- 4. Verify cleanup
SELECT 'After cleanup - admin profiles:' as info;
SELECT id, full_name, email, role, approval_status 
FROM public.profiles 
WHERE role = 'admin';

-- 5. Show your auth user
SELECT 'Your auth user:' as info;
SELECT id, email, created_at 
FROM auth.users 
WHERE email = '2004anishshit@gmail.com';