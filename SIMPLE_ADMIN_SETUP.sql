-- SIMPLE ADMIN SETUP for existing user: 2004anishshit@gmail.com
-- This will create admin profile for your existing Supabase user

-- Check if your user exists
SELECT 'Your user found:' as status, id, email 
FROM auth.users 
WHERE email = '2004anishshit@gmail.com';

-- Create admin profile for your existing user
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get your user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = '2004anishshit@gmail.com';
    
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'User 2004anishshit@gmail.com not found! Please check Supabase Dashboard > Authentication > Users';
    END IF;
    
    -- Create admin profile
    INSERT INTO public.profiles (
        id, 
        full_name, 
        username, 
        email, 
        role, 
        approval_status,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'Anish Admin',
        'anish_admin',
        '2004anishshit@gmail.com',
        'admin',
        'approved',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        approval_status = 'approved',
        full_name = 'Anish Admin',
        username = 'anish_admin',
        email = '2004anishshit@gmail.com',
        updated_at = NOW();
        
    RAISE NOTICE 'SUCCESS: Admin profile created for % with ID %', '2004anishshit@gmail.com', admin_user_id;
END $$;

-- Verify admin profile was created
SELECT 'Admin profile created:' as status, id, full_name, email, role 
FROM public.profiles 
WHERE email = '2004anishshit@gmail.com';

-- Login credentials
SELECT 'LOGIN WITH:' as instruction;
SELECT 'Email: 2004anishshit@gmail.com' as email;
SELECT 'Password: anish@123' as password;