-- Test Script for Admin Login Functionality
-- Run this in your Supabase SQL Editor to test the admin login

-- Test 1: Check if admin profile exists
SELECT 'Testing admin profile existence...' as test_step;
SELECT * FROM profiles WHERE email = '2004anishshit@gmail.com';

-- Test 2: Test the admin login function
SELECT 'Testing admin login function...' as test_step;
SELECT * FROM check_admin_login('2004anishshit@gmail.com', 'anish@123');

-- Test 3: Test the get admin profile function
SELECT 'Testing get admin profile function...' as test_step;
SELECT * FROM get_admin_profile('2004anishshit@gmail.com');

-- Test 4: Check if community_messages table exists
SELECT 'Checking community_messages table...' as test_step;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'community_messages'
) as table_exists;

-- Test 5: If table exists, check its structure
SELECT 'Checking community_messages table structure...' as test_step;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'community_messages'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Final Status Check
SELECT 
  'ADMIN LOGIN SETUP STATUS' as summary,
  CASE 
    WHEN EXISTS(SELECT 1 FROM profiles WHERE email = '2004anishshit@gmail.com') 
    THEN 'Admin profile: ✅ EXISTS'
    ELSE 'Admin profile: ❌ MISSING'
  END as admin_profile_status,
  CASE 
    WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'check_admin_login')
    THEN 'Login function: ✅ EXISTS'
    ELSE 'Login function: ❌ MISSING'
  END as login_function_status,
  CASE 
    WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'community_messages')
    THEN 'Messages table: ✅ EXISTS'
    ELSE 'Messages table: ⚠️ MISSING (optional)'
  END as messages_table_status;