# Deployment Guide - Production Setup

## Overview

Your Laboratory Management System consists of:
- **Frontend**: Static HTML/CSS/JS (deploy to Vercel)
- **Backend**: Node.js/Express API (deploy to Vercel or Railway)
- **Database**: Supabase (already cloud-hosted)

## Architecture for Production

```
┌─────────────────────────────────────────────┐
│           Production Deployment              │
├─────────────────────────────────────────────┤
│                                             │
│  Vercel / Railway                            │
│  ┌──────────────────────────────────────┐   │
│  │  Backend API (Node.js)               │   │
│  │  - Express.js                        │   │
│  │  - Supabase Client                   │   │
│  │  - JWT Authentication                │   │
│  │  - API Routes                        │   │
│  └──────────────────────────────────────┘   │
│           ↕                                 │
│  ┌──────────────────────────────────────┐   │
│  │  Frontend (Static Files)             │   │
│  │  - HTML, CSS, JS                     │   │
│  │  - Served via CDN                     │   │
│  └──────────────────────────────────────┘   │
│           ↕                                 │
│  ┌──────────────────────────────────────┐   │
│  │  Supabase Cloud Database             │   │
│  │  - PostgreSQL                         │   │
│  │  - Authentication                     │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository

```bash
cd c:/Users/aditi/Documents/Pekerjaan Selama PKL/Web Lab
git init
git add .
git commit -m "Initial commit - Laboratory Management System"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `laboratory-management-system`
3. Set to **Private** (recommended) or **Public**
4. **Do NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/laboratory-management-system.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Vercel

### Option A: Deploy Backend + Frontend Together (Recommended)

Vercel can host both your backend API and frontend static files.

#### 2.1 Create `vercel.json` in project root

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server-supabase.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server-supabase.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

#### 2.2 Create `.env` for production

Create `backend/.env.production`:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secure_jwt_secret_key_here_make_it_long_and_random
SUPABASE_URL=https://cqdttgkhhvyaxbxkguwq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZHR0Z2toaHZ5YXhieGtndXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDE2NTEsImV4cCI6MjA5OTExNzY1MX0.D2Qm5eEQeZ9YdbJxSGlcCuY0looaNeqLukEmIdrMCQM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZHR0Z2toaHZ5YXhieGtndXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU0MTY1MSwiZXhwIjoyMDk5MTE3NjUxfQ.SNazc3x7Et-08ptyfbeLefTnThZi_CfFLMfbmpyTEDY
```

**IMPORTANT**: Change `JWT_SECRET` to a secure random string!

#### 2.3 Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty)
   - **Output Directory**: ./
4. Add Environment Variables:
   - Click "Environment Variables"
   - Add all variables from `.env.production`
5. Click "Deploy"

Vercel will give you a URL like: `https://laboratory-management-system.vercel.app`

### Option B: Deploy Backend Separately (Railway)

If you want more control over the backend:

#### 2.1 Deploy to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway will auto-detect Node.js
5. Add environment variables from `.env.production`
6. Deploy

You'll get a backend URL like: `https://your-app.railway.app`

#### 2.2 Update Frontend API URL

If backend is on different domain, update frontend to use full URL:

In all HTML files (login.html, register.html, dashboards):
```javascript
// Change from:
const API_URL = '/api';

// To:
const API_URL = 'https://your-backend-url.vercel.app/api';
```

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend

Your frontend is already static HTML/CSS/JS, so it's ready to deploy!

### 3.2 Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository (if not already done)
3. Vercel will auto-detect it's a static site
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty)
   - **Output Directory**: ./
5. Click "Deploy"

Your frontend will be available at: `https://laboratory-management-system.vercel.app`

## Step 4: Configure Supabase

### 4.1 Update Supabase Settings

1. Go to https://supabase.com/dashboard/project/cqdttgkhhvyaxbxkguwq
2. Click "Authentication" → "URL Configuration"
3. Add your Vercel domain to "Redirect URLs":
   ```
   https://laboratory-management-system.vercel.app/**
   ```
4. Add to "Site URL":
   ```
   https://laboratory-management-system.vercel.app
   ```

### 4.2 Run Database Schema

If not already done, run the schema in Supabase:
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `database/supabase-schema.sql`
3. Paste and run

### 4.3 Create Admin User

Run this SQL in Supabase SQL Editor:
```sql
INSERT INTO users (nama, email, password, role, status) VALUES
('Administrator', 'admin@nusaputra.ac.id', '$2a$10$QFfOxY7xBQD0Y/eCCVdSfODV8UTi6shrM9UI0t5w0Th63bja6etl6', 'admin', 'approved');
```

## Step 5: Configure CORS for Production

### 5.1 Update Backend CORS

In `backend/server-supabase.js`, update CORS to restrict origins:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://laboratory-management-system.vercel.app', 'https://your-custom-domain.com']
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 5.2 Deploy Updated Backend

Commit and push changes:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Vercel will auto-redeploy.

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain to Vercel

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your domain: `lab.unusaputra.ac.id`
4. Follow DNS configuration instructions

### 6.2 Update Supabase

Add your custom domain to Supabase:
```
https://lab.unusaputra.ac.id/**
```

## Step 7: Testing Production

### 7.1 Test Checklist

- [ ] Frontend loads: https://laboratory-management-system.vercel.app
- [ ] API works: https://laboratory-management-system.vercel.app/api/laboratories
- [ ] Login works with admin@nusaputra.ac.id / admin123
- [ ] Mobile responsive design works
- [ ] All features work (register, login, dashboard, etc.)

### 7.2 Test on Mobile

1. Open mobile browser
2. Go to: https://laboratory-management-system.vercel.app
3. Test login and all features
4. Should work on any device with internet!

## Step 8: Continuous Deployment

### 8.1 Auto-Deploy on Git Push

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# Vercel will automatically deploy
```

### 8.2 Preview Deployments

Vercel creates preview deployments for pull requests:
1. Create a branch: `git checkout -b feature/new-feature`
2. Push branch: `git push -u origin feature/new-feature`
3. Vercel creates preview URL
4. Test before merging to main

## Environment Variables Summary

### Required in Vercel/Railway:

```env
# Server
NODE_ENV=production
PORT=3000
JWT_SECRET=your_very_long_and_random_secret_key_here

# Supabase
SUPABASE_URL=https://cqdttgkhhvyaxbxkguwq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZHR0Z2toaHZ5YXhieGtndXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDE2NTEsImV4cCI6MjA5OTExNzY1MX0.D2Qm5eEQeZ9YdbJxSGlcCuY0looaNeqLukEmIdrMCQM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZHR0Z2toaHZ5YXhieGtndXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU0MTY1MSwiZXhwIjoyMDk5MTE3NjUxfQ.SNazc3x7Et-08ptyfbeLefTnThZi_CfFLMfbmpyTEDY
```

## File Structure for Deployment

```
laboratory-management-system/
├── backend/
│   ├── server-supabase.js      # Backend API
│   ├── .env                    # Local development (not pushed)
│   └── .env.production         # Production env (use Vercel env vars instead)
├── dashboard/
│   ├── admin.html
│   ├── dosen.html
│   └── mahasiswa.html
├── database/
│   └── supabase-schema.sql
├── index.html                  # Homepage
├── login.html
├── register.html
├── vercel.json                 # Vercel configuration
├── package.json
└── README.md
```

## Important Notes

### Security
1. ✅ Never commit `.env` file to Git (add to .gitignore)
2. ✅ Use strong JWT_SECRET in production
3. ✅ Restrict CORS to your domain in production
4. ✅ Use HTTPS (Vercel provides this automatically)

### Performance
1. ✅ Vercel CDN serves static files globally
2. ✅ Supabase is already optimized
3. ✅ Enable Vercel Analytics for monitoring

### Monitoring
1. Check Vercel Dashboard for deployment logs
2. Check Supabase Dashboard for database metrics
3. Monitor API response times
4. Set up error tracking (optional: Sentry)

## Troubleshooting Production

### 404 Errors
- Check vercel.json configuration
- Ensure all routes are properly configured

### CORS Errors
- Update CORS origin in backend
- Add domain to Supabase redirect URLs

### API Not Working
- Check environment variables in Vercel
- Check Vercel function logs
- Verify Supabase credentials

### Database Errors
- Run schema in Supabase
- Check Supabase logs
- Verify table names match

## Cost Estimate

### Vercel (Hobby Plan - Free)
- ✅ 100GB bandwidth/month
- ✅ Unlimited static sites
- ✅ Unlimited serverless functions
- ✅ Automatic HTTPS

### Supabase (Free Tier)
- ✅ 500MB database
- ✅ 10,000 monthly active users
- ✅ 50MB file storage
- ✅ 2GB bandwidth

**Total Cost: $0/month** for small to medium usage!

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel
3. ✅ Configure environment variables
4. ✅ Update Supabase settings
5. ✅ Test production deployment
6. ✅ Share URL with users!

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Docs: https://docs.github.com

---

**Your application will be live and accessible worldwide!** 🌍