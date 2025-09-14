## 🔐 COMPLETE LOGIN SETUP GUIDE

### **Step 1: Create Auth User in Supabase Dashboard**

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Navigate to**: Your Project > Authentication > Users
3. **Click**: "Add user" button
4. **Fill in**:
   - **Email**: `2004anishshit@gmail.com`
   - **Password**: `anish@123`
   - **Email confirmed**: ✅ **YES** (check this box)
   - **Role**: `authenticated`
5. **Click**: "Create user"

### **Step 2: Run the Database Script**

1. **Go to**: Supabase Dashboard > SQL Editor
2. **Run**: `DIRECT_LOGIN_FIX.sql` script
3. **This will**:
   - Create admin profile in database
   - Link it to the auth user
   - Set up proper permissions

### **Step 3: Test Login**

1. **Go to your app**: http://localhost:3000/login
2. **Enter**:
   - **Email**: `2004anishshit@gmail.com`
   - **Password**: `anish@123`
3. **Should work**: ✅ Login successful

---

## 🚨 **Alternative: Quick Auth User Creation via API**

If you have access to your Supabase service role key, you can also create the user via API:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/auth/v1/admin/users' \
-H "apikey: YOUR_SERVICE_ROLE_KEY" \
-H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "2004anishshit@gmail.com",
  "password": "anish@123",
  "email_confirm": true
}'
```

**Replace**:
- `YOUR_PROJECT_REF` with your actual Supabase project reference
- `YOUR_SERVICE_ROLE_KEY` with your service role key (from Settings > API)

---

## ✅ **Expected Result**

After completing these steps:
- ✅ Auth user exists with correct credentials
- ✅ Database profile linked to auth user
- ✅ Admin role assigned and verified
- ✅ Login with `2004anishshit@gmail.com` / `anish@123` works
- ✅ Access to admin dashboard granted

---

## 🔍 **Troubleshooting**

If login still fails:
1. Check browser console for errors
2. Verify auth user exists in Supabase Dashboard
3. Verify admin profile exists in database
4. Check if `auth_user_id` is properly linked
5. Ensure RLS policies allow access