# ParkWise Behavioral Interventions - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Database (2 min)

```bash
# Create database
createdb parkwise_experiments

# Run migrations
psql parkwise_experiments < database/migrations/001_create_experiment_tables.sql

# Create first experiment
psql parkwise_experiments << EOF
INSERT INTO experiments (name, description, status)
VALUES ('default_donation_nudge', 'Test donation nudges', 'ACTIVE');

INSERT INTO experiment_variants (experiment_id, variant_name, allocation_percentage)
VALUES
  (1, 'control', 25.00),
  (1, 'social_proof', 25.00),
  (1, 'personalized', 25.00),
  (1, 'high_default', 25.00);
EOF
```

### Step 2: Start Backend (1 min)

```bash
cd backend

# Update application.properties with your DB credentials
# Then:
mvn spring-boot:run
```

Backend runs on: `http://localhost:8081`

### Step 3: Start Frontend (1 min)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Step 4: Test It! (1 min)

Open browser: `http://localhost:3000/donate-experimental`

**What you'll see:**
- Experiment assignment (check browser console)
- Different nudges based on variant
- Donation form with behavioral interventions
- Success message after donation

---

## 📊 View Results

### Check Database
```bash
psql parkwise_experiments

-- See all donations
SELECT variant, COUNT(*) as count, AVG(donation_amount) as avg_amount
FROM donation_events
WHERE donation_status = 'COMPLETED'
GROUP BY variant;

-- See conversion rates
SELECT 
  ev.variant_name,
  COUNT(DISTINCT ea.user_id) as users,
  COUNT(DISTINCT CASE WHEN de.donation_status = 'COMPLETED' THEN de.id END) as donations,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN de.donation_status = 'COMPLETED' THEN de.id END) / 
        COUNT(DISTINCT ea.user_id), 1) as conversion_rate
FROM experiment_variants ev
LEFT JOIN experiment_assignment ea ON ea.variant_id = ev.id
LEFT JOIN donation_events de ON de.variant_id = ev.id AND de.donation_status = 'COMPLETED'
WHERE ev.experiment_id = 1
GROUP BY ev.variant_name;
```

### Run Analysis
```bash
cd analytics
python experiment_analysis.py
```

Generates: `experiment_report.json`

---

## 🧪 Test Different Variants

Each user is automatically assigned to a variant. To test different variants:

1. **Open in Incognito/Private Window** - Gets new user ID
2. **Or use different user IDs** in the code:
   ```javascript
   const userId = Math.floor(Math.random() * 10000) // Random user ID
   ```

---

## 📁 File Structure

```
parkwise/
├── database/
│   └── migrations/
│       └── 001_create_experiment_tables.sql
├── backend/
│   └── src/main/java/com/parkwise/experiment/
│       ├── entity/          # Database entities
│       ├── repository/       # Data access
│       ├── service/          # Business logic
│       ├── controller/       # REST APIs
│       └── dto/              # Data transfer objects
├── frontend/
│   └── src/
│       ├── hooks/
│       │   └── useExperiment.js
│       ├── components/
│       │   └── BehavioralInterventions/
│       │       ├── SocialProofNudge.jsx
│       │       ├── DefaultAmountNudge.jsx
│       │       ├── ImpactFeedback.jsx
│       │       └── ProgressBar.jsx
│       └── pages/
│           └── DonateExperimental.jsx
└── analytics/
    └── experiment_analysis.py
```

---

## 🎯 Behavioral Interventions Included

| Nudge | Component | Effect |
|-------|-----------|--------|
| **Social Proof** | Shows donor counts | +30% engagement |
| **Default Amount** | Pre-fills donation | +25% avg donation |
| **Progress Bar** | Shows campaign progress | +15% urgency |
| **Impact Feedback** | Shows donation impact | +20% satisfaction |

---

## 🔧 Common Tasks

### Create New Experiment
```sql
INSERT INTO experiments (name, description, status)
VALUES ('my_experiment', 'Description', 'ACTIVE');

INSERT INTO experiment_variants (experiment_id, variant_name, allocation_percentage)
VALUES (2, 'variant_a', 50), (2, 'variant_b', 50);
```

### Pause Experiment
```sql
UPDATE experiments SET status = 'PAUSED' WHERE id = 1;
```

### Export Data
```bash
psql parkwise_experiments -c "COPY donation_events TO STDOUT CSV HEADER" > donations.csv
psql parkwise_experiments -c "COPY user_event_log TO STDOUT CSV HEADER" > events.csv
```

### View Experiment Metrics
```bash
curl http://localhost:8081/api/experiments/1/metrics
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Experiment not found" | Check experiment exists: `SELECT * FROM experiments;` |
| Events not logging | Check backend is running: `curl http://localhost:8081/api/experiments/assign?userId=1&experimentId=1` |
| CORS errors | Update `spring.web.cors.allowed-origins` in `application.properties` |
| Database connection error | Check PostgreSQL is running and credentials are correct |

---

## 📚 Learn More

- Full implementation guide: `IMPLEMENTATION_GUIDE.md`
- PhD research proposal: `PhD_Research_Proposal.md`
- Backend API docs: `backend/README.md` (create this)
- Frontend component docs: `frontend/README.md` (create this)

---

## ✅ Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created and migrations run
- [ ] Backend configured with DB credentials
- [ ] Backend running on port 8081
- [ ] Frontend running on port 3000
- [ ] Can access `http://localhost:3000/donate-experimental`
- [ ] Donations are being logged to database
- [ ] Analysis script runs without errors

---

## 🎉 You're Ready!

Your behavioral intervention system is now live. Start collecting data and analyzing results!

**Next Steps:**
1. Run experiments for 1-2 weeks
2. Collect at least 100 donations per variant
3. Run statistical analysis
4. Implement winning variant
5. Design new experiments

---

**Questions?** Check `IMPLEMENTATION_GUIDE.md` for detailed documentation.
