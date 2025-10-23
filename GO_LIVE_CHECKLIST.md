# 🚀 ParkWise - GO LIVE CHECKLIST

**Date:** October 24, 2025, 3:18 AM  
**Status:** READY TO DEPLOY  
**Estimated Time:** 15 minutes

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### 1. Environment Setup
- [ ] `.env` file created from `.env.example`
- [ ] Database credentials configured
- [ ] JWT secret generated (32+ characters)
- [ ] Redis password set
- [ ] SMTP credentials added (optional)
- [ ] Google Cloud API key added (optional)

### 2. Database Ready
- [ ] PostgreSQL installed and running
- [ ] Database `parkwise` created
- [ ] Schema loaded (`create_and_load.sql`)
- [ ] 10 parks loaded successfully
- [ ] Database accessible on port 5432

### 3. Docker Environment
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] Sufficient disk space (5GB+)
- [ ] Ports available: 80, 8080, 5432, 6379, 3000, 9090

---

## 🚀 DEPLOYMENT STEPS

### Option 1: Automated Deployment (Recommended)

**Windows:**
```powershell
# Run the deployment script
.\deploy.ps1
```

**Linux/Mac:**
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Option 2: Manual Deployment

#### Step 1: Configure Environment (2 min)
```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env  # or use your favorite editor

# Required variables:
# - DATABASE_URL
# - JWT_SECRET
# - REDIS_PASSWORD
```

#### Step 2: Setup Database (3 min)
```bash
# Create database
createdb parkwise

# Load schema and data
psql -d parkwise -f database/create_and_load.sql

# Verify
psql -d parkwise -c "SELECT COUNT(*) FROM parks;"
# Should return: 10
```

#### Step 3: Build & Start (5 min)
```bash
# Build Docker images
docker-compose -f docker-compose.prod.yml build

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps
```

#### Step 4: Health Checks (2 min)
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost:80/health

# Database connection
docker-compose exec postgres pg_isready -U postgres
```

#### Step 5: Create Admin User (1 min)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@parkwise.com",
    "username": "admin",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

#### Step 6: Test Application (2 min)
```bash
# Open in browser
start http://localhost  # Windows
open http://localhost   # Mac
xdg-open http://localhost  # Linux

# Test login
# Email: admin@parkwise.com
# Password: Admin123!
```

---

## 🧪 POST-DEPLOYMENT TESTING

### 1. Frontend Tests
- [ ] Homepage loads correctly
- [ ] Parks page shows 10 parks
- [ ] Species page displays species
- [ ] Campaigns page shows campaigns
- [ ] Login page accessible
- [ ] Register page accessible
- [ ] Navigation works
- [ ] Responsive on mobile

### 2. Authentication Tests
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] JWT token received
- [ ] Token stored in localStorage
- [ ] Can access protected routes
- [ ] Logout works
- [ ] Token refresh works

### 3. API Tests
```bash
# Test public endpoints
curl http://localhost:8080/api/parks
curl http://localhost:8080/api/species
curl http://localhost:8080/api/campaigns

# Test authentication
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@parkwise.com","password":"Admin123!"}' \
  | jq -r '.accessToken')

# Test protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/user/profile
```

### 4. Infrastructure Tests
- [ ] All containers running
- [ ] PostgreSQL accessible
- [ ] Redis accessible
- [ ] Prometheus collecting metrics
- [ ] Grafana accessible
- [ ] Logs visible

---

## 📊 MONITORING SETUP

### Access Monitoring Tools
```bash
# Grafana Dashboard
http://localhost:3000
# Default: admin / admin (change on first login)

# Prometheus Metrics
http://localhost:9090

# Application Logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Key Metrics to Watch
- **Response Time:** < 200ms (p95)
- **Error Rate:** < 0.1%
- **CPU Usage:** < 70%
- **Memory Usage:** < 80%
- **Database Connections:** < 15/20

---

## 🔒 SECURITY CHECKLIST

### Immediate (Before Going Live)
- [ ] Change default admin password
- [ ] Generate strong JWT secret
- [ ] Set secure Redis password
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Disable debug mode
- [ ] Remove test users

### Short Term (First Week)
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Set up backup automation
- [ ] Configure monitoring alerts
- [ ] Review security headers

---

## 🌐 DOMAIN CONFIGURATION

### 1. DNS Setup
```
# Add A records
parkwise.com        → Your-Server-IP
www.parkwise.com    → Your-Server-IP
api.parkwise.com    → Your-Server-IP
```

### 2. SSL/TLS Setup
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d parkwise.com -d www.parkwise.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 3. Nginx Configuration
Update `nginx.conf` with your domain:
```nginx
server_name parkwise.com www.parkwise.com;
```

---

## 📧 EMAIL CONFIGURATION

### SMTP Setup
Add to `.env`:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Test Email
```bash
# Send test email
curl -X POST http://localhost:8080/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test"}'
```

---

## 🤖 AI FEATURES SETUP

### Google Cloud Vision API
1. Create Google Cloud Project
2. Enable Vision API
3. Create API Key
4. Add to `.env`:
```bash
GOOGLE_CLOUD_API_KEY=your-api-key-here
```

### Test AI Identification
```bash
curl -X POST http://localhost:8080/api/species/identify \
  -F "image=@test-image.jpg"
```

---

## 📈 SCALING CHECKLIST

### When You Need to Scale
- [ ] Add load balancer
- [ ] Set up database replication
- [ ] Configure Redis cluster
- [ ] Enable CDN for static assets
- [ ] Implement auto-scaling
- [ ] Add more backend instances
- [ ] Set up database connection pooling

---

## 🆘 TROUBLESHOOTING

### Common Issues

**Backend won't start:**
```bash
# Check logs
docker-compose logs backend

# Common fixes:
# - Port 8080 already in use
# - Database connection failed
# - Missing environment variables
```

**Frontend not loading:**
```bash
# Check logs
docker-compose logs frontend

# Common fixes:
# - Port 80 already in use
# - Backend not accessible
# - CORS issues
```

**Database connection failed:**
```bash
# Check PostgreSQL
docker-compose exec postgres psql -U postgres -d parkwise

# Verify credentials in .env
# Check if database exists
```

**Authentication not working:**
```bash
# Check JWT secret is set
# Verify user exists in database
# Check token expiration
# Review CORS configuration
```

---

## 🎯 SUCCESS CRITERIA

### Application is Live When:
- ✅ Frontend accessible at http://localhost
- ✅ Backend API responding
- ✅ Database connected with data
- ✅ Authentication working
- ✅ All health checks passing
- ✅ Monitoring active
- ✅ Logs visible

### Ready for Users When:
- ✅ Domain configured
- ✅ SSL/TLS enabled
- ✅ Email working
- ✅ Backups configured
- ✅ Monitoring alerts set
- ✅ Documentation complete

---

## 🎉 LAUNCH ANNOUNCEMENT

### When Everything is Ready:
1. **Test thoroughly** - All features working
2. **Monitor closely** - Watch metrics for 24h
3. **Announce launch** - Social media, email
4. **Collect feedback** - User surveys
5. **Iterate quickly** - Fix issues fast

---

## 📞 SUPPORT

### If You Need Help:
- **Documentation:** See README.md and DEPLOYMENT_GUIDE.md
- **Logs:** `docker-compose logs -f`
- **Health:** `curl http://localhost:8080/actuator/health`
- **Status:** `docker-compose ps`

---

## ✅ FINAL CHECKLIST

Before announcing to users:
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] Security reviewed
- [ ] Backups working
- [ ] Monitoring active
- [ ] Documentation updated
- [ ] Support plan ready
- [ ] Rollback plan tested

---

**🚀 YOU'RE READY TO GO LIVE!**

Run the deployment script and watch your conservation platform come to life!

```powershell
.\deploy.ps1  # Windows
```

```bash
./deploy.sh   # Linux/Mac
```

**Good luck! 🌿🐯**

---

**Last Updated:** October 24, 2025, 3:18 AM  
**Status:** READY FOR PRODUCTION  
**Next Action:** RUN DEPLOYMENT SCRIPT
