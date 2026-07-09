# Quick Deployment Steps

## Langkah 1: Push ke GitHub

```bash
cd c:/Users/aditi/Documents/Pekerjaan Selama PKL/Web Lab

# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit"

# Hubungkan ke GitHub (ganti dengan username Anda)
git remote add origin https://github.com/USERNAME_ANDA/laboratory-management-system.git
git branch -M main
git push -u origin main
```

## Langkah 2: Deploy ke Vercel

1. **Buka Vercel**: https://vercel.com/new
2. **Import Repository**: Pilih repository GitHub Anda
3. **Konfigurasi**:
   - Framework Preset: **Other**
   - Root Directory: **.**
   - Build Command: *(kosongkan)*
   - Output Directory: **.**
4. **Environment Variables** (Klik "Environment Variables"):
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=buat_string_acak_yang_panjang_dan_aman_disini
   SUPABASE_URL=https://cqdttgkhhvyaxbxkguwq.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZHR0Z2toaHZ5YXhieGtndXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDE2NTEsImV4cCI6MjA5OTExNzY1MX0.D2Qm5eEQeZ9YdbJxSGlcCuY0looaNeqLukEmIdrMCQM
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZHR0Z2toaHZ5YXhieGtndXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU0MTY1MSwiZXhwIjoyMDk5MTE3NjUxfQ.SNazc3x7Et-08ptyfbeLefTnThZi_CfFLMfbmpyTEDY
   ```
5. **Deploy**: Klik "Deploy"

## Langkah 3: Konfigurasi Supabase

1. Buka https://supabase.com/dashboard/project/cqdttgkhhvyaxbxkguwq
2. **Authentication** → **URL Configuration**
3. Tambahkan URL Vercel Anda:
   - Redirect URLs: `https://nama-project-anda.vercel.app/**`
   - Site URL: `https://nama-project-anda.vercel.app`

## Langkah 4: Test

Buka browser dan akses:
```
https://nama-project-anda.vercel.app
```

Login dengan:
- Email: `admin@nusaputra.ac.id`
- Password: `admin123`

## Catatan Penting

✅ **URL Vercel Anda akan berubah** sesuai nama project yang Anda buat
✅ **HTTPS otomatis** disediakan Vercel
✅ **Database sudah cloud** (Supabase), tidak perlu setup server database
✅ **Gratis** untuk penggunaan kecil (Vercel Hobby + Supabase Free Tier)

## Troubleshooting

### Error: "Function timeout"
- Vercel free tier punya limit 10 detik untuk serverless functions
- Jika terjadi, optimize query database atau upgrade ke Pro plan

### Error: "Module not found"
- Pastikan package.json sudah include semua dependencies
- Check Vercel build logs

### Error: "CORS"
- Pastikan CORS sudah diupdate dengan domain Vercel Anda
- Check backend/server-supabase.js line 37-42

## Next Steps

1. ✅ Deploy ke Vercel
2. ✅ Test semua fitur
3. ✅ Share URL dengan pengguna
4. ✅ Monitor usage di Vercel Dashboard
5. ✅ (Optional) Add custom domain

---

**Total waktu deploy: ~5 menit** ⏱️
**Biaya: $0/bulan** 💰