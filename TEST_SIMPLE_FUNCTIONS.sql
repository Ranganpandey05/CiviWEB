-- TEST SIMPLE ADMIN FUNCTIONS
-- Run this after running FIXED_SIMPLE_SETUP.sql

-- 1. Test the simple login check function
SELECT 'TESTING SIMPLE LOGIN CHECK:' as test_type;

-- Test with correct credentials
SELECT 'With correct credentials:' as test_case;
SELECT public.check_admin_login('2004anishshit@gmail.com', 'anish@123') as result;

-- Test with wrong password
SELECT 'With wrong password:' as test_case;
SELECT public.check_admin_login('2004anishshit@gmail.com', 'wrongpass') as result;

-- Test with wrong email
SELECT 'With wrong email:' as test_case;
SELECT public.check_admin_login('wrong@email.com', 'anish@123') as result;

-- 2. Test getting admin profile
SELECT 'TESTING GET ADMIN PROFILE:' as test_type;
SELECT * FROM public.get_admin_profile('2004anishshit@gmail.com');

-- 3. Verify admin profile exists in database
SELECT 'ADMIN PROFILE VERIFICATION:' as verification_type;
SELECT id, email, role, approval_status, created_at
FROM public.profiles 
WHERE email = '2004anishshit@gmail.com' AND role = 'admin';

-- 4. Check data preservation
SELECT 'DATA PRESERVATION CHECK:' as preservation_type;
SELECT 
    'Total profiles' as metric, 
    COUNT(*)::text as count 
FROM public.profiles
UNION ALL
SELECT 
    'Worker profiles' as metric, 
    COUNT(*)::text as count 
FROM public.profiles WHERE role = 'worker'
UNION ALL
SELECT 
    'Citizen profiles' as metric, 
    COUNT(*)::text as count 
FROM public.profiles WHERE role = 'citizen'
UNION ALL
SELECT 
    'Admin profiles' as metric, 
    COUNT(*)::text as count 
FROM public.profiles WHERE role = 'admin';

-- 5. Final status
SELECT '✅ SIMPLE ADMIN FUNCTIONS TEST COMPLETE' as final_status;
SELECT 'You can now login with: 2004anishshit@gmail.com / anish@123' as instructions;

-- 6. Check functions exist
SELECT 'FUNCTION CHECK:' as function_check;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_admin_login') 
        THEN '✅ check_admin_login function exists' 
        ELSE '❌ check_admin_login function missing' 
    END as check_login_status;
    
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_admin_profile') 
        THEN '✅ get_admin_profile function exists' 
        ELSE '❌ get_admin_profile function missing' 
    END as get_profile_status;