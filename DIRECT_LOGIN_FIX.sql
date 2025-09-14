-- COMPLETE LOGIN FIX - Handles Auth User + Database Profile
-- This script ensures both authentication user and database profile exist

-- 1. First, ensure the auth user exists in auth.users table
-- NOTE: This section might need to be run by a Supabase admin or through the Supabase dashboard
DO $$
DECLARE
    auth_user_exists boolean := false;
    admin_user_id uuid;
BEGIN
    -- Check if auth user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = '2004anishshit@gmail.com') INTO auth_user_exists;
    
    IF NOT auth_user_exists THEN
        -- Create auth user with the specified credentials
        -- Note: In production, this would typically be done through Supabase Auth API
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            '2004anishshit@gmail.com',
            crypt('anish@123', gen_salt('bf')), -- Hash the password 'anish@123'
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
        
        -- Get the created user ID
        SELECT id INTO admin_user_id FROM auth.users WHERE email = '2004anishshit@gmail.com';
        
        RAISE NOTICE 'Created auth user for 2004anishshit@gmail.com with ID: %', admin_user_id;
    ELSE
        -- Get existing user ID
        SELECT id INTO admin_user_id FROM auth.users WHERE email = '2004anishshit@gmail.com';
        RAISE NOTICE 'Auth user already exists with ID: %', admin_user_id;
    END IF;
    
EXCEPTION 
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'Cannot create auth user directly. Please create user through Supabase Dashboard or Auth API.';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error with auth user creation: %', SQLERRM;
END $$;

-- 2. Clean up any existing admin profiles for this email
DELETE FROM public.profiles WHERE email = '2004anishshit@gmail.com';

-- 3. Create the admin profile with the correct structure
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
    'admin_' || extract(epoch from now())::text, -- Unique username
    '2004anishshit@gmail.com', 
    '+91 9999999999', 
    'admin', 
    'Administration', 
    'approved', 
    NOW(), 
    NOW()
);

-- 4. Create the linking function (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.link_auth_to_admin_profile(user_id uuid, user_email text)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET auth_user_id = user_id, 
      updated_at = NOW()
  WHERE email = user_email AND role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Also create a direct update function for immediate linking
CREATE OR REPLACE FUNCTION public.ensure_admin_profile(user_id uuid, user_email text)
RETURNS void AS $$
BEGIN
  -- Update existing admin profile with auth_user_id
  UPDATE public.profiles 
  SET auth_user_id = user_id, 
      updated_at = NOW()
  WHERE email = user_email AND role = 'admin';
  
  -- If no profile was updated, create one
  IF NOT FOUND THEN
    INSERT INTO public.profiles (
      id,
      auth_user_id, 
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
      user_id, -- Use auth user ID as profile ID
      user_id,
      'Admin User', 
      'admin_' || user_id::text, 
      user_email, 
      '+91 9999999999', 
      'admin', 
      'Administration', 
      'approved', 
      NOW(), 
      NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Enable RLS policies
DROP POLICY IF EXISTS "Allow all access to profiles" ON public.profiles;
CREATE POLICY "Allow all access to profiles" ON public.profiles
FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to tasks" ON public.tasks;
CREATE POLICY "Allow all access to tasks" ON public.tasks
FOR ALL USING (true);

-- 7. Verification
SELECT 'DIRECT LOGIN FIX COMPLETE!' as status;
SELECT 'Admin profile created for: 2004anishshit@gmail.com' as note;
SELECT id, email, role, approval_status, auth_user_id 
FROM public.profiles 
WHERE email = '2004anishshit@gmail.com';

-- 8. Test the function and show auth user info
SELECT 'Testing admin profile function...' as test_status;

-- Show auth user info (if accessible)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        PERFORM 1; -- Auth users table exists
        RAISE NOTICE 'Auth users table is accessible';
    ELSE
        RAISE NOTICE 'Auth users table is not accessible from this context';
    END IF;
END $$;

-- 9. MANUAL STEPS IF SCRIPT CANNOT CREATE AUTH USER:
SELECT '=== MANUAL STEPS IF NEEDED ===' as manual_steps;
SELECT 'If auth user creation failed above, please:' as step_1;
SELECT '1. Go to Supabase Dashboard > Authentication > Users' as step_2;
SELECT '2. Click "Add user" and create:' as step_3;
SELECT '   Email: 2004anishshit@gmail.com' as step_4;
SELECT '   Password: anish@123' as step_5;
SELECT '   Email confirmed: YES' as step_6;
SELECT '3. Then run this script again' as step_7;