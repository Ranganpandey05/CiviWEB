-- Create Admin User for CiviSamadhan Admin Dashboard
-- Run this in your Supabase SQL Editor after setting up the database

-- First, create an admin user through Supabase Auth Dashboard
-- Email: admin@civiadmin.com
-- Password: CiviAdmin@2024

-- Then run this SQL to set up the admin profile:

-- Insert admin profile (use the UUID from Supabase Auth dashboard)
INSERT INTO public.profiles (
  id, 
  email, 
  full_name, 
  role, 
  phone,
  approval_status,
  approved_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with actual UUID from Auth
  'admin@civiadmin.com',
  'System Administrator',
  'admin',
  '+91-9999999999',
  'approved',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  approval_status = 'approved',
  approved_at = NOW();

-- Grant admin permissions (if using RLS)
-- The admin user will have access to all data due to the admin role

-- Verify admin user creation
SELECT 
  id,
  email,
  full_name,
  role,
  approval_status
FROM public.profiles 
WHERE role = 'admin';

-- Instructions:
-- 1. Go to Supabase Dashboard > Authentication > Add User
-- 2. Create user with email: admin@civiadmin.com and password: CiviAdmin@2024
-- 3. Copy the generated UUID from the auth.users table
-- 4. Replace '00000000-0000-0000-0000-000000000001' above with the actual UUID
-- 5. Run this SQL script
-- 6. You can now login to the admin dashboard with admin@civiadmin.com / CiviAdmin@2024