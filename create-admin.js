// Script to create admin user in Supabase
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, 'backend/.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    // Hash password for admin123
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Password hashed:', hashedPassword);
    
    // Insert admin user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nama: 'Administrator',
          email: 'admin@nusaputra.ac.id',
          password: hashedPassword,
          role: 'admin',
          status: 'approved'
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating admin:', error);
      if (error.code === '23505') {
        console.log('\n⚠️  Admin user already exists!');
        console.log('If you forgot the password, delete the user from Supabase dashboard first.');
      }
      return;
    }
    
    console.log('\n✅ Admin user created successfully!');
    console.log('Email: admin@nusaputra.ac.id');
    console.log('Password: admin123');
    console.log('\nYou can now login with these credentials.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();