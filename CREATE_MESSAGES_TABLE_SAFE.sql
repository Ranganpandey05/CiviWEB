-- SAFE COMMUNITY MESSAGES TABLE CREATION
-- This version checks for existing table and handles it safely

-- 1. Check if table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'community_messages' AND table_schema = 'public') THEN
        RAISE NOTICE 'Table community_messages already exists. Dropping and recreating for clean setup...';
        DROP TABLE public.community_messages CASCADE;
    END IF;
END
$$;

-- 2. Create fresh community_messages table
CREATE TABLE public.community_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content text NOT NULL,
    sender_id uuid,
    message_type text DEFAULT 'general' CHECK (message_type IN ('general', 'announcement', 'alert', 'feedback', 'system')),
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- 3. Verify table was created correctly
SELECT 'Table structure verification:' as info;
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'community_messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Add sample messages (only if profiles table exists and has admin)
DO $$
DECLARE
    admin_id uuid;
BEGIN
    -- Check if profiles table exists and has admin
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        SELECT id INTO admin_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
        
        IF admin_id IS NOT NULL THEN
            INSERT INTO public.community_messages (content, sender_id, message_type, created_at) VALUES 
            ('Welcome to CiviSamadhan! This is a community platform for reporting and tracking civic issues.', 
             admin_id, 'announcement', NOW() - INTERVAL '2 days'),
            ('Please report any street lighting issues in your area. Our team will address them promptly.', 
             admin_id, 'general', NOW() - INTERVAL '1 day'),
            ('Thank you for using our platform to make our city better!', 
             admin_id, 'general', NOW() - INTERVAL '6 hours'),
            ('System maintenance scheduled for tomorrow 2 AM - 4 AM. Service may be temporarily unavailable.', 
             admin_id, 'alert', NOW() - INTERVAL '3 hours'),
            ('Your feedback helps us improve our services. Please continue reporting issues.', 
             admin_id, 'feedback', NOW() - INTERVAL '1 hour');
        ELSE
            -- Insert with null sender_id if no admin found
            INSERT INTO public.community_messages (content, sender_id, message_type, created_at) VALUES 
            ('Welcome to CiviSamadhan! This is a community platform for reporting and tracking civic issues.', 
             NULL, 'announcement', NOW() - INTERVAL '2 days'),
            ('Please report any street lighting issues in your area. Our team will address them promptly.', 
             NULL, 'general', NOW() - INTERVAL '1 day'),
            ('Thank you for using our platform to make our city better!', 
             NULL, 'general', NOW() - INTERVAL '6 hours'),
            ('System maintenance scheduled for tomorrow 2 AM - 4 AM. Service may be temporarily unavailable.', 
             NULL, 'alert', NOW() - INTERVAL '3 hours'),
            ('Your feedback helps us improve our services. Please continue reporting issues.', 
             NULL, 'feedback', NOW() - INTERVAL '1 hour');
        END IF;
        
        RAISE NOTICE 'Sample messages inserted successfully';
    ELSE
        RAISE NOTICE 'Profiles table not found, skipping sample data insertion';
    END IF;
END
$$;

-- 5. Set up RLS policies
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to community messages" ON public.community_messages;
CREATE POLICY "Allow all access to community messages" ON public.community_messages
FOR ALL USING (true);

-- 6. Add to realtime (ignore if publication doesn't exist)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;
    RAISE NOTICE 'Added to realtime subscription';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not add to realtime subscription (this is optional)';
END
$$;

-- 7. Final verification
SELECT 'COMMUNITY MESSAGES TABLE SETUP COMPLETE!' as status;
SELECT COUNT(*) as total_messages FROM public.community_messages;

-- Show message type distribution
SELECT message_type, COUNT(*) as count 
FROM public.community_messages 
GROUP BY message_type 
ORDER BY message_type;

-- Show sample of created messages
SELECT 'Sample messages created:' as info;
SELECT id, LEFT(content, 60) || '...' as content_preview, message_type, created_at
FROM public.community_messages
ORDER BY created_at DESC
LIMIT 5;