const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../'));

// Database connection
let db;
let dbConnected = false;

if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  db.connect((err) => {
    if (err) {
      console.error('⚠️  Database connection error:', err.message);
      console.log('⚠️  Server running without database. Please start MySQL and configure .env file.');
      console.log('⚠️  Frontend pages will still be accessible at http://localhost:' + PORT);
      dbConnected = false;
    } else {
      console.log('✅ Connected to MySQL database');
      dbConnected = true;
    }
  });

  // Handle database disconnection
  db.on('error', (err) => {
    console.error('Database error:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('⚠️  Database connection lost. Attempting to reconnect...');
      dbConnected = false;
      setTimeout(() => {
        if (process.env.DB_HOST) {
          db.connect((connectErr) => {
            if (connectErr) {
              console.error('Reconnection failed:', connectErr.message);
            } else {
              console.log('✅ Reconnected to MySQL database');
              dbConnected = true;
            }
          });
        }
      }, 5000);
    }
  });
} else {
  console.warn('⚠️  Database credentials not found in .env file.');
  console.log('⚠️  Server running without database. Please configure database settings in backend/.env');
  console.log('⚠️  Frontend pages will still be accessible at http://localhost:' + PORT);
}

// Database check middleware
const checkDatabase = (req, res, next) => {
  if (!db || !dbConnected) {
    return res.status(503).json({ 
      message: 'Database service unavailable. Please try again later or contact administrator.',
      error: 'Database not connected'
    });
  }
  next();
};

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/register', checkDatabase, async (req, res) => {
  try {
    const { nama, email, password, role, npm_nidn } = req.body;

    if (!nama || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email exists
    const [existing] = await db.promise().query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.promise().query(
      'INSERT INTO users (nama, email, password, role, npm_nidn, status) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, email, hashedPassword, role, npm_nidn || null, 'pending']
    );

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/login', checkDatabase, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    if (user.status !== 'approved') {
      return res.status(403).json({ message: 'Account pending approval or rejected' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        npm_nidn: user.npm_nidn
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/api/me', authenticateToken, checkDatabase, async (req, res) => {
  try {
    const [users] = await db.promise().query(
      'SELECT id, nama, email, role, npm_nidn FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all pending users
app.get('/api/admin/users/pending', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    const [users] = await db.promise().query(
      'SELECT id, nama, email, role, npm_nidn, status, created_at FROM users WHERE status = ?',
      ['pending']
    );
    res.json(users);
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject user
app.put('/api/admin/users/:id/approve', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await db.promise().query(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: `User ${status} successfully` });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    const [users] = await db.promise().query(
      'SELECT id, nama, email, role, npm_nidn, status, created_at FROM users'
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get statistics
app.get('/api/admin/statistics', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    const [userStats] = await db.promise().query(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );
    
    const [scheduleStats] = await db.promise().query(
      'SELECT status, COUNT(*) as count FROM schedules GROUP BY status'
    );
    
    const [peminjamanStats] = await db.promise().query(
      'SELECT status, COUNT(*) as count FROM peminjaman GROUP BY status'
    );

    res.json({
      users: userStats,
      schedules: scheduleStats,
      peminjaman: peminjamanStats
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== LABORATORY ROUTES ====================

// Get all laboratories
app.get('/api/laboratories', checkDatabase, async (req, res) => {
  try {
    const [labs] = await db.promise().query(
      'SELECT * FROM laboratories WHERE status = ?',
      ['aktif']
    );
    res.json(labs);
  } catch (error) {
    console.error('Get laboratories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get laboratory by ID
app.get('/api/laboratories/:id', checkDatabase, async (req, res) => {
  try {
    const [labs] = await db.promise().query(
      'SELECT * FROM laboratories WHERE id = ?',
      [req.params.id]
    );

    if (labs.length === 0) {
      return res.status(404).json({ message: 'Laboratory not found' });
    }

    res.json(labs[0]);
  } catch (error) {
    console.error('Get laboratory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create laboratory (Admin)
app.post('/api/admin/laboratories', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    const { nama_lab, deskripsi, kapasitas, lokasi } = req.body;

    const [result] = await db.promise().query(
      'INSERT INTO laboratories (nama_lab, deskripsi, kapasitas, lokasi) VALUES (?, ?, ?, ?)',
      [nama_lab, deskripsi, kapasitas, lokasi]
    );

    res.status(201).json({ message: 'Laboratory created', id: result.insertId });
  } catch (error) {
    console.error('Create laboratory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update laboratory (Admin)
app.put('/api/admin/laboratories/:id', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    const { nama_lab, deskripsi, kapasitas, lokasi, status } = req.body;

    await db.promise().query(
      'UPDATE laboratories SET nama_lab = ?, deskripsi = ?, kapasitas = ?, lokasi = ?, status = ? WHERE id = ?',
      [nama_lab, deskripsi, kapasitas, lokasi, status, req.params.id]
    );

    res.json({ message: 'Laboratory updated' });
  } catch (error) {
    console.error('Update laboratory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete laboratory (Admin)
app.delete('/api/admin/laboratories/:id', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    await db.promise().query('DELETE FROM laboratories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Laboratory deleted' });
  } catch (error) {
    console.error('Delete laboratory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SCHEDULE ROUTES ====================

// Get all schedules
app.get('/api/schedules', checkDatabase, async (req, res) => {
  try {
    const [schedules] = await db.promise().query(`
      SELECT s.*, l.nama_lab, u.nama as user_name 
      FROM schedules s
      JOIN laboratories l ON s.lab_id = l.id
      JOIN users u ON s.user_id = u.id
      ORDER BY s.tanggal, s.time_start
    `);
    res.json(schedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get schedules by lab
app.get('/api/schedules/lab/:labId', checkDatabase, async (req, res) => {
  try {
    const [schedules] = await db.promise().query(`
      SELECT s.*, u.nama as user_name 
      FROM schedules s
      JOIN users u ON s.user_id = u.id
      WHERE s.lab_id = ? AND s.tanggal >= CURDATE()
      ORDER BY s.tanggal, s.time_start
    `, [req.params.labId]);
    res.json(schedules);
  } catch (error) {
    console.error('Get lab schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my schedules (Dosen/Mahasiswa)
app.get('/api/schedules/my', authenticateToken, checkDatabase, async (req, res) => {
  try {
    const [schedules] = await db.promise().query(`
      SELECT s.*, l.nama_lab 
      FROM schedules s
      JOIN laboratories l ON s.lab_id = l.id
      WHERE s.user_id = ?
      ORDER BY s.tanggal DESC, s.time_start DESC
    `, [req.user.id]);
    res.json(schedules);
  } catch (error) {
    console.error('Get my schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create schedule (Dosen)
app.post('/api/schedules', authenticateToken, checkDatabase, async (req, res) => {
  try {
    const { lab_id, mata_kuliah, time_start, time_finish, tanggal } = req.body;

    const [result] = await db.promise().query(
      'INSERT INTO schedules (lab_id, user_id, mata_kuliah, time_start, time_finish, tanggal) VALUES (?, ?, ?, ?, ?, ?)',
      [lab_id, req.user.id, mata_kuliah, time_start, time_finish, tanggal]
    );

    res.status(201).json({ message: 'Schedule created', id: result.insertId });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject schedule (Admin)
app.put('/api/admin/schedules/:id/approve', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    const { status } = req.body;

    await db.promise().query(
      'UPDATE schedules SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    res.json({ message: `Schedule ${status} successfully` });
  } catch (error) {
    console.error('Approve schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== EQUIPMENT ROUTES ====================

// Get all equipment
app.get('/api/equipment', checkDatabase, async (req, res) => {
  try {
    const [equipment] = await db.promise().query(`
      SELECT e.*, l.nama_lab 
      FROM equipment e
      LEFT JOIN laboratories l ON e.lab_id = l.id
      WHERE e.status = ?
    `, ['aktif']);
    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get equipment by ID
app.get('/api/equipment/:id', checkDatabase, async (req, res) => {
  try {
    const [equipment] = await db.promise().query(
      'SELECT * FROM equipment WHERE id = ?',
      [req.params.id]
    );

    if (equipment.length === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment[0]);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create equipment (Admin)
app.post('/api/admin/equipment', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    const { nama_barang, deskripsi, jumlah_total, lab_id } = req.body;

    const [result] = await db.promise().query(
      'INSERT INTO equipment (nama_barang, deskripsi, jumlah_total, jumlah_tersedia, lab_id) VALUES (?, ?, ?, ?, ?)',
      [nama_barang, deskripsi, jumlah_total, jumlah_total, lab_id]
    );

    res.status(201).json({ message: 'Equipment created', id: result.insertId });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== PEMINJAMAN ROUTES ====================

// Create peminjaman (Dosen/Mahasiswa)
app.post('/api/peminjaman', authenticateToken, checkDatabase, async (req, res) => {
  try {
    const { equipment_id, jumlah_pinjam, tanggal_pinjam, tanggal_kembali, keperluan } = req.body;

    // Check equipment availability
    const [equipment] = await db.promise().query(
      'SELECT jumlah_tersedia FROM equipment WHERE id = ?',
      [equipment_id]
    );

    if (equipment.length === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (equipment[0].jumlah_tersedia < jumlah_pinjam) {
      return res.status(400).json({ message: 'Insufficient equipment available' });
    }

    const [result] = await db.promise().query(
      'INSERT INTO peminjaman (user_id, equipment_id, jumlah_pinjam, tanggal_pinjam, tanggal_kembali, keperluan) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, equipment_id, jumlah_pinjam, tanggal_pinjam, tanggal_kembali, keperluan]
    );

    res.status(201).json({ message: 'Peminjaman request submitted', id: result.insertId });
  } catch (error) {
    console.error('Create peminjaman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my peminjaman
app.get('/api/peminjaman/my', authenticateToken, checkDatabase, async (req, res) => {
  try {
    const [peminjaman] = await db.promise().query(`
      SELECT p.*, e.nama_barang 
      FROM peminjaman p
      JOIN equipment e ON p.equipment_id = e.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [req.user.id]);
    res.json(peminjaman);
  } catch (error) {
    console.error('Get my peminjaman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all peminjaman (Admin)
app.get('/api/admin/peminjaman', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    const [peminjaman] = await db.promise().query(`
      SELECT p.*, e.nama_barang, u.nama as user_name 
      FROM peminjaman p
      JOIN equipment e ON p.equipment_id = e.id
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(peminjaman);
  } catch (error) {
    console.error('Get peminjaman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject peminjaman (Admin)
app.put('/api/admin/peminjaman/:id/approve', authenticateToken, requireAdmin, checkDatabase, async (req, res) => {
  try {
    const { status, catatan_admin } = req.body;
    const { id } = req.params;

    // Get peminjaman details
    const [peminjaman] = await db.promise().query(
      'SELECT * FROM peminjaman WHERE id = ?',
      [id]
    );

    if (peminjaman.length === 0) {
      return res.status(404).json({ message: 'Peminjaman not found' });
    }

    const pinjam = peminjaman[0];

    // If approved, update equipment availability
    if (status === 'approved') {
      await db.promise().query(
        'UPDATE equipment SET jumlah_tersedia = jumlah_tersedia - ? WHERE id = ?',
        [pinjam.jumlah_pinjam, pinjam.equipment_id]
      );
    }

    await db.promise().query(
      'UPDATE peminjaman SET status = ?, catatan_admin = ? WHERE id = ?',
      [status, catatan_admin, id]
    );

    res.json({ message: `Peminjaman ${status} successfully` });
  } catch (error) {
    console.error('Approve peminjaman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});