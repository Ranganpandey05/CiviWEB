# CiviSamadhan Database Schema for Supabase

## Required Tables and Schema Changes

### 1. **issues** table (Enhanced)
```sql
CREATE TABLE issues (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('road_maintenance', 'sanitation', 'infrastructure', 'water_services', 'electrical', 'parks', 'other')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  
  -- Location data
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  area TEXT,
  city TEXT DEFAULT 'Delhi',
  state TEXT DEFAULT 'Delhi',
  pincode TEXT,
  
  -- Citizen information
  citizen_id UUID REFERENCES auth.users(id),
  citizen_name TEXT,
  citizen_email TEXT,
  citizen_phone TEXT,
  
  -- Worker assignment
  assigned_worker_id UUID REFERENCES workers(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  
  -- Media
  images TEXT[], -- Array of image URLs
  videos TEXT[], -- Array of video URLs
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional fields
  urgency_score INTEGER DEFAULT 0,
  citizen_satisfaction_rating INTEGER CHECK (citizen_satisfaction_rating >= 1 AND citizen_satisfaction_rating <= 5),
  admin_notes TEXT
);
```

### 2. **workers** table (New)
```sql
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic information
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  
  -- Authentication
  auth_user_id UUID REFERENCES auth.users(id),
  
  -- Work details
  department TEXT NOT NULL CHECK (department IN ('road_maintenance', 'sanitation', 'infrastructure', 'water_services', 'electrical', 'parks')),
  specialties TEXT[], -- Array of specializations
  experience_years INTEGER DEFAULT 0,
  
  -- Location and availability
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  work_area TEXT, -- Assigned work area/zone
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline', 'on_leave')),
  
  -- Personal details
  address TEXT,
  aadhar_number TEXT,
  pan_number TEXT,
  
  -- Documents (Supabase Storage URLs)
  profile_image_url TEXT,
  aadhar_image_url TEXT,
  pan_image_url TEXT,
  resume_url TEXT,
  
  -- Performance metrics
  total_issues_resolved INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  current_assignments INTEGER DEFAULT 0,
  
  -- Approval workflow
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Timestamps
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. **worker_applications** table (New)
```sql
CREATE TABLE worker_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Application data
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  department TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  address TEXT,
  
  -- Government IDs
  aadhar_number TEXT NOT NULL,
  pan_number TEXT,
  
  -- Documents
  profile_image_url TEXT,
  aadhar_image_url TEXT,
  pan_image_url TEXT,
  resume_url TEXT,
  
  -- Application status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Generated worker record
  worker_id UUID REFERENCES workers(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. **issue_assignments** table (New)
```sql
CREATE TABLE issue_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id BIGINT REFERENCES issues(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'accepted', 'in_progress', 'completed', 'rejected')),
  notes TEXT,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  actual_completion TIMESTAMP WITH TIME ZONE
);
```

### 5. **issue_updates** table (New)
```sql
CREATE TABLE issue_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id BIGINT REFERENCES issues(id) ON DELETE CASCADE,
  updated_by UUID REFERENCES auth.users(id),
  update_type TEXT NOT NULL CHECK (update_type IN ('status_change', 'assignment', 'comment', 'media_added', 'resolved')),
  old_value TEXT,
  new_value TEXT,
  comment TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. **profiles** table (Enhanced)
```sql
-- Add columns to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'citizen' CHECK (role IN ('admin', 'manager', 'worker', 'citizen'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Delhi';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Delhi';
```

## Row Level Security (RLS) Policies

### Issues Table
```sql
-- Enable RLS
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Citizens can view and create their own issues
CREATE POLICY "Citizens can view own issues" ON issues
  FOR SELECT USING (citizen_id = auth.uid());

CREATE POLICY "Citizens can create issues" ON issues
  FOR INSERT WITH CHECK (citizen_id = auth.uid());

-- Workers can view assigned issues
CREATE POLICY "Workers can view assigned issues" ON issues
  FOR SELECT USING (
    assigned_worker_id IN (
      SELECT id FROM workers WHERE auth_user_id = auth.uid()
    )
  );

-- Admins can view all issues
CREATE POLICY "Admins can view all issues" ON issues
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );
```

### Workers Table
```sql
-- Enable RLS
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Workers can view their own record
CREATE POLICY "Workers can view own record" ON workers
  FOR SELECT USING (auth_user_id = auth.uid());

-- Admins can view all workers
CREATE POLICY "Admins can manage workers" ON workers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );
```

## Storage Buckets for File Uploads

### Create Storage Buckets
```sql
-- Create buckets for file storage
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('worker-documents', 'worker-documents', false),
  ('issue-media', 'issue-media', true),
  ('profile-images', 'profile-images', true);
```

### Storage Policies
```sql
-- Worker documents (private)
CREATE POLICY "Admins can upload worker documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'worker-documents' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Issue media (public read, authenticated write)
CREATE POLICY "Authenticated users can upload issue media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'issue-media' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view issue media" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-media');
```

## Functions and Triggers

### Auto-update timestamps
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Auto-assign worker function
```sql
CREATE OR REPLACE FUNCTION auto_assign_worker(issue_id BIGINT, department_name TEXT)
RETURNS UUID AS $$
DECLARE
  selected_worker_id UUID;
BEGIN
  -- Find available worker with least assignments in the department
  SELECT id INTO selected_worker_id
  FROM workers
  WHERE department = department_name 
    AND status = 'available'
    AND approval_status = 'approved'
  ORDER BY current_assignments ASC, RANDOM()
  LIMIT 1;
  
  IF selected_worker_id IS NOT NULL THEN
    -- Update issue with assigned worker
    UPDATE issues 
    SET assigned_worker_id = selected_worker_id, assigned_at = NOW()
    WHERE id = issue_id;
    
    -- Increment worker's current assignments
    UPDATE workers 
    SET current_assignments = current_assignments + 1
    WHERE id = selected_worker_id;
    
    -- Create assignment record
    INSERT INTO issue_assignments (issue_id, worker_id, assigned_by)
    VALUES (issue_id, selected_worker_id, auth.uid());
  END IF;
  
  RETURN selected_worker_id;
END;
$$ LANGUAGE plpgsql;
```

## API Endpoints to Implement

1. **GET** `/api/issues/heatmap` - Get issue locations for map
2. **POST** `/api/workers/approve/:id` - Approve worker application
3. **POST** `/api/workers/reject/:id` - Reject worker application  
4. **POST** `/api/workers/create` - Manually create worker
5. **GET** `/api/workers/applications` - Get pending applications
6. **POST** `/api/issues/assign` - Assign issue to worker
7. **GET** `/api/analytics/dashboard` - Get dashboard analytics

This schema supports all the features you mentioned:
- Real-time issue tracking with lat/lng
- Worker onboarding and approval workflow
- Admin manual worker creation
- Issue assignment to workers
- Performance tracking
- Document storage
- Bilingual support (Hindi/English labels in UI)