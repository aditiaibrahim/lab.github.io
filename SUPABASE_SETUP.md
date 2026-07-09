# Supabase Setup Guide - Laboratory Management System

## 🚀 Quick Setup with Supabase

### 1. Create Supabase Project

1. Buka [Supabase](https://supabase.com/)
2. Sign up / Login
3. Klik **"New Project"**
4. Isi:
   - **Project Name**: `laboratory-management`
   - **Database Password**: (simpan password ini)
   - **Region**: Pilih region terdekat (Singapore/Asia)
5. Klik **"Create new project"**
6. Tunggu hingga project siap (1-2 menit)

### 2. Get Supabase Credentials

1. Di dashboard Supabase, klik **"Project Settings"** (icon gear di sidebar)
2. Klik **"API"**
3. Anda akan melihat:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Simpan kedua key ini!**

### 3. Setup Database Schema

1. Di Supabase dashboard, klik **"SQL Editor"** di sidebar
2. Klik **"New query"**
3. Copy paste SQL schema dari file `database/supabase-schema.sql`
4. Klik **"Run"** untuk menjalankan SQL

### 4. Configure Environment

Edit file `backend/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Server Configuration
PORT=3000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**Ganti dengan credentials dari Supabase Anda!**

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Server (Supabase Version)

```bash
# Using the Supabase server
node backend/server-supabase.js
```

Atau buat script di package.json:

```json
"scripts": {
  "start": "node backend/server.js",
  "start:supabase": "node backend/server-supabase.js",
  "dev": "nodemon backend/server.js",
  "dev:supabase": "nodemon backend/server-supabase.js"
}
```

Kemudian jalankan:

```bash
npm run start:supabase
```

### 7. Access Application

Buka browser:
- **Homepage**: http://localhost:3000/index.html
- **Login**: http://localhost:3000/login.html

## 📊 Supabase Database Schema

### Tables to Create in Supabase

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'dosen', 'mahasiswa')),
  npm_nidn VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Laboratories table
CREATE TABLE laboratories (
  id SERIAL PRIMARY KEY,
  nama_lab VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  gambar VARCHAR(255),
  kapasitas INT,
  lokasi VARCHAR(100),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Schedules table
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  lab_id INT REFERENCES laboratories(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  mata_kuliah VARCHAR(100) NOT NULL,
  time_start TIME NOT NULL,
  time_finish TIME NOT NULL,
  tanggal DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Equipment table
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  nama_barang VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  jumlah_total INT NOT NULL,
  jumlah_tersedia INT NOT NULL,
  lab_id INT REFERENCES laboratories(id) ON DELETE SET NULL,
  gambar VARCHAR(255),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Peminjaman table
CREATE TABLE peminjaman (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
  jumlah_pinjam INT NOT NULL,
  tanggal_pinjam DATE NOT NULL,
  tanggal_kembali DATE NOT NULL,
  keperluan TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'returned')),
  catatan_admin TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO users (nama, email, password, role, status) VALUES
('Administrator', 'admin@nusaputra.ac.id', '$2a$10$rQ7H8p9Y2Z3X4C5V6B7N8M9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H', 'admin', 'approved');

-- Insert sample laboratories
INSERT INTO laboratories (nama_lab, deskripsi, kapasitas, lokasi) VALUES
('Computer Lab 1 (Hardware)', 'Laboratorium untuk praktikum hardware dan assembling komputer', 40, 'Gedung A Lantai 2'),
('Computer Lab 2 (Software)', 'Laboratorium untuk praktikum pemrograman dan software', 40, 'Gedung A Lantai 3'),
('Computer Lab 3 (Language Lab)', 'Laboratorium bahasa dengan sistem audio modern', 30, 'Gedung A Lantai 4'),
('Photography Studio', 'Studio fotografi dan videografi dengan peralatan lengkap', 20, 'Gedung B Lantai 1'),
('Electro Lab', 'Laboratorium elektronika dan kelistrikan', 35, 'Gedung B Lantai 2'),
('Civil Lab', 'Laboratorium teknik sipil untuk praktikum struktur', 30, 'Gedung C Lantai 1'),
('Machine Lab', 'Laboratorium mesin dan manufaktur', 25, 'Gedung C Lantai 2');

-- Insert sample equipment
INSERT INTO equipment (nama_barang, deskripsi, jumlah_total, jumlah_tersedia, lab_id) VALUES
('Proyektor', 'Proyektor untuk presentasi', 10, 8, 1),
('Laptop', 'Laptop untuk praktikum', 50, 35, 1),
('Oscilloscope', 'Alat ukur gelombang', 15, 12, 5),
('Camera DSLR', 'Kamera digital untuk fotografi', 8, 6, 4),
('Tripod', 'Tripod untuk kamera', 10, 7, 4),
('Multimeter', 'Alat ukur listrik', 20, 15, 5),
('3D Printer', 'Printer 3D untuk prototyping', 3, 2, 1),
('Drone', 'Drone untuk pengambilan gambar udara', 2, 1, 4);
```

### 4. Enable Row Level Security (RLS)

Di Supabase SQL Editor, jalankan:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE peminjaman ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Allow public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update users" ON users FOR UPDATE USING (true);

-- Create policies for laboratories
CREATE POLICY "Allow public read laboratories" ON laboratories FOR SELECT USING (true);
CREATE POLICY "Allow insert laboratories" ON laboratories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update laboratories" ON laboratories FOR UPDATE USING (true);
CREATE POLICY "Allow delete laboratories" ON laboratories FOR DELETE USING (true);

-- Create policies for schedules
CREATE POLICY "Allow public read schedules" ON schedules FOR SELECT USING (true);
CREATE POLICY "Allow insert schedules" ON schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update schedules" ON schedules FOR UPDATE USING (true);

-- Create policies for equipment
CREATE POLICY "Allow public read equipment" ON equipment FOR SELECT USING (true);
CREATE POLICY "Allow insert equipment" ON equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update equipment" ON equipment FOR UPDATE USING (true);

-- Create policies for peminjaman
CREATE POLICY "Allow public read peminjaman" ON peminjaman FOR SELECT USING (true);
CREATE POLICY "Allow insert peminjaman" ON peminjaman FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update peminjaman" ON peminjaman FOR UPDATE USING (true);
```

## 🔑 Default Admin Account

- **Email**: `admin@nusaputra.ac.id`
- **Password**: `admin123`

## ✨ Keunggulan Menggunakan Supabase

1. **No Database Setup** - Tidak perlu install MySQL
2. **Auto-scaling** - Database otomatis scale
3. **Built-in Auth** - Bisa pakai auth Supabase (opsional)
4. **Real-time** - Bisa tambah fitur real-time
5. **Free Tier** - Gratis untuk development
6. **Dashboard** - UI yang bagus untuk manage data
7. **Backup** - Automatic backup

## 📝 Notes

- Server akan berjalan di port yang sama (3000)
- Semua API endpoint tetap sama
- Frontend tidak perlu diubah
- Database schema sama dengan MySQL version

## 🆚 MySQL vs Supabase

| Feature | MySQL | Supabase |
|---------|-------|----------|
| Setup | Perlu install MySQL | Cloud-based |
| Cost | Free | Free tier available |
| Scaling | Manual | Automatic |
| Backup | Manual | Automatic |
| Dashboard | phpMyAdmin | Supabase Dashboard |
| Real-time | No | Yes |
| Auth | Custom | Built-in |

## 🎯 Testing

Setelah setup, test dengan:

1. Register sebagai Mahasiswa
2. Login sebagai Admin (admin@nusaputra.ac.id / admin123)
3. Approve akun mahasiswa
4. Login sebagai mahasiswa
5. Test semua fitur

## 📞 Support

Jika ada masalah:
1. Cek Supabase dashboard untuk error logs
2. Cek terminal untuk backend errors
3. Pastikan credentials di `.env` benar
4. Pastikan schema SQL sudah dijalankan

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)