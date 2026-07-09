# How to Run - Laboratory Management System

## ⚡ Quick Start (3 Steps)

### Step 1: Setup Supabase Database (5 minutes)

1. Go to https://supabase.com/dashboard/project/cqdttgkhhvyaqbxkguqwq/editor
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Open file `database/supabase-schema.sql` from this project
5. Copy ALL the SQL code
6. Paste into Supabase SQL Editor
7. Click **"Run"** (or press Ctrl+Enter)
8. Wait for "Success. No rows returned"

### Step 2: Start the Server

Open terminal in this project folder and run:

```bash
npm run start:supabase
```

You should see:
```
Server running on http://localhost:3000
Using Supabase database
```

### Step 3: Open in Browser

Open your browser and go to:
- **Homepage**: http://localhost:3000/index.html
- **Login**: http://localhost:3000/login.html

## 🔑 Login Credentials

**Admin Account:**
- Email: `admin@nusaputra.ac.id`
- Password: `admin123`

## ✅ That's It!

Your Laboratory Management System is now running!

## 🧪 Test the System

1. **Login as Admin**
   - Email: admin@nusaputra.ac.id
   - Password: admin123
   - You'll see the Admin Dashboard with statistics

2. **Register a new user**
   - Go to http://localhost:3000/register.html
   - Fill in the form as Mahasiswa or Dosen
   - Submit registration

3. **Approve the user**
   - Login as admin again
   - Go to "Manajemen User" section
   - Click "Approve" on the pending user

4. **Login as the new user**
   - Use the credentials you just registered
   - Explore the dashboard!

## 📱 Features to Test

### As Admin:
- ✅ View statistics dashboard
- ✅ Approve/reject user registrations
- ✅ Manage laboratory schedules
- ✅ Approve/reject peminjaman requests
- ✅ View all data

### As Dosen:
- ✅ Book a laboratory
- ✅ View your schedules
- ✅ Request equipment borrowing

### As Mahasiswa:
- ✅ View laboratory schedules
- ✅ Request equipment borrowing

## 🎨 UI Features

- ✅ Modern, responsive design
- ✅ Sticky navigation bar
- ✅ Smooth scrolling
- ✅ Card-based layouts
- ✅ Status badges (pending, approved, rejected)
- ✅ Modal forms
- ✅ Mobile-friendly

## 📝 Notes

- **Database**: Supabase (cloud-based, no MySQL needed)
- **Authentication**: JWT tokens (24h expiry)
- **Password**: Hashed with bcrypt
- **Frontend**: Pure HTML/CSS/JS (no framework needed)
- **Backend**: Node.js + Express.js

## 🆘 Troubleshooting

**Error: "Cannot find module '@supabase/supabase-js'"**
```bash
npm install
```

**Error: "Invalid API key"**
- Check your Supabase credentials in `backend/.env`
- Make sure you copied the full keys

**Error: "relation users does not exist"**
- You haven't run the SQL schema yet
- Go to Supabase → SQL Editor → Run the schema

**Port 3000 already in use**
```bash
# Change port in backend/.env
PORT=3001
```

## 📚 Documentation

- **README.md** - Complete project documentation
- **QUICK_START.md** - Detailed setup guide
- **SUPABASE_SETUP.md** - Supabase-specific instructions
- **SETUP_GUIDE.md** - MySQL setup (alternative)

## 🎯 Next Steps

1. ✅ Run the SQL schema in Supabase
2. ✅ Start the server with `npm run start:supabase`
3. ✅ Test login with admin account
4. ✅ Register test users
5. ✅ Test all features
6. 🎨 Customize the UI if needed
7. 🚀 Deploy to production (Vercel, Netlify, Railway, etc.)

## 🚀 Deployment (Optional)

When ready to deploy:

1. **Frontend**: Deploy to Vercel, Netlify, or any static hosting
2. **Backend**: Deploy to Railway, Render, or any Node.js hosting
3. **Database**: Already on Supabase (cloud-hosted)

## 📞 Support

If you need help:
1. Check the console (F12) for errors
2. Check the terminal for backend errors
3. Verify Supabase credentials in `.env`
4. Make sure SQL schema was executed successfully

---

**Enjoy your Laboratory Management System!** 🎉