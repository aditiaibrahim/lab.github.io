-- Supabase Database Schema for Laboratory Management System
-- Run this SQL in Supabase SQL Editor

-- Users table (Admin, Dosen, Mahasiswa)
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS laboratories (
  id SERIAL PRIMARY KEY,
  nama_lab VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  gambar VARCHAR(255),
  kapasitas INT,
  lokasi VARCHAR(100),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Schedule table
CREATE TABLE IF NOT EXISTS schedules (
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

-- Equipment/Barang table
CREATE TABLE IF NOT EXISTS equipment (
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

-- Peminjaman Barang table
CREATE TABLE IF NOT EXISTS peminjaman (
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

-- Enable Row Level Security (RLS)
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