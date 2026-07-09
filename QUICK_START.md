# Quick Start - Supabase Version

## ⚡ Fastest Way to Run (Using Supabase)

### Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com/
2. Sign up with GitHub or email
3. Click **"New Project"**
4. Fill in:
   - Project name: `laboratory-management`
   - Database password: (create a strong password)
   - Region: `Singapore` (or closest to you)
5. Click **"Create new project"** and wait 1-2 minutes

### Step 2: Get Your Credentials

1. In Supabase dashboard, click **"Project Settings"** (gear icon)
2. Click **"API"** on the left menu
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Setup Database

1. In Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open file `database/supabase-schema.sql` in this project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

### Step 4: Configure Environment

Create a file called `.env` in the `backend` folder with:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
PORT=3000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**Replace with your actual Supabase credentials!**

### Step 5: Run the Server

```bash
npm run start:supabase
```

You should see:
```
Server running on http://localhost:3000
Using Supabase database
```

### Step 6: Access the Application

Open your browser and go to:
- **Homepage**: http://localhost:3000/index.html
- **Login**: http://localhost:3000/login.html

## 🔑 Login Credentials

**Admin Account:**
- Email: `admin@nusaputra.ac.id`
- Password: `admin123`

## ✅ That's It!

You now have a fully functional Laboratory Management System running on Supabase!

## 🧪 Quick Test

1. Go to http://localhost:3000/register.html
2. Register a new account as "Mahasiswa"
3. Login as admin and approve the account
4. Login as the new user
5. Explore the dashboard!

## 📝 Notes

- **No MySQL needed** - Everything runs on Supabase cloud
- **Free hosting** - Supabase free tier is enough for development
- **Auto backup** - Your data is automatically backed up
- **Dashboard** - Manage your data at https://app.supabase.com

## 🆘 Troubleshooting

**Error: "Can't add new command when connection is in closed state"**
- This means you're running the MySQL version without MySQL installed
- Use `npm run start:supabase` instead

**Error: "Invalid API key"**
- Double-check your Supabase credentials in `.env`
- Make sure you copied the full key (they're very long)

**Error: "relation users does not exist"**
- You haven't run the SQL schema yet
- Go to Supabase → SQL Editor → Run the schema

## 📚 More Information

- See `SUPABASE_SETUP.md` for detailed setup instructions
- See `README.md` for complete feature list
- See `SETUP_GUIDE.md` for MySQL setup (if you prefer MySQL)

## 🎯 Next Steps

1. ✅ Setup Supabase project
2. ✅ Run SQL schema
3. ✅ Configure `.env`
4. ✅ Run `npm run start:supabase`
5. ✅ Test the application
6. 🎨 Customize the UI/UX as needed
7. 🚀 Deploy to production (Vercel, Netlify, Railway, etc.)

Happy coding! 🎉