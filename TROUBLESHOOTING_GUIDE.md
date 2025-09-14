# 🔍 ADMIN LOGIN TROUBLESHOOTING GUIDE

## Step 1: Run Debug Script
**Run `DEBUG_LOGIN.sql` in Supabase SQL Editor first to see current state**

---

## Step 2: Check Common Issues

### ❌ **Issue 1: Auth User Doesn't Exist**
**Symptoms:** Debug shows "Auth user MISSING"
**Solution:**
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"**
3. Enter:
   - **Email**: `2004anishshit@gmail.com`
   - **Password**: `anish@123`
   - **Email confirmed**: ✅ **YES** (CRITICAL!)
4. Click **"Create user"**

### ❌ **Issue 2: Admin Profile Missing**
**Symptoms:** Debug shows "Admin profile MISSING"
**Solution:** Run `SAFE_ADMIN_ONLY_FIX.sql` again

### ❌ **Issue 3: Profile Not Linked to Auth User**
**Symptoms:** Debug shows "Not linked to auth user"
**Solution:** 
1. First create the auth user (Step 1 above)
2. Then try logging in - the app should auto-link them
3. Or run this SQL:
```sql
UPDATE public.profiles 
SET auth_user_id = (SELECT id FROM auth.users WHERE email = '2004anishshit@gmail.com')
WHERE email = '2004anishshit@gmail.com' AND role = 'admin';
```

---

## Step 3: Test Login Process

### 🧪 **Test Steps:**
1. **Open Browser Console** (F12 → Console tab)
2. **Go to Login Page**: `http://localhost:3000/login`
3. **Enter Credentials**:
   - Email: `2004anishshit@gmail.com`
   - Password: `anish@123`
4. **Click Login**
5. **Check Console Messages**

### 📋 **Expected Console Messages:**
```
Login attempt with email: 2004anishshit@gmail.com
User authenticated, checking admin role...
Profile check result: { profile: {...}, profileError: null }
Login successful, redirecting...
```

### ❌ **Error Messages & Solutions:**

**Console Error: "Auth error: Invalid login credentials"**
- **Problem**: Auth user doesn't exist or wrong password
- **Solution**: Create auth user in Dashboard with exact credentials

**Console Error: "User is not an admin or profile not found"**
- **Problem**: Admin profile missing or not linked
- **Solution**: Check profile exists and has `role = 'admin'`

**Console Error: "Profile check result: { profile: null, profileError: {...} }"**
- **Problem**: Database query failing
- **Solution**: Check RLS policies or database permissions

---

## Step 4: Manual Verification

### ✅ **Verify Auth User:**
```sql
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = '2004anishshit@gmail.com';
```

### ✅ **Verify Admin Profile:**
```sql
SELECT id, email, role, auth_user_id, approval_status 
FROM public.profiles 
WHERE email = '2004anishshit@gmail.com';
```

### ✅ **Link Them Manually (if needed):**
```sql
UPDATE public.profiles 
SET auth_user_id = (
  SELECT id FROM auth.users 
  WHERE email = '2004anishshit@gmail.com'
)
WHERE email = '2004anishshit@gmail.com' AND role = 'admin';
```

---

## Step 5: Emergency Reset

If nothing works, run this **EMERGENCY RESET**:

```sql
-- Delete admin profile
DELETE FROM public.profiles WHERE email = '2004anishshit@gmail.com';

-- Recreate admin profile
INSERT INTO public.profiles (
  full_name, username, email, phone, role, 
  department, approval_status, created_at, updated_at
) VALUES (
  'Admin User', 
  'emergency_admin', 
  '2004anishshit@gmail.com', 
  '+91 9999999999', 
  'admin', 
  'Administration', 
  'approved', 
  NOW(), 
  NOW()
);
```

Then:
1. **Delete auth user** in Supabase Dashboard
2. **Recreate auth user** with email confirmed
3. **Try login again**

---

## 🚨 **Quick Checklist:**
- [ ] Auth user exists in Dashboard
- [ ] Auth user email is confirmed
- [ ] Admin profile exists in database
- [ ] Admin profile has `role = 'admin'`
- [ ] Admin profile has `approval_status = 'approved'`
- [ ] RLS policies allow access
- [ ] Browser console shows no errors

**Run `DEBUG_LOGIN.sql` to check all these items automatically!**