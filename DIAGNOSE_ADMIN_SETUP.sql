-- DIAGNOSIS SCRIPT: Check if admin setup is complete
-- Run this in Supabase SQL Editor to see what's missing

-- Step 1: Check if profiles table exists
SELECT 'Checking if profiles table exists...' as step;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) as profiles_table_exists;

-- Step 2: Check if admin profile exists
SELECT 'Checking if admin profile exists...' as step;
SELECT * FROM public.profiles WHERE email = '2004anishshit@gmail.com';

-- Step 3: Check if check_admin_login function exists
SELECT 'Checking if check_admin_login function exists...' as step;
SELECT EXISTS (
  SELECT FROM information_schema.routines 
  WHERE routine_schema = 'public' 
  AND routine_name = 'check_admin_login'
) as check_admin_login_exists;

-- Step 4: Check if get_admin_profile function exists
SELECT 'Checking if get_admin_profile function exists...' as step;
SELECT EXISTS (
  SELECT FROM information_schema.routines 
  WHERE routine_schema = 'public' 
  AND routine_name = 'get_admin_profile'
) as get_admin_profile_exists;

-- Step 5: Show all existing functions (to see what's available)
SELECT 'Existing functions in public schema:' as step;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;

-- Step 6: Final diagnosis
SELECT 
  'DIAGNOSIS SUMMARY' as summary,
  CASE 
    WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public')
    THEN '✅ profiles table exists'
    ELSE '❌ profiles table missing'
  END as table_status,
  CASE 
    WHEN EXISTS(SELECT 1 FROM public.profiles WHERE email = '2004anishshit@gmail.com')
    THEN '✅ admin profile exists'
    ELSE '❌ admin profile missing'
  END as profile_status,
  CASE 
    WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'check_admin_login' AND routine_schema = 'public')
    THEN '✅ check_admin_login function exists'
    ELSE '❌ check_admin_login function missing'
  END as login_function_status,
  CASE 
    WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_admin_profile' AND routine_schema = 'public')
    THEN '✅ get_admin_profile function exists'
    ELSE '❌ get_admin_profile function missing'
  END as profile_function_status;