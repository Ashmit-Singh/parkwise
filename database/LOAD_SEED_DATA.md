# 🌱 Load Seed Data - Instructions

## 📊 What's Included

This seed data will populate your ParkWise database with:
- **50 National Parks** across India
- **100+ Species** (mammals, birds, reptiles, amphibians, insects, fish)
- **30 Active Campaigns** with realistic funding goals
- Complete with descriptions, locations, conservation status

## 🚀 Quick Load (All Data)

### Option 1: Using psql Command Line
```bash
# Navigate to database folder
cd database

# Load all seed data (in order)
psql -U postgres -d parkwise -f seed_parks.sql
psql -U postgres -d parkwise -f seed_species.sql
psql -U postgres -d parkwise -f seed_campaigns.sql
```

### Option 2: Using pgAdmin
1. Open pgAdmin
2. Connect to your parkwise database
3. Tools → Query Tool
4. Open each file and execute:
   - `seed_parks.sql`
   - `seed_species.sql`
   - `seed_campaigns.sql`

### Option 3: Using DBeaver
1. Open DBeaver
2. Connect to parkwise database
3. SQL Editor → Open SQL Script
4. Execute each file in order

## 📝 Load Individual Files

### Load Parks Only
```bash
psql -U postgres -d parkwise -f seed_parks.sql
```
**Result**: 50 parks added

### Load Species Only
```bash
psql -U postgres -d parkwise -f seed_species.sql
```
**Result**: 100+ species added

### Load Campaigns Only
```bash
psql -U postgres -d parkwise -f seed_campaigns.sql
```
**Result**: 30 campaigns added

## ✅ Verify Data Loaded

### Check Parks
```sql
SELECT COUNT(*) FROM parks;
-- Expected: 50

SELECT name, location FROM parks LIMIT 5;
```

### Check Species
```sql
SELECT COUNT(*) FROM species;
-- Expected: 100+

SELECT common_name, conservation_status FROM species WHERE conservation_status = 'CRITICALLY_ENDANGERED';
```

### Check Campaigns
```sql
SELECT COUNT(*) FROM campaigns;
-- Expected: 30

SELECT name, goal_amount, current_amount FROM campaigns WHERE status = 'ACTIVE';
```

## 🗺️ Geographic Distribution

### Parks by Region
- **North India**: 5 parks (Jim Corbett, Ranthambore, Valley of Flowers, etc.)
- **Central India**: 5 parks (Kanha, Bandhavgarh, Pench, etc.)
- **South India**: 5 parks (Periyar, Bandipur, Nagarhole, etc.)
- **Western India**: 5 parks (Gir, Tadoba, Marine NP, etc.)
- **Eastern India**: 5 parks (Sundarbans, Simlipal, Bhitarkanika, etc.)
- **Northeast India**: 5 parks (Manas, Kaziranga, Keibul Lamjao, etc.)
- **Additional**: 20 more parks across India

### Species by Category
- **Mammals**: 60+ species (tigers, elephants, primates, deer, bears, etc.)
- **Birds**: 25+ species (cranes, bustards, raptors, endemic birds)
- **Reptiles**: 12+ species (snakes, crocodiles, turtles, lizards)
- **Amphibians**: 3 species (purple frog, gliding frog, bullfrog)
- **Insects**: 5 species (moths, butterflies)
- **Fish**: 3 species (mahseer, sharks, hilsa)

### Conservation Status Distribution
- **Critically Endangered**: 10+ species
- **Endangered**: 20+ species
- **Vulnerable**: 25+ species
- **Near Threatened**: 15+ species
- **Least Concern**: 30+ species

## 🎯 Campaign Details

All campaigns include:
- Realistic funding goals ($190K - $750K)
- Current funding progress (30-60% funded)
- Active status with start/end dates
- Linked to specific parks
- Detailed descriptions

## 🔄 Reset Data (Optional)

If you want to clear existing data before loading:

```sql
-- WARNING: This will delete all existing data!
TRUNCATE TABLE campaigns CASCADE;
TRUNCATE TABLE species CASCADE;
TRUNCATE TABLE parks CASCADE;
```

Then load the seed files again.

## 🧪 Test the Frontend

After loading seed data, test these features:

### 1. Parks Page
```
http://localhost:5173/parks
```
Should show 50 parks with locations

### 2. Species Portal
```
http://localhost:5173/species-portal
```
- Check species catalog (100+ species)
- View conservation status filters

### 3. Campaigns Page
```
http://localhost:5173/campaigns
```
Should show 30 active campaigns with progress bars

### 4. Geospatial Map
```
http://localhost:5173/geospatial
```
All 50 parks should appear on the map with markers

## 📊 Sample Queries

### Find Endangered Species
```sql
SELECT common_name, scientific_name, conservation_status 
FROM species 
WHERE conservation_status IN ('CRITICALLY_ENDANGERED', 'ENDANGERED')
ORDER BY conservation_status, common_name;
```

### Parks with Most Area
```sql
SELECT name, location, area_hectares 
FROM parks 
ORDER BY area_hectares DESC 
LIMIT 10;
```

### Campaigns by Funding Progress
```sql
SELECT name, 
       goal_amount, 
       current_amount,
       ROUND((current_amount::numeric / goal_amount * 100), 2) as progress_percent
FROM campaigns 
WHERE status = 'ACTIVE'
ORDER BY progress_percent DESC;
```

### Species by Category
```sql
SELECT category, COUNT(*) as count
FROM species
GROUP BY category
ORDER BY count DESC;
```

## 🎉 Success!

Your database is now fully populated with:
- ✅ 50 National Parks
- ✅ 100+ Species
- ✅ 30 Active Campaigns
- ✅ Realistic data for testing
- ✅ Complete geographic coverage
- ✅ All conservation statuses

The application is now **100% functional** for demonstration and testing!

## 🆘 Troubleshooting

### Error: relation "parks" does not exist
```bash
# Run database schema first
psql -U postgres -d parkwise -f schema.sql
# Then load seed data
```

### Error: duplicate key value
```bash
# Data already exists, either:
# 1. Skip loading that file
# 2. Or truncate tables first (see Reset Data section)
```

### Error: foreign key constraint
```bash
# Load files in correct order:
# 1. parks (no dependencies)
# 2. species (no dependencies)
# 3. campaigns (depends on parks)
```

## 📞 Need More Data?

You can easily add more:
- Copy the INSERT statements
- Modify the values
- Run the SQL

Or create your own seed files following the same format!

---

**Happy Testing!** 🚀🌍💚
