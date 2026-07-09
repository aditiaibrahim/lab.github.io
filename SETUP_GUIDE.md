# Setup Guide - Laboratory Management System

## 📋 Prerequisites

Sebelum menjalankan aplikasi, pastikan Anda memiliki:

1. **Node.js** (v14 atau lebih baru) - [Download di sini](https://nodejs.org/)
2. **MySQL** (v5.7 atau lebih baru) - [Download di sini](https://dev.mysql.com/downloads/mysql/)
3. **Web Browser** (Chrome, Firefox, Edge, dll)

## 🚀 Langkah-langkah Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MySQL Database

#### Opsi A: Menggunakan phpMyAdmin (Recommended untuk pemula)

1. Buka phpMyAdmin di browser (biasanya `http://localhost/phpmyadmin`)
2. Klik tab **"Import"**
3. Pilih file `database/schema.sql`
4. Klik **"Go"** atau **"Import"**

#### Opsi B: Menggunakan MySQL Command Line

```bash
# Login ke MySQL
mysql -u root -p

# Import database
source database/schema.sql
```

### 3. Konfigurasi Database

Edit file `backend/.env` sesuai dengan konfigurasi MySQL Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password  # Ganti dengan password MySQL Anda
DB_NAME=laboratory_management
PORT=3000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**Catatan:** Jika MySQL Anda tidak memiliki password, biarkan `DB_PASSWORD=` (kosong)

### 4. Jalankan Aplikasi

```bash
npm start
```

Anda akan melihat output:
```
Server running on http://localhost:3000
✅ Connected to MySQL database
```

### 5. Akses Aplikasi

Buka browser dan kunjungi:

- **Homepage**: http://localhost:3000/index.html
- **Login**: http://localhost:3000/login.html
- **Register**: http://localhost:3000/register.html

## 👤 Akun Default

### Admin Account
- **Email**: `admin@nusaputra.ac.id`
- **Password**: `admin123`

## 🧪 Testing Flow

### Test 1: Register sebagai Mahasiswa

1. Buka http://localhost:3000/register.html
2. Isi form registrasi:
   - Nama: `John Doe`
   - Email: `john@nusaputra.ac.id`
   - Password: `password123`
   - Role: `Mahasiswa`
   - NPM: `123456789`
3. Klik **Daftar**
4. Anda akan melihat pesan "Menunggu approval admin"

### Test 2: Login sebagai Admin

1. Buka http://localhost:3000/login.html
2. Login dengan akun admin:
   - Email: `admin@nusaputra.ac.id`
   - Password: `admin123`
3. Anda akan diarahkan ke Admin Dashboard

### Test 3: Approve Akun Mahasiswa

1. Di Admin Dashboard, klik **"Manajemen User"**
2. Tab **"Pending Approval"** akan menampilkan akun John Doe
3. Klik **"Approve"** untuk menyetujui akun
4. Akun John Doe sekarang bisa login

### Test 4: Login sebagai Mahasiswa

1. Logout dari akun admin
2. Login dengan akun John Doe:
   - Email: `john@nusaputra.ac.id`
   - Password: `password123`
3. Anda akan diarahkan ke Mahasiswa Dashboard
4. Di sini Anda bisa:
   - Melihat jadwal laboratorium
   - Mengajukan peminjaman barang

### Test 5: Booking Laboratorium (Dosen)

1. Register akun baru sebagai Dosen:
   - Email: `dosen@nusaputra.ac.id`
   - Role: `Dosen`
   - NIDN: `987654321`
2. Login sebagai admin dan approve akun dosen
3. Login sebagai dosen
4. Klik **"Booking Lab"** di sidebar
5. Pilih laboratorium, isi mata kuliah, tanggal, dan waktu
6. Klik **"Ajukan Booking"**
7. Login kembali sebagai admin
8. Di **"Manajemen Jadwal"**, approve booking yang dibuat dosen

### Test 6: Peminjaman Barang

1. Login sebagai mahasiswa/dosen
2. Klik **"Peminjaman"** di sidebar
3. Klik **"+ Ajukan Peminjaman"**
4. Pilih barang, jumlah, tanggal pinjam/kembali, dan keperluan
5. Klik **"Ajukan Peminjaman"**
6. Login sebagai admin
7. Di **"Manajemen Peminjaman"**, approve atau reject peminjaman

## 🔧 Troubleshooting

### Error: "Database connection error"

**Penyebab:** MySQL belum berjalan atau konfigurasi salah

**Solusi:**
1. Pastikan MySQL service berjalan:
   - Windows: Buka Services, cari MySQL, klik Start
   - Atau via XAMPP/WAMP control panel
2. Periksa konfigurasi di `backend/.env`
3. Test koneksi MySQL:
   ```bash
   mysql -u root -p
   ```

### Error: "Access token required"

**Penyebab:** Belum login atau token expired

**Solusi:**
1. Login kembali melalui halaman login
2. Token berlaku 24 jam, setelah itu perlu login ulang

### Error: "Account pending approval"

**Penyebab:** Akun belum disetujui admin

**Solusi:**
1. Login sebagai admin
2. Buka Manajemen User
3. Approve akun yang pending

### Port 3000 sudah digunakan

**Solusi:**
1. Ubah port di `backend/.env`:
   ```
   PORT=3001
   ```
2. Akses aplikasi di `http://localhost:3001`

### Halaman putih/blank

**Penyebab:** JavaScript error atau API tidak bisa diakses

**Solusi:**
1. Buka Developer Tools (F12)
2. Cek Console untuk error messages
3. Pastikan server berjalan di port 3000
4. Clear browser cache (Ctrl+Shift+R)

## 📊 Database Structure

### Tables Overview

1. **users** - Menyimpan data pengguna (admin, dosen, mahasiswa)
2. **laboratories** - Menyimpan data laboratorium
3. **schedules** - Menyimpan jadwal penggunaan lab
4. **equipment** - Menyimpan data peralatan/barang
5. **peminjaman** - Menyimpan data peminjaman barang

### Sample Data

Database sudah dilengkapi dengan:
- 1 admin account
- 7 laboratorium
- 8 equipment items

## 🎨 Fitur UI/UX

- ✅ Modern minimalis design
- ✅ Responsive (mobile-friendly)
- ✅ Sticky navbar
- ✅ Gradient hero section
- ✅ Card-based layout
- ✅ Poppins font family
- ✅ Blue accent color scheme
- ✅ FAQ accordion
- ✅ Status badges
- ✅ Modal forms
- ✅ Loading states
- ✅ Alert notifications

## 🔐 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection prevention (prepared statements)
- ✅ CORS enabled

## 📝 Notes

- Semua API endpoint memerlukan authentication token (kecuali login, register, dan get public data)
- Admin harus approve akun baru sebelum bisa login
- JWT token berlaku 24 jam
- Semua form memiliki validasi client-side
- Server akan tetap berjalan meskipun database tidak terhubung (untuk development)

## 🆘 Support

Jika mengalami masalah:
1. Cek console browser (F12) untuk error messages
2. Cek terminal output untuk backend errors
3. Pastikan MySQL berjalan dan database sudah di-import
4. Periksa konfigurasi di file `.env`

## 📄 License

© 2024 Laboratory Unit - Universitas Nusa Putra. All rights reserved.