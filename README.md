# Laboratory Management System - Universitas Nusa Putra

Sistem manajemen laboratorium untuk Universitas Nusa Putra dengan fitur lengkap untuk admin, dosen, dan mahasiswa.

## 🎯 Fitur Utama

### 1. Authentication System
- Register dengan role (Mahasiswa/Dosen)
- Login dengan JWT token
- Password hashing dengan bcrypt
- Approval akun oleh admin

### 2. Admin Features
- Dashboard dengan statistik
- Manajemen user (approve/reject)
- Manajemen jadwal laboratorium
- Manajemen data laboratorium
- Manajemen peminjaman barang

### 3. Dosen Features
- Dashboard pribadi
- Booking laboratorium
- Lihat jadwal saya
- Peminjaman barang

### 4. Mahasiswa Features
- Dashboard pribadi
- Lihat jadwal laboratorium
- Peminjaman barang

## 🛠️ Teknologi

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcryptjs

## 📁 Struktur Project

```
Web Lab/
├── index.html              # Halaman utama
├── login.html              # Halaman login
├── register.html           # Halaman registrasi
├── package.json            # Dependencies
├── backend/
│   ├── server.js           # Express server
│   ├── .env                # Environment variables
│   └── config/
│       └── database.js     # Database config
├── dashboard/
│   ├── admin.html          # Admin dashboard
│   ├── dosen.html          # Dosen dashboard
│   └── mahasiswa.html      # Mahasiswa dashboard
└── database/
    └── schema.sql          # Database schema
```

## 🚀 Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

1. Buka phpMyAdmin atau MySQL command line
2. Import file `database/schema.sql`
3. Database akan otomatis dibuat dengan nama `laboratory_management`

### 3. Konfigurasi Environment

Edit file `backend/.env` sesuai dengan konfigurasi MySQL Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=laboratory_management
PORT=3000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 4. Jalankan Server

```bash
# Development mode (dengan nodemon)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

### 5. Akses Aplikasi

Buka browser dan akses:
- **Homepage**: `http://localhost:3000/index.html`
- **Login**: `http://localhost:3000/login.html`
- **Register**: `http://localhost:3000/register.html`

## 👤 Default Admin Account

Setelah import database, Anda bisa login dengan:

- **Email**: `admin@nusaputra.ac.id`
- **Password**: `admin123`

## 📊 Database Schema

### Tables:
1. **users** - Data user (admin, dosen, mahasiswa)
2. **laboratories** - Data laboratorium
3. **schedules** - Jadwal penggunaan lab
4. **equipment** - Data peralatan/barang
5. **peminjaman** - Data peminjaman barang

## 🔐 Role & Permission

### Admin
- Approve/reject akun baru
- Kelola semua data
- Lihat statistik
- Approve/reject jadwal dan peminjaman

### Dosen
- Booking laboratorium
- Lihat jadwal sendiri
- Peminjaman barang

### Mahasiswa
- Lihat jadwal laboratorium
- Peminjaman barang

## 🎨 Design

- Modern minimalis design
- Responsive (mobile-friendly)
- Sticky navbar
- Gradient hero section
- Card-based layout
- Poppins font family
- Blue accent color scheme

## 📝 API Endpoints

### Authentication
- `POST /api/register` - Register user
- `POST /api/login` - Login user
- `GET /api/me` - Get current user

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/pending` - Get pending users
- `PUT /api/admin/users/:id/approve` - Approve/reject user
- `GET /api/admin/statistics` - Get statistics
- `GET /api/admin/schedules` - Get all schedules
- `PUT /api/admin/schedules/:id/approve` - Approve/reject schedule
- `GET /api/admin/peminjaman` - Get all peminjaman
- `PUT /api/admin/peminjaman/:id/approve` - Approve/reject peminjaman

### Laboratories
- `GET /api/laboratories` - Get all laboratories
- `GET /api/laboratories/:id` - Get laboratory by ID
- `POST /api/admin/laboratories` - Create laboratory (admin)
- `PUT /api/admin/laboratories/:id` - Update laboratory (admin)
- `DELETE /api/admin/laboratories/:id` - Delete laboratory (admin)

### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/my` - Get my schedules
- `POST /api/schedules` - Create schedule
- `GET /api/schedules/lab/:labId` - Get schedules by lab

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/admin/equipment` - Create equipment (admin)

### Peminjaman
- `POST /api/peminjaman` - Create peminjaman
- `GET /api/peminjaman/my` - Get my peminjaman
- `GET /api/admin/peminjaman` - Get all peminjaman (admin)
- `PUT /api/admin/peminjaman/:id/approve` - Approve/reject peminjaman (admin)

## 🧪 Testing

1. Register sebagai Mahasiswa/Dosen
2. Login sebagai Admin dan approve akun
3. Test booking laboratorium
4. Test peminjaman barang
5. Test approval/rejection

## 📝 Notes

- Semua password di-hash menggunakan bcrypt
- JWT token berlaku 24 jam
- Admin perlu approve akun baru sebelum bisa login
- Semua form memiliki validasi
- Responsive design untuk mobile dan desktop

## 👨‍💻 Developer

Dibuat untuk Universitas Nusa Putra

## 📄 License

© 2024 Laboratory Unit - Universitas Nusa Putra. All rights reserved.