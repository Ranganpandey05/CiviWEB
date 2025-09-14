-- DEBUG ADMIN LOGIN - Check Current State
-- Run this to see what's happening with your login

-- 1. Check if auth user exists
SELECT 'AUTH USER CHECK:' as check_type;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = '2004anishshit@gmail.com') 
        THEN '✅ Auth user EXISTS' 
        ELSE '❌ Auth user MISSING - Create in Dashboard' 
    END as auth_user_status;

-- 2. Check admin profile in database
SELECT 'ADMIN PROFILE CHECK:' as check_type;
SELECT 
    id, 
    email, 
    role, 
    approval_status, 
    auth_user_id,
    CASE 
        WHEN auth_user_id IS NULL THEN '⚠️ Not linked to auth user'
        ELSE '✅ Linked to auth user'
    END as link_status
FROM public.profiles 
WHERE email = '2004anishshit@gmail.com';

-- 3. Check if profile exists at all
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.profiles WHERE email = '2004anishshit@gmail.com') 
        THEN '✅ Admin profile EXISTS' 
        ELSE '❌ Admin profile MISSING' 
    END as profile_status;

-- 4. Check table structure
SELECT 'TABLE STRUCTURE CHECK:' as check_type;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('id', 'auth_user_id', 'email', 'role', 'approval_status')
ORDER BY column_name;

-- 5. Check RLS policies
SELECT 'RLS POLICIES CHECK:' as check_type;
SELECT tablename, policyname, permissive, cmd
FROM pg_policies 
WHERE tablename = 'profiles';

-- 6. Count all profiles by role
SELECT 'PROFILE COUNTS:' as check_type;
SELECT role, COUNT(*) as count
FROM public.profiles
GROUP BY role
ORDER BY role;

-- 7. Show recent profiles (to verify data exists)
SELECT 'RECENT PROFILES:' as check_type;
SELECT id, email, role, created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;