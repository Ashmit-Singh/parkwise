# 🚀 RUN NOW - ParkWise Phase 3 Startup Guide

## ⚡ QUICK START (5 Minutes)

### Option 1: Automatic Startup (Recommended)

**Windows**:
```bash
START_ALL.bat
```

**Mac/Linux**:
```bash
chmod +x START_ALL.sh
./START_ALL.sh
```

This will:
- ✅ Create database
- ✅ Run migrations
- ✅ Build backend
- ✅ Install frontend dependencies
- ✅ Start all services

---

### Option 2: Manual Startup (Step by Step)

#### Step 1: Setup Database (1 minute)

```bash
# Create database
createdb parkwise_experiments

# Run migrations
psql parkwise_experiments < database/migrations/001_create_experiment_tables.sql
psql parkwise_experiments < database/migrations/002_create_species_identification_tables.sql
```

#### Step 2: Start Backend (2 minutes)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Expected Output**:
```
Started ParkWiseApplication in X seconds
```

**Backend Running**: http://localhost:8081

#### Step 3: Start Frontend (2 minutes)

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

**Expected Output**:
```
VITE v5.0.0 ready in XXX ms
```

**Frontend Running**: http://localhost:3000

---

## ✅ VERIFY EVERYTHING IS RUNNING

### Check Backend
```bash
curl http://localhost:8081/api/experiments
```

**Expected Response**: JSON array (may be empty)

### Check Frontend
Open browser: http://localhost:3000

**Expected**: ParkWise homepage loads

### Check Database
```bash
psql parkwise_experiments
\dt
```

**Expected**: 14 tables listed

---

## 🎯 WHAT TO DO NEXT

### 1. Test the System (5 minutes)

**Backend API Test**:
```bash
# Create experiment
curl -X POST http://localhost:8081/api/experiments \
  -H "Content-Type: application/json" \
  -d '{"name":"test_exp","description":"Test"}'

# Get experiments
curl http://localhost:8081/api/experiments
```

**Frontend Test**:
- Open http://localhost:3000
- Navigate to different pages
- Check console for errors (F12)

### 2. Run Tests (5 minutes)

**Backend Tests**:
```bash
cd backend
mvn test
```

**Frontend Tests**:
```bash
cd frontend
npm test
```

### 3. Start Development (Now!)

**Backend Development**:
```bash
cd backend
mvn spring-boot:run
```

**Frontend Development**:
```bash
cd frontend
npm run dev
```

---

## 📊 SYSTEM STATUS

### Services Running
- [ ] Backend (Port 8081)
- [ ] Frontend (Port 3000)
- [ ] Database (PostgreSQL)

### Database Tables
- [ ] experiments
- [ ] experiment_variants
- [ ] experiment_assignment
- [ ] user_event_log
- [ ] donation_events
- [ ] species
- [ ] species_submissions
- [ ] ai_predictions
- [ ] expert_reviews
- [ ] community_validations
- [ ] sightings_map
- [ ] citizen_scientist_stats

### API Endpoints
- [ ] GET /api/experiments
- [ ] POST /api/experiments/submit
- [ ] GET /api/species/sightings/map
- [ ] GET /api/species/leaderboard

---

## 🔧 TROUBLESHOOTING

### Backend Won't Start

**Error**: `Port 8081 already in use`
```bash
# Kill process on port 8081
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8081
kill -9 <PID>
```

**Error**: `Database connection failed`
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# If not running, start PostgreSQL
# Windows: Services > PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

**Error**: `Maven build failed`
```bash
# Clean and rebuild
cd backend
mvn clean install -U
```

### Frontend Won't Start

**Error**: `Port 3000 already in use`
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**Error**: `npm dependencies missing`
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**Error**: `Database already exists`
```bash
# Drop and recreate
dropdb parkwise_experiments
createdb parkwise_experiments
psql parkwise_experiments < database/migrations/001_create_experiment_tables.sql
```

**Error**: `Migration failed`
```bash
# Check database connection
psql parkwise_experiments

# Run migrations manually
psql parkwise_experiments < database/migrations/001_create_experiment_tables.sql
```

---

## 📈 MONITORING

### Backend Logs
```bash
# Watch backend logs
tail -f backend/logs/application.log
```

### Frontend Console
- Open http://localhost:3000
- Press F12 to open Developer Tools
- Check Console tab for errors

### Database Queries
```bash
# Connect to database
psql parkwise_experiments

# Check tables
\dt

# Check data
SELECT * FROM experiments;
SELECT * FROM users;
```

---

## 🎯 DEVELOPMENT WORKFLOW

### Making Changes

**Backend**:
1. Edit Java files in `backend/src/main/java/`
2. Backend auto-reloads on save
3. Check logs for errors

**Frontend**:
1. Edit React files in `frontend/src/`
2. Frontend auto-reloads on save
3. Check browser console for errors

### Running Tests

**Backend**:
```bash
cd backend
mvn test
```

**Frontend**:
```bash
cd frontend
npm test
```

### Creating Commits

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push origin integration
```

---

## 📞 GETTING HELP

### Documentation
- `QUICKSTART.md` - 5-minute setup
- `PHASE_3_STARTUP.md` - Today's plan
- `IMPLEMENTATION_GUIDE.md` - Technical details
- `PHASE_3_EXECUTION_GUIDE.md` - Code examples

### Common Commands

```bash
# Backend
mvn clean install      # Build
mvn test              # Run tests
mvn spring-boot:run   # Start

# Frontend
npm install           # Install dependencies
npm test              # Run tests
npm run dev           # Start dev server
npm run build         # Build for production

# Database
psql parkwise_experiments    # Connect
\dt                          # List tables
\q                           # Quit
```

### Slack Channels
- `#parkwise-phase3` - General discussion
- `#parkwise-backend` - Backend team
- `#parkwise-frontend` - Frontend team
- `#parkwise-devops` - DevOps team

---

## ✨ YOU'RE READY!

**Everything is set up and ready to run.**

### Next Steps
1. Run `START_ALL.bat` (Windows) or `./START_ALL.sh` (Mac/Linux)
2. Wait for all services to start
3. Open http://localhost:3000
4. Start developing!

---

## 🎉 LET'S GO!

**Status**: ✅ READY TO RUN  
**Time**: NOW!  
**Let's build Phase 3! 🚀**

---

**Last Updated**: October 21, 2025  
**Version**: 1.0
