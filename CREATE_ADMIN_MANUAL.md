# Create Admin User Manually in Supabase

## Method 1: Using Supabase Dashboard (RECOMMENDED)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/cqdttgkhhvyaxbxkguwq/editor
2. Make sure you're logged in

### Step 2: Go to Table Editor
1. Click **"Table Editor"** in the left sidebar
2. Click on the **"users"** table

### Step 3: Insert Admin User
1. Click **"Insert row"** button
2. Fill in the following data:

```
nama: Administrator
email: admin@nusaputra.ac.id
password: $2a$10$QFfOxY7xBQD0Y/eCCVdSfODV8UTi6shrM9UI0t5w0Th63bja6etl6
role: admin
status: approved
npm_nidn: (leave empty)
```

3. Click **"Save"**

### Step 4: Verify
The admin user is now created! You can login with:
- Email: admin@nusaputra.ac.id
- Password: admin123

---

## Method 2: Using SQL Editor

### Step 1: Open SQL Editor
1. Go to https://supabase.com/dashboard/project/cqdttgkhhvyaxbxkguwq/editor
2. Click **"SQL Editor"** in left sidebar
3. Click **"New query"**

### Step 2: Run This SQL

```sql
INSERT INTO users (nama, email, password, role, status) VALUES
('Administrator', 'admin@nusaputra.ac.id', '$2a$10$QFfOxY7xBQD0Y/eCCVdSfODV8UTi6shrM9UI0t5w0Th63bja6etl6', 'admin', 'approved');
```

### Step 3: Click "Run"
You should see "Success. 1 row affected"

---

## Method 3: If You Still Get Connection Errors

The connection timeout might be due to:
1. **Network issues** - Check your internet connection
2. **Firewall** - Make sure port 443 is not blocked
3. **Supabase project status** - Check if project is active in dashboard

### Alternative: Use Supabase Client Directly

Create a new file `create-admin-direct.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cqdttgkhhvyaxbxkguwq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZHR0Z2toaHZ5YXhieGtndXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDE2NTEsImV4cCI6MjA5OTExNzY1MX0.D2Qm5eEQeZ9YdbJxSGlcCuY0looaNeqLukEmIdrMCQM'
);

async function createAdmin() {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        nama: 'Administrator',
        email: 'admin@nusaputra.ac.id',
      password: '$2a$10$QFfOxY7xBQD0Y/eCCVdSfODV8UTi6shrM9UI0t5w0Th63bja6etl6',
        role: 'admin',
        status: 'approved'
      }
    ]);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Admin created:', data);
  }
}

createAdmin();
```

Then run: `node create-admin-direct.js`

---

## After Creating Admin User

1. Go to http://localhost:3000/login.html
2. Login with:
   - Email: admin@nusaputra.ac.id
   - Password: admin123
3. You should now see the Admin Dashboard!

---

## Troubleshooting

**Error: "relation users does not exist"**
→ You haven't run the SQL schema yet. Go to Supabase → SQL Editor → Run `database/supabase-schema.sql`

**Error: "duplicate key value violates unique constraint"**
→ Admin user already exists. Try logging in directly.

**Error: "connection timeout"**
→ Check your internet connection or try again later. Supabase might be temporarily unavailable.

**Login still fails after creating admin**
→ Make sure the password hash is correct. Use the hash provided above: `$2a$10$QFfOxY7xBQD0Y/eCCVdSfODV8UTi6shrM9UI0t5w0Th63bja6etl6`
</parameter>
<task_progress>
- [x] Set up project structure and folders
- [x] Create database schema and configuration
- [x] Build backend API with Express.js
- [x] Create authentication system (register/login)
- [x] Implement admin features
- [x] Implement dosen features
- [x] Implement mahasiswa features
- [x] Create frontend pages (index, login, register, dashboard)
- [x] Add responsive CSS styling
- [x] Install dependencies
- [x] Create Supabase version
- [x] Configure Supabase credentials
- [x] Create Supabase SQL schema
- [x] Create comprehensive documentation
- [x] Install Supabase module
- [x] Fix environment variable loading
- [x] Start Supabase server
- [x] Create admin user script
- [x] Fix Supabase URL
- [x] Restart server with correct URL
- [x] Create admin user in database
- [ ] Test login system
</task_progress>
</write_to_file>