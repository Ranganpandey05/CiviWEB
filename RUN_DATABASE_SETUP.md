# Database Setup Instructions

## Step 1: Run Cleanup Script
First, run the `CLEANUP_ADMIN.sql` script in your Supabase SQL editor to fix any duplicate admin profiles:

```sql
-- Copy and paste the contents of CLEANUP_ADMIN.sql
```

## Step 2: Run Mobile App Sync Setup
Then, run the `MOBILE_APP_SYNC_SETUP.sql` script to ensure complete mobile app synchronization:

```sql
-- Copy and paste the contents of MOBILE_APP_SYNC_SETUP.sql
```

## Step 3: Test the Application
1. Login with your credentials: `2004anishshit@gmail.com` / `anish@123`
2. Navigate to Reports section to see mobile app data
3. Try creating test workers using the Data Initializer
4. Test worker assignment functionality in Reports section

## Features Now Working:
✅ **Real-time Reports Sync**: New reports from mobile app appear immediately
✅ **Worker Assignment**: Select workers from dropdown and assign to tasks
✅ **Photo Display**: Task photos are visible in report details
✅ **Location Details**: Full address and coordinates shown
✅ **Mobile App Integration**: Complete synchronization with mobile app database
✅ **Fixed Dummy Data**: Proper UUID generation for test workers