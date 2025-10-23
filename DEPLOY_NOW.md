# 🚀 DEPLOY PARKWISE - STEP BY STEP

**Current Time:** October 24, 2025, 3:21 AM  
**Status:** Ready to Deploy  
**Estimated Time:** 10 minutes

---

## ⚠️ PREREQUISITES

Before deploying, ensure you have:

### 1. Docker Desktop (REQUIRED)
- **Status:** Not running
- **Action:** Start Docker Desktop
- **Download:** https://www.docker.com/products/docker-desktop/

**Start Docker Desktop now, then continue below.**

### 2. PostgreSQL (REQUIRED)
- **Status:** Check if running
- **Action:** Start PostgreSQL service
- **Command:** 
```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# Start if not running
Start-Service postgresql-x64-16
```

### 3. Environment Variables (REQUIRED)
- **File:** `.env`
- **Action:** Create from template
```powershell
# Copy template
Copy-Item .env.example .env

# Edit with your values
notepad .env
```

---

## 🚀 DEPLOYMENT OPTIONS

### **Option 1: Quick Deploy (Recommended)**

Once Docker Desktop is running:

```powershell
# Run the automated deployment script
.\deploy.ps1
```

This will:
1. Check prerequisites
2. Build Docker images
3. Start all services
4. Run health checks
5. Create admin user
6. Display access URLs

---

### **Option 2: Manual Deploy (Step by Step)**

#### Step 1: Start Docker Desktop
1. Open Docker Desktop application
2. Wait for it to fully start (whale icon in system tray)
3. Verify: `docker ps` should work

#### Step 2: Verify PostgreSQL
```powershell
# Check PostgreSQL is running
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-16

# Test connection
psql -U postgres -d parkwise -c "SELECT COUNT(*) FROM parks;"
```

#### Step 3: Configure Environment
```powershell
# Create .env file
Copy-Item .env.example .env

# Edit with your values (minimum required):
# - DATABASE_URL=postgresql://postgres:postgres@localhost:5432/parkwise
# - JWT_SECRET=your-secret-key-here-min-32-chars
# - REDIS_PASSWORD=your-redis-password
```

#### Step 4: Build Docker Images
```powershell
# Build all images
docker-compose -f docker-compose.prod.yml build

# This will take 3-5 minutes
```

#### Step 5: Start Services
```powershell
# Start all containers
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

#### Step 6: Wait for Services
```powershell
# Wait 15 seconds for services to start
Start-Sleep -Seconds 15
```

#### Step 7: Health Checks
```powershell
# Check backend
Invoke-WebRequest -Uri http://localhost:8080/actuator/health

# Check frontend
Invoke-WebRequest -Uri http://localhost:80/health

# Check database
docker-compose -f docker-compose.prod.yml exec postgres pg_isready
```

#### Step 8: Create Admin User
```powershell
$body = @{
    email = "admin@parkwise.com"
    username = "admin"
    password = "Admin123!"
    firstName = "Admin"
    lastName = "User"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

#### Step 9: Open Application
```powershell
# Open in browser
start http://localhost
```

---

## 🧪 TESTING YOUR DEPLOYMENT

### 1. Frontend Tests
```powershell
# Open these URLs in your browser:
start http://localhost              # Homepage
start http://localhost/parks        # Parks page
start http://localhost/species      # Species page
start http://localhost/campaigns    # Campaigns page
start http://localhost/login        # Login page
start http://localhost/register     # Register page
```

### 2. Backend API Tests
```powershell
# Test public endpoints
Invoke-WebRequest -Uri http://localhost:8080/api/parks
Invoke-WebRequest -Uri http://localhost:8080/api/species
Invoke-WebRequest -Uri http://localhost:8080/api/campaigns

# Test authentication
$loginBody = @{
    email = "admin@parkwise.com"
    password = "Admin123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$token = ($response.Content | ConvertFrom-Json).accessToken
Write-Host "Token: $token"
```

### 3. Check All Services
```powershell
# View running containers
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

---

## 📊 ACCESS YOUR APPLICATION

Once deployed, access these URLs:

### Main Application
- **Frontend:** http://localhost
- **Login:** http://localhost/login
- **Register:** http://localhost/register

### API & Docs
- **Backend API:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/actuator/health
- **API Docs:** http://localhost:8080/swagger-ui.html

### Monitoring
- **Grafana:** http://localhost:3000 (admin/admin)
- **Prometheus:** http://localhost:9090

### Test Credentials
- **Email:** admin@parkwise.com
- **Password:** Admin123!

---

## 🔍 TROUBLESHOOTING

### Docker Desktop Not Starting
```powershell
# Restart Docker Desktop
# 1. Close Docker Desktop
# 2. Open Task Manager (Ctrl+Shift+Esc)
# 3. End any Docker processes
# 4. Start Docker Desktop again
```

### Port Already in Use
```powershell
# Check what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID)
taskkill /F /PID <PID>

# Or change port in docker-compose.prod.yml
```

### PostgreSQL Not Running
```powershell
# Check service
Get-Service postgresql*

# Start service
Start-Service postgresql-x64-16

# Or start manually from pgAdmin
```

### Backend Won't Start
```powershell
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Common issues:
# - Database connection failed (check DATABASE_URL)
# - Port 8080 in use (check netstat)
# - Missing environment variables (check .env)
```

### Frontend Not Loading
```powershell
# Check logs
docker-compose -f docker-compose.prod.yml logs frontend

# Check if backend is accessible
Invoke-WebRequest -Uri http://localhost:8080/actuator/health

# Restart frontend
docker-compose -f docker-compose.prod.yml restart frontend
```

---

## 🛑 STOP DEPLOYMENT

If you need to stop everything:

```powershell
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.prod.yml down -v

# Stop specific service
docker-compose -f docker-compose.prod.yml stop backend
```

---

## 🔄 RESTART DEPLOYMENT

If something goes wrong:

```powershell
# Stop everything
docker-compose -f docker-compose.prod.yml down

# Rebuild images
docker-compose -f docker-compose.prod.yml build

# Start again
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## ✅ DEPLOYMENT CHECKLIST

Before considering deployment successful:

- [ ] Docker Desktop running
- [ ] PostgreSQL running
- [ ] .env file configured
- [ ] All containers started
- [ ] Backend health check passing
- [ ] Frontend accessible
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Parks page shows 10 parks
- [ ] Species page loads
- [ ] Campaigns page loads
- [ ] Monitoring accessible

---

## 🎯 QUICK COMMANDS

```powershell
# Deploy everything
.\deploy.ps1

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart service
docker-compose -f docker-compose.prod.yml restart backend

# Stop everything
docker-compose -f docker-compose.prod.yml down

# Open application
start http://localhost
```

---

## 📞 NEED HELP?

### Check Logs
```powershell
# All logs
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs postgres

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Check Container Status
```powershell
# List all containers
docker ps -a

# Inspect specific container
docker inspect parkwise-backend

# Execute command in container
docker-compose -f docker-compose.prod.yml exec backend bash
```

---

## 🎉 SUCCESS!

When you see this, you're live:

```
✓ Backend is healthy
✓ Frontend is healthy
✓ Database is healthy
✓ Test user created

🎉 DEPLOYMENT SUCCESSFUL!

Your ParkWise application is now live!

📍 Access Points:
  Frontend:    http://localhost
  Backend API: http://localhost/api
  Login Page:  http://localhost/login
  Grafana:     http://localhost:3000

👤 Test Credentials:
  Email:    admin@parkwise.com
  Password: Admin123!
```

---

## 🚀 READY TO DEPLOY?

### **Step 1:** Start Docker Desktop
### **Step 2:** Run deployment script
```powershell
.\deploy.ps1
```
### **Step 3:** Open http://localhost

**Let's go! 🌿🐯**

---

**Last Updated:** October 24, 2025, 3:21 AM  
**Status:** READY TO DEPLOY  
**Next Action:** START DOCKER DESKTOP, THEN RUN `.\deploy.ps1`
