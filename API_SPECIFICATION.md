# 📱 CiviSamadhan API Specification

## Overview
This document outlines the API endpoints required for CiviSamadhan mobile applications (Citizen App & Worker App) to integrate with the admin dashboard.

## Base Configuration
```typescript
const SUPABASE_URL = "https://your-project.supabase.co"
const SUPABASE_ANON_KEY = "your_anon_key"

// Initialize Supabase client
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

## Authentication Endpoints

### 1. Citizen Registration
```typescript
POST /auth/signup
Content-Type: application/json

Request:
{
  "email": "citizen@email.com",
  "password": "password123",
  "phone": "+91XXXXXXXXXX",
  "full_name": "John Doe",
  "address": "Complete address"
}

Response:
{
  "user": { "id": "uuid", "email": "citizen@email.com" },
  "session": { "access_token": "jwt_token" }
}
```

### 2. Worker Login
```typescript
POST /auth/worker-login
Content-Type: application/json

Request:
{
  "worker_id": "WORKER001",
  "password": "generated_password"
}

Response:
{
  "user": { 
    "id": "uuid", 
    "worker_id": "WORKER001",
    "department": "Public Works",
    "role": "worker"
  },
  "session": { "access_token": "jwt_token" }
}
```

### 3. Password Reset
```typescript
POST /auth/reset-password
Content-Type: application/json

Request:
{
  "email": "user@email.com"
}

Response:
{
  "message": "Password reset email sent"
}
```

## Issue Management Endpoints

### 4. Create Issue (Citizen App)
```typescript
POST /api/issues/create
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Request:
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "road_maintenance",
  "priority": "medium",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "address": "Main Street, Near City Center",
  "photos": [File1, File2] // Multiple image files
}

Response:
{
  "id": "issue_uuid",
  "issue_number": "CIV-2024-001",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z",
  "estimated_resolution": "2024-01-20T00:00:00Z"
}
```

### 5. Get User Issues (Citizen App)
```typescript
GET /api/issues/user/:user_id?status=active&limit=20&offset=0
Authorization: Bearer <access_token>

Response:
{
  "issues": [
    {
      "id": "issue_uuid",
      "issue_number": "CIV-2024-001",
      "title": "Pothole on Main Street",
      "status": "in_progress",
      "priority": "medium",
      "created_at": "2024-01-15T10:30:00Z",
      "assigned_worker": {
        "name": "Ramesh Kumar",
        "phone": "+91XXXXXXXXXX"
      },
      "progress_updates": [
        {
          "status": "assigned",
          "message": "Worker assigned",
          "timestamp": "2024-01-15T14:00:00Z"
        }
      ]
    }
  ],
  "total": 5,
  "hasMore": true
}
```

### 6. Get Worker Assignments (Worker App)
```typescript
GET /api/workers/issues?status=assigned&date=2024-01-15
Authorization: Bearer <access_token>

Response:
{
  "assignments": [
    {
      "id": "assignment_uuid",
      "issue": {
        "id": "issue_uuid",
        "title": "Pothole on Main Street",
        "priority": "high",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "photos": ["photo_url_1", "photo_url_2"],
        "citizen_contact": "+91XXXXXXXXXX"
      },
      "assigned_at": "2024-01-15T09:00:00Z",
      "due_date": "2024-01-17T18:00:00Z",
      "estimated_duration": "2 hours"
    }
  ]
}
```

### 7. Update Issue Status (Worker App)
```typescript
PUT /api/issues/:issue_id/status
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Request:
{
  "status": "in_progress", // pending, in_progress, completed, rejected
  "message": "Work started, materials arranged",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "progress_photos": [File1, File2], // Optional
  "estimated_completion": "2024-01-16T16:00:00Z" // Optional
}

Response:
{
  "message": "Status updated successfully",
  "issue": {
    "id": "issue_uuid",
    "status": "in_progress",
    "last_updated": "2024-01-15T11:30:00Z"
  }
}
```

## Worker Management Endpoints

### 8. Worker Application (Citizen App)
```typescript
POST /api/workers/apply
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Request:
{
  "full_name": "राम कुमार",
  "phone": "+91XXXXXXXXXX",
  "email": "ram@email.com",
  "address": "Complete address",
  "department": "public_works",
  "experience_years": 5,
  "skills": ["road_repair", "electrical_work"],
  "documents": {
    "aadhaar": File,
    "pan": File,
    "photo": File,
    "experience_certificate": File // Optional
  },
  "languages": ["hindi", "english"]
}

Response:
{
  "application_id": "app_uuid",
  "message": "Application submitted successfully",
  "status": "pending",
  "estimated_review_time": "3-5 business days"
}
```

### 9. Check Application Status
```typescript
GET /api/workers/application-status
Authorization: Bearer <access_token>

Response:
{
  "application": {
    "id": "app_uuid",
    "status": "under_review", // pending, under_review, approved, rejected
    "submitted_at": "2024-01-10T10:00:00Z",
    "review_notes": "Documents under verification",
    "expected_decision": "2024-01-15T00:00:00Z"
  }
}
```

### 10. Update Worker Location (Worker App)
```typescript
PUT /api/workers/location
Authorization: Bearer <access_token>

Request:
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "availability": "available", // available, busy, offline
  "timestamp": "2024-01-15T12:00:00Z"
}

Response:
{
  "message": "Location updated successfully"
}
```

## Real-time Features

### 11. WebSocket Connection
```typescript
// For real-time updates
const wsUrl = "wss://your-project.supabase.co/realtime/v1/websocket"

// Subscribe to issue updates
const subscription = supabase
  .channel('issue_updates')
  .on('postgres_changes', 
    { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'issues',
      filter: `citizen_id=eq.${user.id}`
    }, 
    (payload) => {
      // Handle real-time issue updates
      console.log('Issue updated:', payload.new)
    }
  )
  .subscribe()
```

### 12. Push Notifications
```typescript
// Register for push notifications
POST /api/notifications/register
Authorization: Bearer <access_token>

Request:
{
  "device_token": "firebase_token",
  "platform": "android", // android, ios
  "notification_preferences": {
    "issue_updates": true,
    "new_assignments": true,
    "emergency_alerts": true
  }
}
```

## Data Models

### Issue Object
```typescript
interface Issue {
  id: string
  issue_number: string
  title: string
  description: string
  category: 'road_maintenance' | 'water_supply' | 'sanitation' | 'electrical' | 'other'
  priority: 'low' | 'medium' | 'high' | 'emergency'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'rejected'
  latitude: number
  longitude: number
  address: string
  photos: string[]
  citizen_id: string
  assigned_worker_id?: string
  created_at: string
  updated_at: string
  estimated_resolution?: string
}
```

### Worker Object
```typescript
interface Worker {
  id: string
  worker_id: string
  full_name: string
  phone: string
  email: string
  department: string
  skills: string[]
  availability: 'available' | 'busy' | 'offline'
  current_location?: {
    latitude: number
    longitude: number
    updated_at: string
  }
  rating: number
  total_assignments: number
  completed_assignments: number
}
```

### Error Responses
```typescript
// Standard error format
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}

// Common error codes
VALIDATION_ERROR        // Invalid input
UNAUTHORIZED           // Authentication required
FORBIDDEN             // Insufficient permissions
NOT_FOUND            // Resource not found
RATE_LIMITED         // Too many requests
SERVER_ERROR         // Internal server error
```

## File Upload Guidelines

### Image Requirements
```typescript
// For issue photos and worker documents
const uploadConfig = {
  maxSize: "5MB",
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFiles: 5,
  compression: {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080
  }
}
```

### Upload Process
```typescript
// 1. Upload to Supabase Storage
const { data, error } = await supabase.storage
  .from('issue-photos')
  .upload(`${issueId}/${fileName}`, file)

// 2. Get public URL
const { data: publicUrl } = supabase.storage
  .from('issue-photos')
  .getPublicUrl(data.path)
```

## Rate Limiting

### API Limits
```typescript
// Per user limits
const rateLimits = {
  "issue_creation": "10 per hour",
  "status_updates": "30 per hour", 
  "file_uploads": "20 per hour",
  "location_updates": "120 per hour", // Every 30 seconds
  "general_api": "1000 per hour"
}
```

## Security Guidelines

### Authentication
- Use JWT tokens for all API calls
- Refresh tokens every 24 hours
- Validate user roles for each endpoint

### Data Validation
- Sanitize all user inputs
- Validate coordinates are within city bounds
- Check file types and sizes before upload

### Privacy
- Hide sensitive citizen data from workers
- Log all data access for audit trails
- Implement proper data encryption

---

## 🚀 Implementation Guide

### Mobile App Integration Steps
1. **Set up Supabase SDK** in your mobile app
2. **Implement authentication** flow
3. **Create issue reporting** with photo capture
4. **Add real-time subscriptions** for updates
5. **Implement push notifications**
6. **Test with admin dashboard** integration

### Testing Endpoints
```typescript
// Test server (staging)
const TEST_BASE_URL = "https://staging.civisamadhan.com/api"

// Production server
const PROD_BASE_URL = "https://civisamadhan.com/api"
```

---

*Ready for Mobile App Development! 📱🇮🇳*