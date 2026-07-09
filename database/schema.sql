-- Database Schema for Laboratory Management System

CREATE DATABASE IF NOT EXISTS laboratory_management;
USE laboratory_management;

-- Users table (Admin, Dosen, Mahasiswa)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'dosen', 'mahasiswa') NOT NULL,
  npm_nidn VARCHAR(50),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Laboratories table
CREATE TABLE IF NOT EXISTS laboratories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_lab VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  gambar VARCHAR(255),
  kapasitas INT,
  lokasi VARCHAR(100),
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedule table
CREATE TABLE IF NOT EXISTS schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lab_id INT,
  user_id INT,
  mata_kuliah VARCHAR(100) NOT NULL,
  time_start TIME NOT NULL,
  time_finish TIME NOT NULL,
  tanggal DATE NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lab_id) REFERENCES laboratories(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Equipment/Barang table
CREATE TABLE IF NOT EXISTS equipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_barang VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  jumlah_total INT NOT NULL,
  jumlah_tersedia INT NOT NULL,
  lab_id INT,
  gambar VARCHAR(255),
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lab_id) REFERENCES laboratories(id) ON DELETE SET NULL
);

-- Peminjaman Barang table
CREATE TABLE IF NOT EXISTS peminjaman (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  equipment_id INT,
  jumlah_pinjam INT NOT NULL,
  tanggal_pinjam DATE NOT NULL,
  tanggal_kembali DATE NOT NULL,
  keperluan TEXT,
  status ENUM('pending', 'approved', 'rejected', 'returned') DEFAULT 'pending',
  catatan_admin TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (nama, email, password, role, status) VALUES
('Administrator', 'admin@nusaputra.ac.id', '$2a$10$QFfOxY7xBQD0Y/eCCVdSfODV8UTi6shrM9UI0t5w0Th63bja6etl6', 'admin', 'approved');

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