# Mobile Access Guide - Laboratory Management System

## Server Information

Your server is now running with the following configuration:

### Server Details
- **Backend**: Supabase (Cloud Database)
- **Port**: 3000
- **Status**: ✅ Running
- **Local IP**: 192.168.1.87

### Access URLs
- **PC/Laptop**: http://localhost:3000
- **Mobile (Same Network)**: http://192.168.1.87:3000
- **Other Devices**: Use your PC's IP address shown above

## How to Access from Mobile

### Step 1: Ensure Same Network
Make sure your mobile device is connected to the **same WiFi network** as your PC.

### Step 2: Open Browser on Mobile
Open any browser (Chrome, Safari, etc.) and go to:
```
http://192.168.1.87:3000
```

Or scan this QR code if your browser supports it:
```
[Server will show QR code in console]
```

### Step 3: Login
Use the admin credentials:
- **Email**: admin@nusaputra.ac.id
- **Password**: admin123

## What Was Fixed

### Problem
- ❌ Server error "Failed to fetch" on mobile
- ❌ Only worked on PC (localhost)
- ❌ Intermittent database connection errors

### Solution
1. ✅ **Switched to Supabase backend** - More stable than MySQL
2. ✅ **Made server accessible on local network** - Binds to 0.0.0.0
3. ✅ **Updated all API URLs to relative paths** - Works on any device
4. ✅ **Added CORS configuration** - Allows cross-origin requests
5. ✅ **Enhanced error handling** - Better error messages
6. ✅ **Auto-reconnect mechanism** - Handles connection drops

## Server Architecture

```
┌─────────────────────────────────────────┐
│         Your PC (localhost)             │
│  ┌───────────────────────────────────┐  │
│  │  Node.js Server (Port 3000)       │  │
│  │  - Express.js                     │  │
│  │  - Supabase Client                │  │
│  │  - JWT Authentication             │  │
│  └───────────────────────────────────┘  │
│           ↕ (Local Network)             │
│  ┌───────────────────────────────────┐  │
│  │  Mobile Device                     │  │
│  │  - Browser                         │  │
│  │  - http://192.168.1.87:3000       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           ↕ (Internet)
┌─────────────────────────────────────────┐
│      Supabase Cloud Database             │
│  - PostgreSQL                            │
│  - Authentication                        │
│  - Real-time subscriptions               │
└─────────────────────────────────────────┘
```

## Important Notes

### 1. Server Must Be Running
The server must be running on your PC for mobile access to work:
```bash
npm run start:supabase
```

### 2. Same Network Required
Mobile devices must be on the **same WiFi network** as your PC.

### 3. Firewall Settings
If mobile can't connect, check Windows Firewall:
- Allow Node.js through firewall
- Or temporarily disable firewall for testing

### 4. IP Address May Change
Your local IP (192.168.1.87) may change if:
- You restart your router
- You connect to a different network
- Your PC gets a new DHCP lease

**To find your current IP:**
```bash
# Windows
ipconfig

# Look for "IPv4 Address" under your active network adapter
```

## Testing the Connection

### Test from PC
```bash
# Open browser
http://localhost:3000
```

### Test from Mobile
1. Connect to same WiFi
2. Open browser
3. Go to: http://192.168.1.87:3000
4. You should see the homepage

### Test API Connection
Open browser console (F12) and run:
```javascript
fetch('/api/laboratories')
  .then(r => r.json())
  .then(console.log)
```

## Troubleshooting

### Mobile Shows "Failed to fetch"
1. **Check if server is running**: Look at terminal, should show "Server is running!"
2. **Check network**: Both devices on same WiFi?
3. **Check IP address**: Run `ipconfig` on PC
4. **Check firewall**: Allow Node.js through Windows Firewall
5. **Try different browser**: Some browsers block mixed content

### Can't Access from Mobile
1. **Verify IP address**: 
   ```bash
   ipconfig
   ```
   Make sure you're using the correct IP

2. **Test connection from PC**:
   ```bash
   curl http://192.168.1.87:3000
   ```

3. **Check if port is listening**:
   ```bash
   netstat -ano | findstr :3000
   ```

### Server Won't Start
1. **Check if port 3000 is in use**:
   ```bash
   netstat -ano | findstr :3000
   ```

2. **Kill existing process**:
   ```bash
   taskkill /F /PID <process_id>
   ```

3. **Or change port in .env**:
   ```env
   PORT=3001
   ```

## Features Available on Mobile

All features work on mobile:
- ✅ View homepage and schedules
- ✅ Login/Register
- ✅ View laboratories
- ✅ Book laboratories (Dosen)
- ✅ Request equipment borrowing
- ✅ View schedules
- ✅ Admin dashboard (full features)

## Performance Tips

1. **Use WiFi, not mobile data** - Faster and more stable
2. **Close other apps** - Free up memory
3. **Use modern browser** - Chrome, Safari, Edge recommended
4. **Clear cache if needed** - If pages don't load properly

## Security Notes

⚠️ **Development Mode Only**
- CORS is set to allow all origins (`*`)
- Not suitable for production deployment
- For production, restrict CORS to specific domains

## Next Steps

1. ✅ Start server: `npm run start:supabase`
2. ✅ Access from PC: http://localhost:3000
3. ✅ Access from mobile: http://192.168.1.87:3000
4. ✅ Test login with: admin@nusaputra.ac.id / admin123
5. ✅ Explore all features!

## Support

If you still have issues:
1. Check server console for errors
2. Check browser console (F12) on mobile
3. Verify both devices on same network
4. Try restarting the server
5. Check Windows Firewall settings

---

**Your Laboratory Management System is now fully accessible on mobile!** 📱