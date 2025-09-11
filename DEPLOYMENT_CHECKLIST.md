# 🚀 CiviSamadhan Deployment Checklist

## Pre-Deployment Setup

### 1. Supabase Configuration
- [ ] Create Supabase project
- [ ] Run complete database schema from `DATABASE_SCHEMA.md`
- [ ] Set up Row Level Security (RLS) policies
- [ ] Configure authentication providers
- [ ] Create storage buckets:
  - [ ] `worker-documents` bucket
  - [ ] `issue-photos` bucket
  - [ ] Set proper access policies

### 2. Google Maps API Setup
- [ ] Create Google Cloud Project
- [ ] Enable Maps JavaScript API
- [ ] Generate API key with restrictions
- [ ] Configure allowed domains/IPs
- [ ] Set up billing account

### 3. Environment Variables
```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# Optional
SUPABASE_SERVICE_ROLE_KEY=your_service_key (for server-side operations)
SMTP_HOST=your_email_provider (for notifications)
SMTP_USER=your_email
SMTP_PASS=your_password
```

## Deployment Steps

### Option 1: Vercel (Recommended)
1. [ ] Connect GitHub repository to Vercel
2. [ ] Add environment variables in Vercel dashboard
3. [ ] Deploy with `vercel --prod`
4. [ ] Configure custom domain (optional)

### Option 2: Manual Server Deployment
1. [ ] Set up Node.js server (18+)
2. [ ] Clone repository
3. [ ] Install dependencies: `npm install`
4. [ ] Build production: `npm run build`
5. [ ] Start application: `npm start`
6. [ ] Configure reverse proxy (Nginx)
7. [ ] Set up SSL certificate

## Post-Deployment Configuration

### 1. Database Initial Data
```sql
-- Create admin user
INSERT INTO profiles (id, email, full_name, role, department)
VALUES (
  'admin-uuid',
  'admin@cityname.gov.in',
  'Admin Name',
  'admin',
  'Administration'
);

-- Create sample departments
INSERT INTO departments (name, description) VALUES
('Public Works', 'Road maintenance, infrastructure'),
('Water Department', 'Water supply and drainage'),
('Sanitation', 'Waste management and cleaning'),
('Electrical', 'Street lights and electrical work');
```

### 2. Test Core Features
- [ ] Admin login functionality
- [ ] Dashboard loads with heatmap
- [ ] Worker onboarding workflow
- [ ] Issue reporting (if testing mobile)
- [ ] File upload capabilities
- [ ] Database connectivity

### 3. Security Checklist
- [ ] Verify RLS policies are active
- [ ] Test unauthorized access prevention
- [ ] Check API key restrictions
- [ ] Validate input sanitization
- [ ] Test file upload restrictions

## Mobile App Coordination

### API Endpoints to Implement
```typescript
// Priority endpoints for mobile team
/api/issues/create       - Citizen issue reporting
/api/workers/apply       - Worker application
/api/auth/worker-login   - Worker authentication
/api/workers/issues      - Worker assignment list
/api/issues/update       - Status updates
```

### Database Schema Coordination
- [ ] Share `DATABASE_SCHEMA.md` with mobile team
- [ ] Ensure consistent field naming
- [ ] Coordinate enum values (status, priority, etc.)
- [ ] Plan real-time sync strategy

## Performance Optimization

### Production Optimizations
- [ ] Enable Next.js Image Optimization
- [ ] Configure CDN for static assets
- [ ] Set up database connection pooling
- [ ] Enable Supabase Edge Functions (if needed)
- [ ] Implement proper caching headers

### Monitoring Setup
- [ ] Set up error tracking (Sentry)
- [ ] Configure performance monitoring
- [ ] Database query monitoring
- [ ] User analytics setup

## Launch Preparation

### Government Demo
- [ ] Prepare sample data for demonstration
- [ ] Create demo user accounts
- [ ] Prepare presentation materials
- [ ] Test on government network (if applicable)

### Pilot Program
- [ ] Select pilot area/ward
- [ ] Train municipal staff
- [ ] Create user documentation
- [ ] Set up support channels

### Marketing Materials
- [ ] Update website with CiviSamadhan branding
- [ ] Prepare press release
- [ ] Create demo videos
- [ ] Social media content

## Backup & Recovery

### Automated Backups
- [ ] Configure Supabase automated backups
- [ ] Set up file storage backup
- [ ] Document restoration procedures
- [ ] Test backup restoration

### Disaster Recovery
- [ ] Document rollback procedures
- [ ] Prepare staging environment
- [ ] Create incident response plan
- [ ] Set up monitoring alerts

## Support Infrastructure

### Documentation
- [ ] User manuals for admins
- [ ] API documentation for developers
- [ ] Troubleshooting guides
- [ ] Video tutorials

### Support Channels
- [ ] Set up helpdesk system
- [ ] Create support email
- [ ] WhatsApp support number
- [ ] Emergency contact procedures

---

## 🎯 Go-Live Criteria

### Technical Requirements ✅
- [ ] All core features working
- [ ] Security measures implemented
- [ ] Performance benchmarks met
- [ ] Mobile app APIs ready
- [ ] Backup systems active

### Business Requirements ✅
- [ ] Government approval received
- [ ] Staff training completed
- [ ] Support infrastructure ready
- [ ] Pilot area selected
- [ ] Communication plan executed

---

## 📞 Emergency Contacts

**Technical Issues:**
- Developer Team: your-team@email.com
- Database Admin: db-admin@email.com
- Infrastructure: infra@email.com

**Business Issues:**
- Project Manager: pm@email.com
- Government Liaison: gov-contact@email.com
- Municipal Corporation: city@gov.in

---

*CiviSamadhan - Ready to Transform Indian Smart Cities! 🇮🇳*