# 🚀 PARKWISE - QUICK START (Development Mode)

**Time:** 2 minutes to get running  
**Status:** Use this while we fix the production Docker build

---

## ✅ FASTEST WAY TO GET PARKWISE RUNNING

Since the Docker production build had an issue, let's use the development setup that we know works:

### **Step 1: Start Backend (1 minute)**

Open PowerShell in the backend directory:

```powershell
cd c:\Users\ashmi\parkwise\backend
mvn spring-boot:run
```

**Wait for:** "Started ParkwiseApplication"  
**Backend will be at:** http://localhost:8080

### **Step 2: Start Frontend (1 minute)**

Open **ANOTHER** PowerShell window:

```powershell
cd c:\Users\ashmi\parkwise\frontend
npm run dev
```

**Frontend will be at:** http://localhost:5173

---

## 🎯 ACCESS YOUR APPLICATION

Once both are running:

1. **Open:** http://localhost:5173
2. **Browse Parks:** No login needed
3. **View Species:** Citizen science portal
4. **Check Campaigns:** Conservation campaigns
5. **Login:** http://localhost:5173/login
6. **Register:** http://localhost:5173/register

---

## 👤 CREATE YOUR FIRST USER

### Option 1: Via UI (Recommended)
1. Go to http://localhost:5173/register
2. Fill in your details
3. Click "Create Account"
4. You're logged in!

### Option 2: Via API
```powershell
$body = @{
    email = "test@parkwise.com"
    username = "testuser"
    password = "Test123!"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

## ✅ WHAT'S WORKING

- ✅ **Backend API** - Spring Boot on port 8080
- ✅ **Frontend** - React + Vite on port 5173
- ✅ **Database** - PostgreSQL with 10 parks
- ✅ **Authentication** - JWT tokens enabled
- ✅ **All Pages** - Parks, Species, Campaigns, Login, Register

---

## 🧪 TEST YOUR APPLICATION

### 1. Browse Parks
```
http://localhost:5173/parks
```
Should show 10 Indian national parks

### 2. View Species
```
http://localhost:5173/species
```
Should show 6 species with beautiful cards

### 3. Check Campaigns
```
http://localhost:5173/campaigns
```
Should show 6 conservation campaigns

### 4. Test Authentication
1. Go to http://localhost:5173/register
2. Create an account
3. Login at http://localhost:5173/login
4. You should be redirected to homepage

---

## 📊 CHECK IF EVERYTHING IS RUNNING

### Backend Health Check
```powershell
Invoke-WebRequest -Uri http://localhost:8080/actuator/health
```

Should return: `{"status":"UP"}`

### Frontend Check
```powershell
Invoke-WebRequest -Uri http://localhost:5173
```

Should return HTML

### Database Check
```powershell
psql -U postgres -d parkwise -c "SELECT COUNT(*) FROM parks;"
```

Should return: 10

---

## 🛑 STOP THE APPLICATION

### Stop Backend
- Press `Ctrl+C` in the backend PowerShell window

### Stop Frontend
- Press `Ctrl+C` in the frontend PowerShell window

---

## 🔄 RESTART

Just run the same commands again:

```powershell
# Terminal 1: Backend
cd c:\Users\ashmi\parkwise\backend
mvn spring-boot:run

# Terminal 2: Frontend  
cd c:\Users\ashmi\parkwise\frontend
npm run dev
```

---

## 🐛 TROUBLESHOOTING

### Backend Won't Start
```powershell
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Kill process if needed
taskkill /F /PID <PID>

# Check database connection
psql -U postgres -d parkwise -c "SELECT 1;"
```

### Frontend Won't Start
```powershell
# Check if port 5173 is in use
netstat -ano | findstr :5173

# Kill process if needed
taskkill /F /PID <PID>

# Reinstall dependencies if needed
cd frontend
rm -r node_modules
npm install
```

### Can't Connect to Backend
- Make sure backend is running on port 8080
- Check `frontend/vite.config.js` proxy settings
- Verify CORS is enabled in SecurityConfig

---

## 🎉 YOU'RE LIVE!

Once both terminals show they're running:

1. ✅ Open http://localhost:5173
2. ✅ Browse the beautiful parks page
3. ✅ Check out species tracking
4. ✅ View conservation campaigns
5. ✅ Register a new account
6. ✅ Login and test authentication

**Your ParkWise platform is running! 🌿🐯**

---

## 📝 NOTES

- This is **development mode** - perfect for testing
- Hot reload enabled - changes reflect immediately
- Backend on port 8080, Frontend on port 5173
- For production Docker deployment, we'll fix the build issue

---

## 🚀 NEXT STEPS

### Today:
- Test all features
- Create some users
- Browse parks and species
- Test authentication flow

### This Week:
- Fix Docker production build
- Deploy to cloud
- Configure domain
- Set up SSL

---

**START NOW:**

```powershell
# Terminal 1
cd c:\Users\ashmi\parkwise\backend
mvn spring-boot:run

# Terminal 2 (new window)
cd c:\Users\ashmi\parkwise\frontend
npm run dev

# Then open: http://localhost:5173
```

**LET'S GO! 🎉**
