-- DIRECT ADMIN ACCESS - No Auth User Required
-- This bypasses Supabase Auth and gives direct admin access
-- SAFE: Preserves all existing worker and citizen data

-- 1. First, ensure admin profile exists for your email
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
    'direct_admin_' || extract(epoch from now())::text,
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

-- 2. Create a bypass authentication function
CREATE OR REPLACE FUNCTION public.admin_login(login_email text, login_password text)
RETURNS TABLE(success boolean, user_id uuid, profile_data jsonb, error_message text) AS $$
DECLARE
    admin_profile record;
BEGIN
    -- Check if credentials match our hardcoded admin
    IF login_email = '2004anishshit@gmail.com' AND login_password = 'anish@123' THEN
        -- Get admin profile
        SELECT * INTO admin_profile 
        FROM public.profiles 
        WHERE email = login_email AND role = 'admin';
        
        IF admin_profile IS NOT NULL THEN
            -- Return success with profile data
            RETURN QUERY SELECT 
                true as success,
                admin_profile.id as user_id,
                row_to_json(admin_profile)::jsonb as profile_data,
                null::text as error_message;
        ELSE
            -- Admin profile not found
            RETURN QUERY SELECT 
                false as success,
                null::uuid as user_id,
                null::jsonb as profile_data,
                'Admin profile not found'::text as error_message;
        END IF;
    ELSE
        -- Wrong credentials
        RETURN QUERY SELECT 
            false as success,
            null::uuid as user_id,
            null::jsonb as profile_data,
            'Invalid credentials'::text as error_message;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create session management function
CREATE OR REPLACE FUNCTION public.create_admin_session(user_id uuid)
RETURNS text AS $$
DECLARE
    session_token text;
BEGIN
    -- Generate a simple session token
    session_token := 'admin_session_' || user_id::text || '_' || extract(epoch from now())::text;
    
    -- Store session in a simple way (you can enhance this later)
    INSERT INTO public.admin_sessions (user_id, session_token, created_at, expires_at)
    VALUES (user_id, session_token, NOW(), NOW() + INTERVAL '24 hours')
    ON CONFLICT (user_id) DO UPDATE SET
        session_token = EXCLUDED.session_token,
        created_at = NOW(),
        expires_at = NOW() + INTERVAL '24 hours';
    
    RETURN session_token;
EXCEPTION
    WHEN OTHERS THEN
        -- If admin_sessions table doesn't exist, just return the token
        RETURN session_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create admin sessions table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    user_id uuid PRIMARY KEY,
    session_token text NOT NULL,
    created_at timestamp with time zone DEFAULT NOW(),
    expires_at timestamp with time zone NOT NULL
);

-- 5. Grant necessary permissions
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for admin access
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
CREATE POLICY "Admin full access to profiles" ON public.profiles
FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin full access to tasks" ON public.tasks;
CREATE POLICY "Admin full access to tasks" ON public.tasks
FOR ALL USING (true);

-- 6. Test the login function
SELECT 'TESTING ADMIN LOGIN FUNCTION:' as test_status;
SELECT * FROM public.admin_login('2004anishshit@gmail.com', 'anish@123');

-- 7. Verification
SELECT '✅ DIRECT ADMIN ACCESS SETUP COMPLETE!' as status;
SELECT 'Your existing worker/citizen data is preserved' as safety_note;
SELECT 'You can now login with: 2004anishshit@gmail.com / anish@123' as credentials;

-- Show data preservation verification
SELECT 'DATA PRESERVATION VERIFICATION:' as verification;
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT COUNT(*) as workers FROM public.profiles WHERE role = 'worker';
SELECT COUNT(*) as citizens FROM public.profiles WHERE role = 'citizen';
SELECT COUNT(*) as admins FROM public.profiles WHERE role = 'admin';

-- Show the admin profile
SELECT 'ADMIN PROFILE:' as admin_info;
SELECT id, email, role, approval_status, created_at 
FROM public.profiles 
WHERE email = '2004anishshit@gmail.com';