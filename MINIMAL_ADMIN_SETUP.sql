-- MINIMAL ADMIN SETUP - Run this if diagnosis shows missing functions
-- This creates the bare minimum needed for admin login

-- 1. Ensure profiles table exists (create if missing)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name text,
    username text UNIQUE,
    email text UNIQUE NOT NULL,
    phone text,
    role text DEFAULT 'citizen',
    department text,
    approval_status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- 2. Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create policy for profiles access
DROP POLICY IF EXISTS "Allow all access to profiles" ON public.profiles;
CREATE POLICY "Allow all access to profiles" ON public.profiles FOR ALL USING (true);

-- 4. Insert admin profile (safe - won't duplicate)
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
    'admin_user',
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

-- 5. Create simple admin login check function
CREATE OR REPLACE FUNCTION public.check_admin_login(check_email text, check_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Simple check: if email matches and password is 'anish@123', return true
    IF check_email = '2004anishshit@gmail.com' AND check_password = 'anish@123' THEN
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$;

-- 6. Create get admin profile function
CREATE OR REPLACE FUNCTION public.get_admin_profile(admin_email text)
RETURNS TABLE(
    id uuid,
    full_name text,
    username text,
    email text,
    phone text,
    role text,
    department text,
    approval_status text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.username,
        p.email,
        p.phone,
        p.role,
        p.department,
        p.approval_status,
        p.created_at,
        p.updated_at
    FROM public.profiles p
    WHERE p.email = admin_email AND p.role = 'admin';
END;
$$;

-- 7. Test the functions immediately
SELECT 'Testing admin login...' as test;
SELECT public.check_admin_login('2004anishshit@gmail.com', 'anish@123') as login_result;

SELECT 'Testing admin profile...' as test;
SELECT * FROM public.get_admin_profile('2004anishshit@gmail.com');

-- 8. Final success message
SELECT 'SETUP COMPLETE! Admin login should now work.' as status;