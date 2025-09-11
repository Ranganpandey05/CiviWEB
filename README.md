# 🇮🇳 CiviSamadhan - स्मार्ट नगर प्रबंधन

**CiviSamadhan** is a comprehensive digital civic management platform designed for Indian smart cities, enabling efficient issue reporting, tracking, and resolution.

## 🎯 Project Overview

### Core Features Implemented
- ✅ **Admin Dashboard** with Indian styling and bilingual support
- ✅ **Real-time Issue Heatmap** integration ready
- ✅ **Worker Onboarding System** with approval workflow
- ✅ **Manual Worker Registration** by admins
- ✅ **Issue Assignment Management**
- ✅ **Performance Analytics** and reporting
- ✅ **Responsive Design** for all devices

### Technology Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Maps**: Google Maps JavaScript API
- **Authentication**: Supabase Auth with RLS
- **State Management**: React Context
- **UI Components**: Custom with Lucide Icons

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard pages
│   │   ├── page.tsx            # Main dashboard with heatmap
│   │   ├── reports/            # Issue management
│   │   ├── workers/            # Worker directory
│   │   ├── worker-onboarding/  # Approval system
│   │   ├── analytics/          # Performance metrics
│   │   └── settings/           # System configuration
│   ├── login/                  # Authentication
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/                  # Reusable components
│   ├── DashboardLayout.tsx     # Main layout with sidebar
│   ├── ProtectedRoute.tsx      # Auth protection
│   └── IssueHeatmap.tsx        # Google Maps integration
├── contexts/                   # React contexts
│   └── AuthContext.tsx         # Authentication state
├── lib/                        # Utilities
│   └── supabase.ts            # Supabase client
└── types/                      # TypeScript definitions
    └── auth.ts                 # Type definitions
```

## 🗄️ Database Schema

### Key Tables
1. **issues** - Citizen reported problems with lat/lng
2. **workers** - Registered field workers
3. **worker_applications** - Pending approval queue
4. **issue_assignments** - Issue-worker mapping
5. **profiles** - Enhanced user profiles with roles

> See `DATABASE_SCHEMA.md` for complete SQL schema

## 🗺️ Maps Integration

### Google Maps Features
- **Real-time issue markers** with priority color coding
- **Worker location tracking** with availability status
- **Interactive info windows** with Hindi/English content
- **Filtering by priority/category**
- **Click-to-assign** functionality

> See `GOOGLE_MAPS_INTEGRATION.md` for setup instructions

## 🔐 Security & Access Control

### Role-Based Access
- **Admin**: Full system access, worker approval, manual registration
- **Manager**: Issue management, worker assignment
- **Worker**: View assigned issues, update status
- **Citizen**: Report issues, track progress

### Data Protection
- Row Level Security (RLS) policies
- Secure file storage with Supabase Storage
- API key restrictions for Google Maps
- Input validation and sanitization

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 8 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd civic-admin-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

### Running the Application
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Database Setup
1. Run SQL schemas from `DATABASE_SCHEMA.md`
2. Set up Row Level Security policies
3. Create storage buckets for file uploads
4. Configure authentication providers

## 📱 Mobile App Integration

### API Endpoints for Mobile
```typescript
// Issues
POST /api/issues/create      // Citizens report issues
GET  /api/issues/user/:id    // User's reported issues
PUT  /api/issues/:id/status  // Update issue status

// Workers
POST /api/workers/apply      // Worker application
GET  /api/workers/issues     // Assigned issues
PUT  /api/workers/location   // Update location

// Auth
POST /api/auth/worker-login  // Worker authentication
GET  /api/auth/profile       // User profile
```

### Mobile Features Expected
- **Citizen App**: Issue reporting with photos, location tracking
- **Worker App**: Assignment notifications, status updates, navigation
- **Real-time sync** between mobile and admin dashboard

## 🔧 Worker Management Workflow

### 1. Worker Application (Mobile/Web)
```
Citizen applies → Uploads documents → Application in queue
```

### 2. Admin Approval Process
```
Review application → Verify documents → Approve/Reject
                                   ↓
                            Generate credentials
```

### 3. Manual Worker Addition
```
Admin form → Enter details → Create account → Send credentials
```

### 4. Credential Generation
- Automatic email/SMS with login details
- Temporary password (must change on first login)
- Department-specific access permissions

## 📊 Analytics & Reporting

### Dashboard Metrics
- **Real-time stats**: Open issues, worker availability
- **Performance trends**: Resolution times, satisfaction scores
- **Geographic analysis**: Heatmap patterns, area-wise metrics
- **Worker performance**: Individual ratings, assignment history

### Export Capabilities
- PDF reports for government officials
- Excel exports for data analysis
- API endpoints for third-party integrations

## 🌐 Internationalization

### Bilingual Support
- **Hindi (हिंदी)**: Primary language for UI elements
- **English**: Technical terms and admin interface
- **Dynamic switching**: Context-based language selection

### Cultural Adaptations
- **Indian color scheme**: Saffron, white, green theme
- **Government-friendly design**: Official, trustworthy appearance
- **Local terminology**: भारतीय संदर्भ में शब्दावली

## 🚀 Deployment Instructions

### Vercel (Recommended)
```bash
vercel --prod
```

### Manual Deployment
```bash
npm run build
npm start
```

## 📞 Support & Maintenance

### Monitoring
- **Error tracking**: Sentry integration recommended
- **Performance monitoring**: Vercel Analytics
- **Database monitoring**: Supabase Dashboard
- **User analytics**: Custom event tracking

### Backup Strategy
- **Database**: Automated Supabase backups
- **Files**: Supabase Storage with replication
- **Code**: Git repository with CI/CD
- **Environment**: Documented configurations

## 🚀 Future Enhancements

### Phase 2 Features
- **AI-powered issue categorization**
- **Predictive maintenance alerts**
- **Citizen satisfaction surveys**
- **Integration with municipal systems**
- **Voice commands in Hindi**
- **WhatsApp bot integration**

### Scalability Considerations
- **Microservices architecture** for large cities
- **CDN integration** for faster loading
- **Database sharding** for multi-city deployment
- **Load balancing** for high traffic

## 👥 Team Coordination

### Development Workflow
1. **Database changes** → Update schema documentation
2. **API changes** → Update mobile team
3. **UI changes** → Test responsive design
4. **Security updates** → Review RLS policies

### Communication Channels
- **Technical docs**: This repository
- **API specs**: Shared documentation
- **Design assets**: Figma/design system
- **Deployment**: Automated CI/CD pipeline

---

## 🎉 Ready for Production

CiviSamadhan is now ready for:
- ✅ **Live deployment** with real data
- ✅ **Mobile app integration** via APIs
- ✅ **Government presentations** and demos
- ✅ **Pilot program** in select areas
- ✅ **Scale-up** to multiple cities

The platform successfully combines modern technology with Indian civic needs, providing a robust foundation for smart city initiatives across भारत.

---

*Built with ❤️ for Digital India - स्वच्छ भारत, स्मार्ट भारत*

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.