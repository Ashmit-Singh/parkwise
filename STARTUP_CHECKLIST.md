# ✅ ParkWise Startup Checklist

## 🚀 Quick Start (5 Minutes)

### Step 1: Verify Prerequisites ✅
```bash
# Check Node.js (v18+ required)
node --version

# Check npm (v9+ required)
npm --version

# Expected output:
# v20.x.x or v18.x.x
# 9.x.x or 10.x.x
```

### Step 2: Start Backend ✅
```bash
# Option 1: Use startup script
START_ALL.bat

# Option 2: Manual start
cd backend
mvn spring-boot:run

# Verify backend is running
curl http://localhost:8080/api/health
```

### Step 3: Install Frontend Dependencies ✅
```bash
cd frontend
npm install

# This should complete without errors
# If errors occur, see TROUBLESHOOTING.md
```

### Step 4: Configure Environment ✅
```bash
# Check .env file exists
ls frontend/.env

# If not, it should already be created with:
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
VITE_BLOCKCHAIN_NETWORK=polygon
```

### Step 5: Start Frontend ✅
```bash
# Option 1: Use startup script
START_FRONTEND.bat

# Option 2: Manual start
cd frontend
npm run dev

# Frontend will be available at:
# http://localhost:5173
```

---

## 🎯 Verification Steps

### 1. Backend Health Check
```bash
# Test backend API
curl http://localhost:8080/api/health

# Expected: 200 OK response
```

### 2. Frontend Access
```bash
# Open browser
http://localhost:5173

# Expected: ParkWise home page loads
```

### 3. API Connection Test
```bash
# In browser console (F12):
fetch('http://localhost:8080/api/health')
  .then(r => r.json())
  .then(console.log)

# Expected: Success response
```

### 4. Feature Tests

#### Test Login
- Navigate to `/login`
- Try logging in with test credentials
- Check browser console for errors

#### Test AI Insights (requires login)
- Navigate to `/ai-insights`
- Should show donor scoring dashboard
- Check for API calls in Network tab

#### Test Geospatial
- Navigate to `/geospatial`
- Map should load with OpenStreetMap tiles
- Click "Use My Location" button

#### Test Species Portal
- Navigate to `/species-portal`
- Try uploading an image
- Check form validation

#### Test Blockchain
- Navigate to `/blockchain`
- Install MetaMask if not installed
- Try connecting wallet

---

## 🔍 What to Check If Something Fails

### Frontend Won't Start
```bash
# Check port availability
netstat -ano | findstr :5173

# Check for errors in terminal
# Common issues:
# - Missing dependencies
# - Port conflict
# - Syntax errors
```

### Backend Connection Failed
```bash
# Verify backend is running
curl http://localhost:8080/api/health

# Check CORS configuration
# Check firewall settings
# Verify .env VITE_API_URL
```

### Map Not Loading
```bash
# Check internet connection (for tiles)
# Check browser console for errors
# Verify Leaflet CSS is imported
```

### MetaMask Issues
```bash
# Install MetaMask extension
# Refresh page after installation
# Check browser console
```

---

## 📊 Expected Console Output

### Backend Startup
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.5.0)

Started ParkwiseApplication in 8.8 seconds
```

### Frontend Startup
```
VITE v5.0.0  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

---

## 🎨 Features to Test

### Public Features (No Login)
- [x] Home page
- [x] Geospatial explorer
- [x] Species portal
- [x] Blockchain hub
- [x] Parks listing
- [x] Campaigns

### User Features (Login Required)
- [x] AI insights
- [x] Donate
- [x] Privacy center
- [x] Notifications

### Researcher Features
- [x] Experiments dashboard
- [x] Research tools
- [x] Researcher dashboard

### Admin Features
- [x] Admin panel
- [x] Admin dashboard
- [x] User management

---

## 🛠️ Development Workflow

### 1. Start Development
```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Optional - AI Service
cd ai-service
uvicorn main:app --reload
```

### 2. Make Changes
```bash
# Edit files in src/
# Vite will hot-reload automatically
# Check browser for updates
```

### 3. Test Changes
```bash
# Check browser console
# Test API calls in Network tab
# Verify functionality
```

### 4. Build for Production
```bash
cd frontend
npm run build

# Output in dist/
# Test with: npm run preview
```

---

## 📱 Mobile Testing

### Test on Mobile Device
```bash
# Get your local IP
ipconfig  # Windows

# Start with host flag
cd frontend
npm run dev -- --host

# Access from mobile
http://YOUR_IP:5173
```

---

## 🔄 Daily Startup Routine

### Quick Start (Everything)
```bash
# Use the all-in-one script
START_ALL.bat

# This starts:
# 1. Backend (Spring Boot)
# 2. Frontend (Vite)
# 3. Opens browser automatically
```

### Manual Start (Step by Step)
```bash
# 1. Start backend
cd backend
mvn spring-boot:run

# 2. Wait for backend to start (8-10 seconds)

# 3. Start frontend
cd frontend
npm run dev

# 4. Open browser
http://localhost:5173
```

---

## ✅ Success Indicators

### Backend Running ✅
- Console shows "Started ParkwiseApplication"
- Port 8080 is listening
- Health endpoint responds

### Frontend Running ✅
- Console shows "VITE ready"
- Port 5173 is listening
- Browser shows ParkWise home page

### Full Integration ✅
- Login works
- API calls succeed
- Maps load
- Charts display
- No console errors

---

## 🎉 You're Ready!

If all checks pass:
- ✅ Backend is running
- ✅ Frontend is running
- ✅ API connection works
- ✅ Features are accessible

**Start exploring ParkWise!** 🚀

---

## 📞 Need Help?

If something isn't working:
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review error messages
3. Check browser console
4. Verify backend logs
5. Clear cache and restart

**Most common fix**: Clean install
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

**Happy Coding!** 💚🌍
