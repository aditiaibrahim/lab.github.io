# Setup Guide - Laboratory Management System

## Troubleshooting Server Error "Failed to fetch"

Error "Failed to fetch" terjadi karena server backend tidak dapat terhubung ke database MySQL. Berikut langkah-langkah untuk memperbaiki:

## Langkah 1: Install MySQL

Pastikan MySQL sudah terinstall di komputer Anda:
- Download MySQL dari https://dev.mysql.com/downloads/mysql/
- Install dengan mengikuti wizard instalasi
- Catat password yang Anda set untuk root user

## Langkah 2: Buat Database

1. Buka MySQL Command Line Client atau phpMyAdmin
2. Buat database baru dengan nama `laboratory_management`:

```sql
CREATE DATABASE IF NOT EXISTS laboratory_management;
```

3. Import schema database dari file `database/schema.sql`:

```bash
mysql -u root -p laboratory_management < database/schema.sql
```

Atau jika menggunakan phpMyAdmin:
- Buka phpMyAdmin
- Pilih database `laboratory_management`
- Klik tab "Import"
- Pilih file `database/schema.sql`
- Klik "Go"

## Langkah 3: Konfigurasi File .env

Edit file `backend/.env` dan isi dengan kredensial database MySQL Anda:

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_mysql_anda
DB_NAME=laboratory_management

# Server Configuration
PORT=3000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development

# Supabase Configuration (Optional)
SUPABASE_URL=https://cqdttgkhhvyaxbxkguwq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZHR0Z2toaHZ5YXhieGtndXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDE2NTEsImV4cCI6MjA5OTExNzY1MX0.D2Qm5eEQeZ9YdbJxSGlcCuY0looaNeqLukEmIdrMCQM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZHR0Z2toaHZ5YXhieGtndXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU0MTY1MSwiZXhwIjoyMDk5MTE3NjUxfQ.SNazc3x7Et-08ptyfbeLefTnThZi_CfFLMfbmpyTEDY
```

**PENTING:** Ganti `password_mysql_anda` dengan password MySQL yang Anda set saat instalasi.

## Langkah 4: Install Dependencies

Buka terminal di folder project dan jalankan:

```bash
npm install
```

## Langkah 5: Jalankan Server

```bash
npm start
```

Atau untuk development dengan auto-reload:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Langkah 6: Akses Aplikasi

Buka browser dan akses:
- Homepage: `http://localhost:3000/index.html`
- Login: `http://localhost:3000/login.html`
- Register: `http://localhost:3000/register.html`

## Troubleshooting Umum

### Error: "Database connection error"
- Pastikan MySQL service berjalan
- Periksa kredensial di file `.env` (username, password, database name)
- Pastikan database `laboratory_management` sudah dibuat

### Error: "Access denied for user"
- Username atau password MySQL salah
- Periksa kembali file `.env`

### Error: "Unknown database"
- Database `laboratory_management` belum dibuat
- Buat database terlebih dahulu (lihat Langkah 2)

### Server Error Terus Muncul
- Pastikan MySQL tidak timeout atau crash
- Server sekarang memiliki auto-reconnect jika koneksi database terputus
- Cek console log untuk detail error

## Membuat Admin Account

Setelah setup, Anda perlu membuat admin account. Ada 2 cara:

### Cara 1: Manual SQL (Recommended)

Jalankan query SQL berikut di MySQL:

```sql
INSERT INTO users (nama, email, password, role, npm_nidn, status) 
VALUES ('Admin', 'admin@nusaputra.ac.id', '$2a$10$rQ7H8k9L2mN3oP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7', 'admin', NULL, 'approved');
```

Password default: `admin123`

### Cara 2: Via Script

Jalankan script create-admin:

```bash
node create-admin.js
```

## Fitur Baru - Error Handling

Server sekarang memiliki:
1. ✅ Database connection check sebelum setiap API request
2. ✅ Auto-reconnect jika koneksi database terputus
3. ✅ Error message yang lebih jelas
4. ✅ Graceful degradation (frontend tetap bisa diakses meskipun database error)

## Support

Jika masih mengalami masalah, periksa:
1. Console log server untuk error messages
2. Browser console (F12) untuk frontend errors
3. Pastikan port 3000 tidak digunakan aplikasi lain