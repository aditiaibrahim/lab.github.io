const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Get local IP address
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let localIP = 'localhost';

for (const interfaceName in networkInterfaces) {
  const interfaces = networkInterfaces[interfaceName];
  for (const iface of interfaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      localIP = iface.address;
      break;
    }
  }
}

// Debug: Check if environment variables are loaded
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Loaded ✓' : 'NOT FOUND ✗');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Loaded ✓' : 'NOT FOUND ✗');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Error: Supabase credentials not found in .env file');
  console.error('Please configure backend/.env with your Supabase credentials');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from parent directory
app.use(express.static('../', {
  dotfiles: 'allow',
  etag: true,
  lastModified: true
}));

// Serve HTML files
app.get('*', (req, res) => {
  const filePath = req.path === '/' ? '/index.html' : req.path;
  res.sendFile(path.join(__dirname, '..', filePath));
});

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
app.post('/api/register', async (req, res) => {
  try {
    const { nama, email, password, role, npm_nidn } = req.body;

    if (!nama || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nama,
          email,
          password: hashedPassword,
          role,
          npm_nidn: npm_nidn || null,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Email already registered' });
      }
      console.error('Register error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      userId: data.id
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Get user
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log('Database query result:', { users: users ? 'found' : 'not found', error });

    if (error || !users) {
      console.log('User not found or error:', error);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User status:', users.status);

    if (users.status !== 'approved') {
      return res.status(403).json({ message: 'Account pending approval or rejected' });
    }

    // Verify password
    console.log('Comparing passwords...');
    const validPassword = await bcrypt.compare(password, users.password);
    console.log('Password valid:', validPassword);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: users.id, email: users.email, role: users.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email);
    res.json({
      token,
      user: {
        id: users.id,
        nama: users.nama,
        email: users.email,
        role: users.role,
        npm_nidn: users.npm_nidn
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Get current user
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, nama, email, role, npm_nidn')
      .eq('id', req.user.id)
      .single();

    if (error || !users) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all pending users
app.get('/api/admin/users/pending', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, nama, email, role, npm_nidn, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(users || []);
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject user
app.put('/api/admin/users/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const { error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    res.json({ message: `User ${status} successfully` });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, nama, email, role, npm_nidn, status, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(users || []);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get statistics
app.get('/api/admin/statistics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get user stats
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('role');

    // Get schedule stats
    const { data: schedules, error: scheduleError } = await supabase
      .from('schedules')
      .select('status');

    // Get peminjaman stats
    const { data: peminjaman, error: peminjamanError } = await supabase
      .from('peminjaman')
      .select('status');

    if (userError || scheduleError || peminjamanError) throw error;

    // Process stats
    const userStats = users?.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {}) || {};

    const scheduleStats = schedules?.reduce((acc, schedule) => {
      acc[schedule.status] = (acc[schedule.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const peminjamanStats = peminjaman?.reduce((acc, pinjam) => {
      acc[pinjam.status] = (acc[pinjam.status] || 0) + 1;
      return acc;
    }, {}) || {};

    res.json({
      users: Object.entries(userStats).map(([role, count]) => ({ role, count })),
      schedules: Object.entries(scheduleStats).map(([status, count]) => ({ status, count })),
      peminjaman: Object.entries(peminjamanStats).map(([status, count]) => ({ status, count }))
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== LABORATORY ROUTES ====================

// Get all laboratories
app.get('/api/laboratories', async (req, res) => {
  try {
    const { data: labs, error } = await supabase
      .from('laboratories')
      .select('*')
      .eq('status', 'aktif')
      .order('nama_lab');

    if (error) throw error;
    res.json(labs || []);
  } catch (error) {
    console.error('Get laboratories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get laboratory by ID
app.get('/api/laboratories/:id', async (req, res) => {
  try {
    const { data: lab, error } = await supabase
      .from('laboratories')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !lab) {
      return res.status(404).json({ message: 'Laboratory not found' });
    }

    res.json(lab);
  } catch (error) {
    console.error('Get laboratory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create laboratory (Admin)
app.post('/api/admin/laboratories', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nama_lab, deskripsi, kapasitas, lokasi } = req.body;

    const { data, error } = await supabase
      .from('laboratories')
      .insert([
        {
          nama_lab,
          deskripsi,
          kapasitas,
          lokasi,
          status: 'aktif'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Laboratory created', id: data.id });
  } catch (error) {
    console.error('Create laboratory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update laboratory (Admin)
app.put('/api/admin/laboratories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nama_lab, deskripsi, kapasitas, lokasi, status } = req.body;

    const { error } = await supabase
      .from('laboratories')
      .update({
        nama_lab,
        deskripsi,
        kapasitas,
        lokasi,
        status
      })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Laboratory updated' });
  } catch (error) {
    console.error('Update laboratory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete laboratory (Admin)
app.delete('/api/admin/laboratories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('laboratories')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Laboratory deleted' });
  } catch (error) {
    console.error('Delete laboratory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SCHEDULE ROUTES ====================

// Get all schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const { data: schedules, error } = await supabase
      .from('schedules')
      .select(`
        *,
        laboratories (nama_lab),
        users (nama)
      `)
      .order('tanggal', { ascending: true })
      .order('time_start', { ascending: true });

    if (error) throw error;

    const formattedSchedules = schedules?.map(schedule => ({
      ...schedule,
      nama_lab: schedule.laboratories?.nama_lab,
      user_name: schedule.users?.nama
    })) || [];

    res.json(formattedSchedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get schedules by lab
app.get('/api/schedules/lab/:labId', async (req, res) => {
  try {
    const { data: schedules, error } = await supabase
      .from('schedules')
      .select(`
        *,
        users (nama)
      `)
      .eq('lab_id', req.params.labId)
      .gte('tanggal', new Date().toISOString().split('T')[0])
      .order('tanggal', { ascending: true })
      .order('time_start', { ascending: true });

    if (error) throw error;

    const formattedSchedules = schedules?.map(schedule => ({
      ...schedule,
      user_name: schedule.users?.nama
    })) || [];

    res.json(formattedSchedules);
  } catch (error) {
    console.error('Get lab schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my schedules (Dosen/Mahasiswa)
app.get('/api/schedules/my', authenticateToken, async (req, res) => {
  try {
    const { data: schedules, error } = await supabase
      .from('schedules')
      .select(`
        *,
        laboratories (nama_lab)
      `)
      .eq('user_id', req.user.id)
      .order('tanggal', { ascending: false })
      .order('time_start', { ascending: false });

    if (error) throw error;

    const formattedSchedules = schedules?.map(schedule => ({
      ...schedule,
      nama_lab: schedule.laboratories?.nama_lab
    })) || [];

    res.json(formattedSchedules);
  } catch (error) {
    console.error('Get my schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create schedule (Dosen)
app.post('/api/schedules', authenticateToken, async (req, res) => {
  try {
    const { lab_id, mata_kuliah, time_start, time_finish, tanggal } = req.body;

    const { data, error } = await supabase
      .from('schedules')
      .insert([
        {
          lab_id,
          user_id: req.user.id,
          mata_kuliah,
          time_start,
          time_finish,
          tanggal,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Schedule created', id: data.id });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject schedule (Admin)
app.put('/api/admin/schedules/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const { error } = await supabase
      .from('schedules')
      .update({ status })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: `Schedule ${status} successfully` });
  } catch (error) {
    console.error('Approve schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== EQUIPMENT ROUTES ====================

// Get all equipment
app.get('/api/equipment', async (req, res) => {
  try {
    const { data: equipment, error } = await supabase
      .from('equipment')
      .select(`
        *,
        laboratories (nama_lab)
      `)
      .eq('status', 'aktif')
      .order('nama_barang');

    if (error) throw error;

    const formattedEquipment = equipment?.map(eq => ({
      ...eq,
      nama_lab: eq.laboratories?.nama_lab
    })) || [];

    res.json(formattedEquipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get equipment by ID
app.get('/api/equipment/:id', async (req, res) => {
  try {
    const { data: equipment, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create equipment (Admin)
app.post('/api/admin/equipment', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nama_barang, deskripsi, jumlah_total, lab_id } = req.body;

    const { data, error } = await supabase
      .from('equipment')
      .insert([
        {
          nama_barang,
          deskripsi,
          jumlah_total,
          jumlah_tersedia: jumlah_total,
          lab_id,
          status: 'aktif'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Equipment created', id: data.id });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== PEMINJAMAN ROUTES ====================

// Create peminjaman (Dosen/Mahasiswa)
app.post('/api/peminjaman', authenticateToken, async (req, res) => {
  try {
    const { equipment_id, jumlah_pinjam, tanggal_pinjam, tanggal_kembali, keperluan } = req.body;

    // Check equipment availability
    const { data: equipment, error: eqError } = await supabase
      .from('equipment')
      .select('jumlah_tersedia')
      .eq('id', equipment_id)
      .single();

    if (eqError || !equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (equipment.jumlah_tersedia < jumlah_pinjam) {
      return res.status(400).json({ message: 'Insufficient equipment available' });
    }

    const { data, error } = await supabase
      .from('peminjaman')
      .insert([
        {
          user_id: req.user.id,
          equipment_id,
          jumlah_pinjam,
          tanggal_pinjam,
          tanggal_kembali,
          keperluan,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Peminjaman request submitted', id: data.id });
  } catch (error) {
    console.error('Create peminjaman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my peminjaman
app.get('/api/peminjaman/my', authenticateToken, async (req, res) => {
  try {
    const { data: peminjaman, error } = await supabase
      .from('peminjaman')
      .select(`
        *,
        equipment (nama_barang)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedPeminjaman = peminjaman?.map(p => ({
      ...p,
      nama_barang: p.equipment?.nama_barang
    })) || [];

    res.json(formattedPeminjaman);
  } catch (error) {
    console.error('Get my peminjaman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all peminjaman (Admin)
app.get('/api/admin/peminjaman', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: peminjaman, error } = await supabase
      .from('peminjaman')
      .select(`
        *,
        equipment (nama_barang),
        users (nama)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedPeminjaman = peminjaman?.map(p => ({
      ...p,
      nama_barang: p.equipment?.nama_barang,
      user_name: p.users?.nama
    })) || [];

    res.json(formattedPeminjaman);
  } catch (error) {
    console.error('Get peminjaman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject peminjaman (Admin)
app.put('/api/admin/peminjaman/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, catatan_admin } = req.body;
    const { id } = req.params;

    // Get peminjaman details
    const { data: peminjaman, error: fetchError } = await supabase
      .from('peminjaman')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !peminjaman) {
      return res.status(404).json({ message: 'Peminjaman not found' });
    }

    // If approved, update equipment availability
    if (status === 'approved') {
      const { error: updateError } = await supabase
        .from('equipment')
        .update({
          jumlah_tersedia: peminjaman.jumlah_tersedia - peminjaman.jumlah_pinjam
        })
        .eq('id', peminjaman.equipment_id);

      if (updateError) throw updateError;
    }

    // Update peminjaman status
    const { error: updatePeminjamanError } = await supabase
      .from('peminjaman')
      .update({
        status,
        catatan_admin
      })
      .eq('id', id);

    if (updatePeminjamanError) throw updatePeminjamanError;

    res.json({ message: `Peminjaman ${status} successfully` });
  } catch (error) {
    console.error('Approve peminjaman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n========================================');
  console.log('✅ Server is running!');
  console.log('========================================');
  console.log(`📱 Local access: http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://${localIP}:${PORT}`);
  console.log(`📱 Mobile: Use the Network access URL above`);
  console.log('========================================\n');
});
