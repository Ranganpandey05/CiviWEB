-- TEST DIRECT ADMIN ACCESS
-- Run this after running DIRECT_ADMIN_ACCESS.sql

-- 1. Test the admin login function
SELECT 'TESTING ADMIN LOGIN:' as test_type;

-- Test with correct credentials
SELECT 'With correct credentials:' as test_case;
SELECT success, user_id, error_message 
FROM public.admin_login('2004anishshit@gmail.com', 'anish@123');

-- Test with wrong password
SELECT 'With wrong password:' as test_case;
SELECT success, user_id, error_message 
FROM public.admin_login('2004anishshit@gmail.com', 'wrongpass');

-- Test with wrong email
SELECT 'With wrong email:' as test_case;
SELECT success, user_id, error_message 
FROM public.admin_login('wrong@email.com', 'anish@123');

-- 2. Verify admin profile exists
SELECT 'ADMIN PROFILE VERIFICATION:' as verification_type;
SELECT id, email, role, approval_status, created_at
FROM public.profiles 
WHERE email = '2004anishshit@gmail.com' AND role = 'admin';

-- 3. Check data preservation
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

-- 4. Final status
SELECT '✅ DIRECT ADMIN ACCESS TEST COMPLETE' as final_status;
SELECT 'You can now login with: 2004anishshit@gmail.com / anish@123' as instructions;