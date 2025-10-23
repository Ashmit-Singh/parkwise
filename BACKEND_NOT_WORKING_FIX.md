# 🔧 Backend Not Working - Complete Fix

## 🚨 Current Problem

Backend is not responding. You're seeing:
- ❌ 404 errors
- ❌ CORS errors  
- ❌ Network errors
- ❌ "No parks found"

## ✅ Complete Solution (5 Steps)

### Step 1: Stop Any Running Backend

Press `Ctrl+C` in any terminal running the backend, or:

```bash
# Find Java process
tasklist | findstr java

# Kill it (replace PID with actual number)
taskkill /F /PID <PID>
```

### Step 2: Start Backend Properly

**Option A: Use the startup script**
```bash
# Double-click this file:
C:\Users\ashmi\parkwise\START_BACKEND_SIMPLE.bat
```

**Option B: Manual start**
```bash
cd C:\Users\ashmi\parkwise\backend
mvn spring-boot:run
```

### Step 3: Wait for Backend to Start

Watch for this message:
```
Started ParkwiseApplication in X.X seconds (JVM running for Y.Y)
```

This usually takes **30-60 seconds**.

### Step 4: Verify Backend is Running

Open browser and test:
```
http://localhost:8080/api/parks
```

**Expected**: JSON response (even if empty array `[]`)  
**If error**: Backend didn't start properly

### Step 5: Load Data (After Backend Starts)

Once backend is running, load parks data:

1. Open **pgAdmin**
2. Connect to `parkwise` database
3. **Query Tool** → Paste this:

```sql
INSERT INTO parks (name, state, description, area, established_year, latitude, longitude, created_at) VALUES
('Jim Corbett National Park', 'Uttarakhand', 'Famous for Bengal tigers', 520.82, 1936, 29.5317, 78.7750, NOW()),
('Ranthambore National Park', 'Rajasthan', 'Tiger sightings', 392.00, 1980, 26.0173, 76.5026, NOW()),
('Kaziranga National Park', 'Assam', 'One-horned rhinoceros', 429.96, 1974, 26.5775, 93.1711, NOW()),
('Kanha National Park', 'Madhya Pradesh', 'Jungle Book', 940.00, 1955, 22.3344, 80.6114, NOW()),
('Gir National Park', 'Gujarat', 'Asiatic lions', 1412.00, 1965, 21.1333, 70.7833, NOW());
```

4. Execute (F5)
5. Refresh browser: http://localhost:5173/parks

---

## 🔍 Troubleshooting

### Issue: "mvn: command not found"

**Fix**: Maven not in PATH. Use full path:
```bash
"C:\Program Files\Apache\maven\bin\mvn.cmd" spring-boot:run
```

Or install Maven and add to PATH.

### Issue: "Port 8080 already in use"

**Fix**: Kill the process using port 8080:
```bash
# Find process
netstat -ano | findstr :8080

# Kill it (replace PID)
taskkill /F /PID <PID>
```

### Issue: Database connection error

**Check**:
1. PostgreSQL service is running
2. Database `parkwise` exists
3. Username/password correct in `application.properties`

**Verify in pgAdmin**:
```sql
SELECT current_database();
-- Should return: parkwise
```

### Issue: Backend starts but 404 errors

**Check** `application.properties`:
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/parkwise
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### Issue: CORS errors

**Check** controllers have `@CrossOrigin`:
```java
@RestController
@RequestMapping("/api/parks")
@CrossOrigin(origins = "*")  // ← This line
public class ParkController {
```

---

## 📊 Verification Checklist

After starting backend:

- [ ] Terminal shows "Started ParkwiseApplication"
- [ ] No error messages in terminal
- [ ] http://localhost:8080/api/parks returns JSON
- [ ] Frontend stops showing errors
- [ ] Parks page loads (after data is loaded)

---

## 🎯 Expected Terminal Output

When backend starts successfully:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.x.x)

2025-10-24 01:40:00.000  INFO --- [main] c.p.ParkwiseApplication : Starting ParkwiseApplication
2025-10-24 01:40:05.000  INFO --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http)
2025-10-24 01:40:05.500  INFO --- [main] c.p.ParkwiseApplication : Started ParkwiseApplication in 5.5 seconds
```

---

## 🚀 Quick Start Commands

### Start Everything:

**Terminal 1 - Backend:**
```bash
cd C:\Users\ashmi\parkwise\backend
mvn spring-boot:run
```

**Terminal 2 - Frontend (already running):**
```bash
cd C:\Users\ashmi\parkwise\frontend
npm run dev
```

### Test Endpoints:

```bash
# Parks
http://localhost:8080/api/parks

# Campaigns  
http://localhost:8080/api/campaigns

# Species
http://localhost:8080/api/species
```

---

## 📝 Common Backend Issues

### 1. Database Not Created

```sql
-- In psql or pgAdmin
CREATE DATABASE parkwise;
```

### 2. Tables Not Created

```bash
# Backend will auto-create tables if configured
# Check application.properties:
spring.jpa.hibernate.ddl-auto=update
```

### 3. Wrong Database Credentials

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=postgres
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### 4. PostgreSQL Not Running

**Windows Services:**
1. Press Win+R
2. Type `services.msc`
3. Find "PostgreSQL"
4. Right-click → Start

---

## ✅ Success Indicators

You'll know it's working when:

1. **Terminal shows**: "Started ParkwiseApplication"
2. **Browser test works**: http://localhost:8080/api/parks returns `[]` or data
3. **No CORS errors** in browser console
4. **Frontend loads** without network errors
5. **Parks appear** after loading data

---

## 🎉 Final Steps

Once backend is running:

1. ✅ Load parks data (SQL in pgAdmin)
2. ✅ Refresh frontend
3. ✅ See parks displayed!

---

## 📞 Quick Reference

**Backend Port**: 8080  
**Frontend Port**: 5173  
**Database**: parkwise on localhost:5432

**Startup Script**: `START_BACKEND_SIMPLE.bat`  
**Test URL**: http://localhost:8080/api/parks

---

**Start the backend using the script and wait for "Started ParkwiseApplication"!** 🚀
