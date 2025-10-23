# 🔧 Fix Backend & Load Parks - COMPLETE GUIDE

## ✅ Step 1: Load Parks Data (EASIEST METHOD)

### Using pgAdmin (Recommended - 1 minute):

1. **Open pgAdmin** from Start Menu

2. **Connect to PostgreSQL**:
   - Expand "Servers"
   - Expand "PostgreSQL 16" (or your version)
   - Expand "Databases"
   - Find "parkwise" database

3. **Open Query Tool**:
   - Right-click on "parkwise" database
   - Select "Query Tool"

4. **Copy and Paste This**:
```sql
INSERT INTO parks (name, state, description, area, established_year, latitude, longitude, created_at) VALUES
('Jim Corbett National Park', 'Uttarakhand', 'India''s oldest national park, famous for Bengal tigers', 520.82, 1936, 29.5317, 78.7750, NOW()),
('Ranthambore National Park', 'Rajasthan', 'Known for tiger sightings and ancient fort ruins', 392.00, 1980, 26.0173, 76.5026, NOW()),
('Kaziranga National Park', 'Assam', 'UNESCO Site, home to one-horned rhinoceros', 429.96, 1974, 26.5775, 93.1711, NOW()),
('Kanha National Park', 'Madhya Pradesh', 'Inspiration for The Jungle Book', 940.00, 1955, 22.3344, 80.6114, NOW()),
('Gir National Park', 'Gujarat', 'Only habitat of Asiatic lions', 1412.00, 1965, 21.1333, 70.7833, NOW()),
('Periyar National Park', 'Kerala', 'Elephant and tiger reserve', 777.00, 1982, 9.4647, 77.2350, NOW()),
('Sundarbans National Park', 'West Bengal', 'Largest mangrove forest', 1330.10, 1984, 21.9497, 88.9019, NOW()),
('Bandipur National Park', 'Karnataka', 'Nilgiri Biosphere Reserve', 874.20, 1974, 11.6667, 76.5833, NOW()),
('Hemis National Park', 'Ladakh', 'Largest park, snow leopards', 4410.00, 1981, 34.0000, 77.6667, NOW()),
('Tadoba National Park', 'Maharashtra', 'Excellent tiger sightings', 625.00, 1955, 20.2333, 79.3333, NOW());
```

5. **Click Execute** (▶️ button or press F5)

6. **You should see**: `INSERT 0 10` ✅

7. **Verify**:
```sql
SELECT COUNT(*) FROM parks;
SELECT name, state FROM parks;
```

---

## ✅ Step 2: Restart Backend (If Needed)

### Check if Backend is Running:
Open browser: http://localhost:8080/api/parks

**If you see JSON data** → Backend is working! ✅  
**If connection fails** → Restart backend:

```bash
cd C:\Users\ashmi\parkwise\backend
mvn spring-boot:run
```

Wait for: `Started ParkwiseApplication in X.X seconds`

---

## ✅ Step 3: Test Frontend

1. **Refresh Browser**: http://localhost:5173/parks

2. **You should see**: 10 parks displayed with:
   - Park names
   - State/location
   - Descriptions
   - Beautiful card layouts

3. **No more "No parks found"!** 🎉

---

## 🔍 Troubleshooting

### Issue: "Column 'location' does not exist"
**Fix**: Use the SQL above (it uses 'state' column which is correct)

### Issue: Backend not responding
**Check**:
```bash
# Test backend API
curl http://localhost:8080/api/parks

# Or open in browser
http://localhost:8080/api/parks
```

**Should return**: JSON array with parks

### Issue: Frontend shows error
**Check browser console** (F12):
- Look for network errors
- Check API URL is correct: `http://localhost:8080/api`

### Issue: Database connection error
**Verify**:
1. PostgreSQL service is running
2. Database "parkwise" exists
3. Table "parks" exists

```sql
-- In pgAdmin
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'parks';
```

---

## 📊 Load All 50 Parks (Optional)

If you want all 50 parks instead of just 10:

1. Open pgAdmin Query Tool
2. Click **Open File** (📁 icon)
3. Navigate to: `C:\Users\ashmi\parkwise\database\seed_parks.sql`
4. Click **Execute**
5. Should see: `INSERT 0 50`

---

## 🎯 Quick Verification Commands

### In pgAdmin Query Tool:

```sql
-- Count parks
SELECT COUNT(*) FROM parks;

-- View all parks
SELECT name, state, established_year FROM parks ORDER BY name;

-- Check specific park
SELECT * FROM parks WHERE name LIKE '%Corbett%';

-- Get parks by state
SELECT name FROM parks WHERE state = 'Rajasthan';
```

---

## ✅ Success Checklist

- [ ] pgAdmin is open
- [ ] Connected to parkwise database
- [ ] Executed INSERT statement
- [ ] Saw "INSERT 0 10" message
- [ ] Backend is running (port 8080)
- [ ] Frontend is running (port 5173)
- [ ] Refreshed browser
- [ ] Parks are visible!

---

## 🎉 Expected Result

After following these steps:

**Parks Page** (http://localhost:5173/parks):
```
National Parks
Explore India's incredible network of protected areas

[Card: Jim Corbett National Park]
Uttarakhand
India's oldest national park, famous for Bengal tigers
Established: 1936 | Area: 520.82 sq km

[Card: Ranthambore National Park]
Rajasthan
Known for tiger sightings and ancient fort ruins
Established: 1980 | Area: 392.00 sq km

... (8 more parks)
```

**API Response** (http://localhost:8080/api/parks):
```json
[
  {
    "id": 1,
    "name": "Jim Corbett National Park",
    "state": "Uttarakhand",
    "description": "India's oldest national park...",
    "area": 520.82,
    "establishedYear": 1936,
    "latitude": 29.5317,
    "longitude": 78.7750
  },
  ...
]
```

---

## 🆘 Still Not Working?

1. **Check Backend Logs**:
   - Look at terminal where backend is running
   - Check for errors

2. **Check Frontend Console**:
   - Press F12 in browser
   - Look at Console tab
   - Check Network tab for failed requests

3. **Verify Database**:
   ```sql
   -- Check if table exists
   \dt parks
   
   -- Check table structure
   \d parks
   ```

4. **Test API Directly**:
   ```bash
   curl http://localhost:8080/api/parks
   ```

---

## 📞 Quick Reference

**Files Created**:
- `quick_test_parks.sql` - 10 parks for quick testing
- `seed_parks.sql` - All 50 parks (fixed column names)

**Ports**:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432

**Database**:
- Name: parkwise
- Table: parks
- Columns: id, name, state, description, area, established_year, latitude, longitude, created_at

---

**Use the SQL above in pgAdmin - it's the fastest way!** 🚀
