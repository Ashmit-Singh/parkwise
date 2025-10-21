# ⚡ QUICK START - Run ParkWise NOW (No Build Wait)

## 🚀 FASTEST WAY TO GET RUNNING

### Option 1: Start Frontend Only (2 minutes)

```bash
cd frontend
npm install
npm run dev
```

**Then open**: http://localhost:3000

This gives you the full UI immediately to explore!

---

### Option 2: Start Backend Only (Build in background)

```bash
cd backend
mvn spring-boot:run
```

**Backend will be ready at**: http://localhost:8081/api/experiments

---

### Option 3: Run Both (Parallel Terminals)

**Terminal 1 - Frontend**:
```bash
cd frontend
npm install
npm run dev
```

**Terminal 2 - Backend** (starts building):
```bash
cd backend
mvn spring-boot:run
```

---

## ⏱️ WHAT'S HAPPENING

### Frontend (2-3 minutes)
- npm install dependencies
- Vite dev server starts
- **Ready**: http://localhost:3000

### Backend (5-10 minutes first time)
- Maven downloads dependencies
- Compiles code
- Starts Spring Boot
- **Ready**: http://localhost:8081

---

## ✅ VERIFY IT'S WORKING

### Frontend Ready
- Open http://localhost:3000
- See ParkWise homepage
- No errors in browser console (F12)

### Backend Ready
- Open http://localhost:8081/api/experiments
- See JSON response (may be empty)
- Check terminal for "Started ParkWiseApplication"

---

## 📊 CURRENT STATUS

**Phase 1 & 2**: ✅ Complete (58+ files, 8000+ lines)
**Phase 3 Week 1**: 🚀 In Progress
- UnifiedUserService: ✅ Code ready
- UnifiedDashboard: ✅ Code ready
- Backend build: ⏳ In progress (Maven downloading)

---

## 🎯 WHILE BACKEND BUILDS

### Explore Frontend
1. Open http://localhost:3000
2. Navigate pages
3. Check components
4. Review code in `frontend/src/`

### Review Documentation
- `PHASE_3_STARTUP.md` - Today's plan
- `PHASE_3_EXECUTION_GUIDE.md` - Code examples
- `RUN_NOW.md` - Detailed guide

### Check Code
- Backend: `backend/src/main/java/com/parkwise/`
- Frontend: `frontend/src/`
- Tests: `backend/src/test/`

---

## 🔧 IF FRONTEND FAILS

**Error**: `Port 3000 in use`
```bash
# Kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Error**: `npm not found`
```bash
# Install Node.js from nodejs.org
# Then retry
```

**Error**: `Dependencies missing`
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🔧 IF BACKEND FAILS

**Error**: `Port 8081 in use`
```bash
# Kill process
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

**Error**: `Java not found`
```bash
# Install Java 17+ from oracle.com
# Then retry
```

**Error**: `Build timeout`
```bash
# Maven is downloading dependencies
# Wait 10-15 minutes first time
# Or run with: mvn spring-boot:run -o (offline)
```

---

## 📈 NEXT STEPS

### Once Frontend is Running
1. Explore the UI
2. Review components
3. Check console for errors
4. Plan Phase 3 tasks

### Once Backend is Running
1. Test API endpoints
2. Check database connection
3. Run tests
4. Start development

### Both Running
1. Full integration testing
2. Start Week 1 tasks
3. Create PRs
4. Code review

---

## 💡 TIPS

### Speed Up Frontend
```bash
# Use npm ci instead of install (faster)
npm ci
npm run dev
```

### Speed Up Backend First Time
```bash
# Pre-download dependencies
mvn dependency:resolve

# Then run
mvn spring-boot:run
```

### Check Progress
- **Frontend**: Watch terminal for "VITE ready"
- **Backend**: Watch terminal for "Started ParkWiseApplication"

---

## 🎉 YOU'RE READY!

**Start with frontend** - it's fastest!

```bash
cd frontend
npm install
npm run dev
```

**Then open**: http://localhost:3000

---

**Status**: ✅ READY TO RUN  
**Fastest Start**: Frontend only (2-3 min)  
**Full System**: Both services (10-15 min)  
**Time**: NOW! 🚀
