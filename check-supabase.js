// Check Supabase configuration
require('dotenv').config({ path: require('path').join(__dirname, 'backend/.env') });

console.log('Current Supabase Configuration:');
console.log('URL:', process.env.SUPABASE_URL);
console.log('Anon Key:', process.env.SUPABASE_ANON_KEY ? 'Loaded ✓' : 'NOT FOUND ✗');
console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded ✓' : 'NOT FOUND ✗');

console.log('\n⚠️  If you get "ENOTFOUND" error, the URL might be wrong.');
console.log('Please check your Supabase project URL at: https://supabase.com/dashboard');
console.log('The URL should be: https://[your-project-id].supabase.co');