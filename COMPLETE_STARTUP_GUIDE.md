# 🚀 ParkWise Complete Startup Guide

## ⚡ Quick Start (3 Steps)

### Step 1: Start Backend (1 minute)

**Double-click**: `START_BACKEND_SIMPLE.bat`

Or manually:
```bash
cd C:\Users\ashmi\parkwise\backend
mvn spring-boot:run
```

**Wait for**: "Started ParkwiseApplication in X.X seconds"

**Test**: http://localhost:8080/api/parks (should return `[]` or JSON)

---

### Step 2: Load Sample Data (30 seconds)

**Open pgAdmin** → Connect to `parkwise` → **Query Tool**

**Paste & Execute**:
```sql
INSERT INTO parks (name, state, description, area, established_year, latitude, longitude, created_at) VALUES
('Jim Corbett NP', 'Uttarakhand', 'Oldest park, Bengal tigers', 520.82, 1936, 29.5317, 78.7750, NOW()),
('Ranthambore NP', 'Rajasthan', 'Tiger sightings', 392.00, 1980, 26.0173, 76.5026, NOW()),
('Kaziranga NP', 'Assam', 'One-horned rhinos', 429.96, 1974, 26.5775, 93.1711, NOW()),
('Kanha NP', 'Madhya Pradesh', 'Jungle Book', 940.00, 1955, 22.3344, 80.6114, NOW()),
('Gir NP', 'Gujarat', 'Asiatic lions', 1412.00, 1965, 21.1333, 70.7833, NOW());
```

---

### Step 3: View in Browser

**Frontend** (already running): http://localhost:5173/parks

**You should see 5 parks!** 🎉

---

## ✅ Verification

### Backend Running:
```
✅ Terminal shows: "Started ParkwiseApplication"
✅ http://localhost:8080/api/parks returns JSON
✅ No errors in terminal
```

### Data Loaded:
```sql
-- In pgAdmin
SELECT COUNT(*) FROM parks;
-- Should return: 5 (or more)
```

### Frontend Working:
```
✅ http://localhost:5173/parks shows park cards
✅ No "No parks found" message
✅ No 404 errors in browser console
```

---

## 🎯 Current Status

- **Frontend**: ✅ Running on port 5173
- **Backend**: ❌ Needs to be started properly
- **Database**: ✅ PostgreSQL ready
- **Data**: ❌ Needs to be loaded

---

## 📊 What You'll Get

After completing all steps:

### Parks Page
- 5+ national parks displayed
- Park names, states, descriptions
- Established years and areas
- Beautiful card layouts

### Other Features (with more data)
- Species catalog
- Campaigns with progress
- Interactive maps
- And more!

---

## 🆘 If Something Goes Wrong

### Backend won't start
1. Check PostgreSQL is running
2. Check port 8080 is free
3. Verify Maven is installed
4. Check database credentials

### Data won't load
1. Verify backend is running first
2. Check database name is "parkwise"
3. Ensure table "parks" exists
4. Use correct column names (state, not location)

### Frontend shows errors
1. Ensure backend is running on port 8080
2. Check browser console for specific errors
3. Verify API URL in .env file
4. Refresh browser after backend starts

---

## 🎉 Success!

Once everything is running:
- ✅ Backend serves API on port 8080
- ✅ Frontend displays on port 5173
- ✅ Database has park data
- ✅ All features work!

**Start with Step 1: Run `START_BACKEND_SIMPLE.bat`** 🚀
