-- FIXED SIMPLE ADMIN SETUP - No Auth User Required
-- This creates admin access without requiring Supabase auth users
-- SAFE: Preserves all existing data

-- 1. Ensure admin profile exists (preserves existing data)
INSERT INTO public.profiles (
    full_name, 
    username, 
    email, 
    phone, 
    role, 
    department, 
    approval_status, 
    created_at, 
    updated_at
) VALUES (
    'Admin User', 
    'simple_admin_' || extract(epoch from now())::text,
    '2004anishshit@gmail.com', 
    '+91 9999999999', 
    'admin', 
    'Administration', 
    'approved', 
    NOW(), 
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    approval_status = 'approved',
    department = 'Administration',
    updated_at = NOW();

-- 2. Create very simple login check function
CREATE OR REPLACE FUNCTION public.check_admin_login(check_email text, check_password text)
RETURNS boolean AS $$
BEGIN
    -- Simple check: if email and password match, return true
    IF check_email = '2004anishshit@gmail.com' AND check_password = 'anish@123' THEN
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create function to get admin profile
CREATE OR REPLACE FUNCTION public.get_admin_profile(admin_email text)
RETURNS TABLE(id uuid, email text, role text, full_name text, department text) AS $$
BEGIN
    RETURN QUERY 
    SELECT p.id, p.email, p.role, p.full_name, p.department
    FROM public.profiles p
    WHERE p.email = admin_email AND p.role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Set up permissive policies
DROP POLICY IF EXISTS "Allow all access to profiles" ON public.profiles;
CREATE POLICY "Allow all access to profiles" ON public.profiles
FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to tasks" ON public.tasks;
CREATE POLICY "Allow all access to tasks" ON public.tasks
FOR ALL USING (true);

-- 5. Test the functions
SELECT 'TESTING SIMPLE FUNCTIONS:' as test_status;
SELECT public.check_admin_login('2004anishshit@gmail.com', 'anish@123') as correct_credentials_test;
SELECT public.check_admin_login('2004anishshit@gmail.com', 'wrong') as wrong_credentials_test;

-- 6. Test getting admin profile
SELECT 'ADMIN PROFILE TEST:' as profile_test;
SELECT * FROM public.get_admin_profile('2004anishshit@gmail.com');

-- 7. Show existing data is preserved
SELECT 'DATA PRESERVATION VERIFICATION:' as preservation;
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT COUNT(*) as workers FROM public.profiles WHERE role = 'worker';
SELECT COUNT(*) as citizens FROM public.profiles WHERE role = 'citizen';
SELECT COUNT(*) as admins FROM public.profiles WHERE role = 'admin';

SELECT '✅ SIMPLE ADMIN SETUP COMPLETE!' as status;
SELECT 'Login credentials: 2004anishshit@gmail.com / anish@123' as credentials;