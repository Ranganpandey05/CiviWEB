-- CREATE COMMUNITY MESSAGES TABLE
-- This creates the missing community_messages table for the admin dashboard

-- 1. Drop table if it exists (to ensure clean creation)
DROP TABLE IF EXISTS public.community_messages;

-- 2. Create community_messages table
CREATE TABLE public.community_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content text NOT NULL,
    sender_id uuid,
    message_type text DEFAULT 'general' CHECK (message_type IN ('general', 'announcement', 'alert', 'feedback')),
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- 3. Verify table structure
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'community_messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Add some sample community messages for testing
INSERT INTO public.community_messages (content, sender_id, message_type, created_at) VALUES 
('Welcome to CiviSamadhan! This is a community platform for reporting and tracking civic issues.', 
 (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1), 
 'announcement', 
 NOW() - INTERVAL '2 days'),

('Please report any street lighting issues in your area. Our team will address them promptly.', 
 (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1), 
 'general', 
 NOW() - INTERVAL '1 day'),

('Thank you for using our platform to make our city better!', 
 (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1), 
 'general', 
 NOW() - INTERVAL '6 hours'),

('System maintenance scheduled for tomorrow 2 AM - 4 AM. Service may be temporarily unavailable.', 
 (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1), 
 'alert', 
 NOW() - INTERVAL '3 hours'),

('Your feedback helps us improve our services. Please continue reporting issues.', 
 (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1), 
 'feedback', 
 NOW() - INTERVAL '1 hour')

ON CONFLICT (id) DO NOTHING;

-- 5. Create RLS policies for community messages
DROP POLICY IF EXISTS "Allow all access to community messages" ON public.community_messages;
CREATE POLICY "Allow all access to community messages" ON public.community_messages
FOR ALL USING (true);

-- 6. Enable RLS
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- 7. Add real-time subscription
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;

-- 8. Final verification
SELECT 'COMMUNITY MESSAGES TABLE CREATED!' as status;
SELECT COUNT(*) as total_messages FROM public.community_messages;
SELECT message_type, COUNT(*) as count 
FROM public.community_messages 
GROUP BY message_type 
ORDER BY message_type;

-- Show sample messages
SELECT 'SAMPLE MESSAGES:' as info;
SELECT id, LEFT(content, 50) || '...' as content_preview, message_type, created_at
FROM public.community_messages
ORDER BY created_at DESC
LIMIT 5;