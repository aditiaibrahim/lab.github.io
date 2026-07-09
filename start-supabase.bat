@echo off
echo ========================================
echo Starting Laboratory Management System
echo Using Supabase Database
echo ========================================
echo.
echo Make sure you have:
echo 1. Created Supabase project
echo 2. Run the SQL schema in Supabase
echo 3. Configured backend/.env with Supabase credentials
echo.
echo If you haven't done these steps, please:
echo 1. Read QUICK_START.md
echo 2. Follow the setup instructions
echo.
pause
echo.
echo Starting server...
npm run start:supabase
pause