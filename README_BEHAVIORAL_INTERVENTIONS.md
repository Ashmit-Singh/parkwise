# ParkWise: Behavioral Interventions for Conservation Funding

## 🌿 Project Overview

ParkWise is a digital platform designed to increase public financial contributions to biodiversity conservation in India through evidence-based behavioral interventions. This repository contains a complete implementation of an A/B testing framework integrated into the ParkWise donation system.

**Research Goal**: Experimentally evaluate which behavioral nudges (social proof, framing, defaults, gamification) most effectively increase donation frequency, amount, and sustained engagement for conservation causes.

---

## 🎯 Key Features

### ✅ Behavioral Interventions
- **Social Proof Nudge**: Display donor counts and peer activity
- **Default Amount Nudge**: Pre-fill donations based on user history or campaign goals
- **Progress Bar**: Show campaign progress towards funding goals
- **Impact Feedback**: Display real-time impact of donations

### ✅ A/B Testing Framework
- Automatic user assignment to variants
- Weighted random allocation based on traffic percentages
- Real-time experiment metrics
- Statistical significance testing

### ✅ Analytics Pipeline
- Event logging for all user interactions
- Donation tracking with status management
- Conversion rate calculation
- Repeat donation analysis
- Statistical tests (Chi-square, T-tests, Cohen's d)

### ✅ Production-Ready Architecture
- PostgreSQL database with proper indexing
- Spring Boot REST APIs
- React frontend with responsive design
- Python analytics with Jupyter integration

---

## 📦 What's Included

### Backend (Java/Spring Boot)
- 5 JPA entities for experiment management
- 5 repositories with custom queries
- 2 services (ExperimentService, AnalyticsService)
- 2 REST controllers with 7 endpoints
- 4 DTOs for data transfer

### Frontend (React)
- Custom `useExperiment` hook for experiment management
- 4 behavioral intervention components
- Full donation page with integrated nudges
- Responsive design with Tailwind CSS

### Database (PostgreSQL)
- 6 tables with proper relationships
- Optimized indexes for performance
- Support for JSONB metadata
- Audit trails with timestamps

### Analytics (Python)
- Comprehensive experiment analyzer
- Statistical significance testing
- Effect size calculations
- JSON report generation

### Documentation
- Quick start guide (5 minutes)
- Complete implementation guide (500+ lines)
- API reference
- Troubleshooting guide

---

## 🚀 Quick Start

### Prerequisites
- PostgreSQL 12+
- Java 17+
- Node.js 16+
- Python 3.8+

### 1. Database Setup (2 min)
```bash
createdb parkwise_experiments
psql parkwise_experiments < database/migrations/001_create_experiment_tables.sql
```

### 2. Create First Experiment (1 min)
```bash
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

### 3. Start Backend (1 min)
```bash
cd backend
# Update application.properties with your PostgreSQL credentials
mvn spring-boot:run
```

Backend: `http://localhost:8081`

### 4. Start Frontend (1 min)
```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

### 5. Test the System (1 min)
Open: `http://localhost:3000/donate-experimental`

You'll see:
- Experiment assignment (check browser console)
- Behavioral nudges based on your variant
- Donation form with interventions
- Success message after donation

### 6. Analyze Results
```bash
cd analytics
pip install -r requirements.txt
python experiment_analysis.py
```

Generates: `experiment_report.json`

---

## 📊 System Architecture

```
User Browser (React)
    ↓
    ├─ Fetch experiment assignment
    ├─ Render behavioral nudges
    ├─ Log user events
    └─ Submit donation
    ↓
Spring Boot Backend
    ├─ Assign user to variant
    ├─ Log events
    ├─ Calculate metrics
    └─ Return results
    ↓
PostgreSQL Database
    ├─ Store assignments
    ├─ Store events
    ├─ Store donations
    └─ Calculate aggregates
    ↓
Python Analytics
    ├─ Export data
    ├─ Run statistical tests
    ├─ Calculate effect sizes
    └─ Generate report
```

---

## 📁 Project Structure

```
parkwise/
├── database/
│   └── migrations/
│       └── 001_create_experiment_tables.sql
├── backend/
│   ├── src/main/java/com/parkwise/experiment/
│   │   ├── entity/          (5 files)
│   │   ├── repository/       (5 files)
│   │   ├── service/          (2 files)
│   │   ├── controller/       (2 files)
│   │   └── dto/              (4 files)
│   └── pom.xml
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
├── analytics/
│   ├── experiment_analysis.py
│   └── requirements.txt
├── QUICKSTART.md
├── IMPLEMENTATION_GUIDE.md
├── IMPLEMENTATION_SUMMARY.md
└── PhD_Research_Proposal.md
```

---

## 🔌 API Endpoints

### Experiment Management
```
GET /api/experiments/assign?userId=123&experimentId=1
GET /api/experiments/assignment?userId=123&experimentId=1
GET /api/experiments/1/metrics
```

### Analytics
```
POST /api/analytics/events
POST /api/analytics/donations
PUT /api/analytics/donations/{id}/complete
PUT /api/analytics/donations/{id}/fail
```

See `IMPLEMENTATION_GUIDE.md` for detailed examples.

---

## 📈 Expected Results

### Typical Effect Sizes (from literature)
| Intervention | Expected Lift |
|--------------|---------------|
| Social Proof | +20-30% |
| Default Amount | +15-25% |
| Progress Bar | +10-15% |
| Impact Feedback | +15-20% |

### Sample Output
```json
{
  "conversion_rates": {
    "control": 18.5,
    "social_proof": 24.3,
    "personalized": 28.7,
    "high_default": 22.1
  },
  "statistical_tests": {
    "chi_square": {
      "p_value": 0.0023,
      "significant": true
    }
  }
}
```

---

## 🧪 Running Experiments

### Create New Experiment
```sql
INSERT INTO experiments (name, description, status)
VALUES ('my_experiment', 'Description', 'ACTIVE');

INSERT INTO experiment_variants (experiment_id, variant_name, allocation_percentage)
VALUES (2, 'variant_a', 50), (2, 'variant_b', 50);
```

### Monitor Results
```bash
# View metrics
curl http://localhost:8081/api/experiments/1/metrics

# Export data
psql parkwise_experiments -c "COPY donation_events TO STDOUT CSV HEADER" > donations.csv

# Analyze
python analytics/experiment_analysis.py
```

### Pause Experiment
```sql
UPDATE experiments SET status = 'PAUSED' WHERE id = 1;
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICKSTART.md** | Get running in 5 minutes |
| **IMPLEMENTATION_GUIDE.md** | Complete setup and usage (500+ lines) |
| **IMPLEMENTATION_SUMMARY.md** | Overview of all components |
| **PhD_Research_Proposal.md** | Full research proposal and methodology |

---

## 🔒 Security & Ethics

### Data Privacy
- User IDs anonymized in reports
- Encrypted data transmission
- Secure database credentials
- GDPR-compliant data handling

### Ethical Considerations
- Transparent experiment disclosure
- User consent mechanisms
- Opt-out options
- No deceptive practices
- Regular ethical audits

See `IMPLEMENTATION_GUIDE.md` for detailed guidelines.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Experiment not found" | Verify experiment exists: `SELECT * FROM experiments;` |
| Events not logging | Check backend running: `curl http://localhost:8081/api/experiments/assign?userId=1&experimentId=1` |
| CORS errors | Update `spring.web.cors.allowed-origins` in `application.properties` |
| Database connection error | Check PostgreSQL running and credentials correct |

See `IMPLEMENTATION_GUIDE.md` for more troubleshooting.

---

## 📊 Metrics & KPIs

### Primary Metrics
- **Conversion Rate**: % of users who donate
- **Average Donation**: Mean donation amount
- **Total Raised**: Sum of all donations

### Secondary Metrics
- **Repeat Donation Rate**: % of donors who donate again
- **Engagement Time**: Session duration
- **Click-through Rate**: Interaction with nudges

### Statistical Metrics
- **P-value**: Statistical significance
- **Cohen's d**: Effect size
- **Confidence Interval**: Uncertainty bounds

---

## 🚀 Deployment

### Development
```bash
# Terminal 1: Backend
cd backend && mvn spring-boot:run

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Analytics (as needed)
cd analytics && python experiment_analysis.py
```

### Production
- Deploy backend to cloud (AWS, GCP, Azure)
- Deploy frontend to CDN (Netlify, Vercel)
- Use managed PostgreSQL (RDS, Cloud SQL)
- Set up monitoring and alerts
- Enable HTTPS and security headers

---

## 📖 Research Integration

This implementation supports the PhD research proposal:

**Research Aim**: To design, implement, and experimentally evaluate the effectiveness of behavioral interventions integrated into the ParkWise digital platform to demonstrably increase public financial contributions and engagement for biodiversity conservation in India.

**Key Contributions**:
- ✅ Rigorous experimental framework (RCTs)
- ✅ Multiple behavioral interventions
- ✅ Statistical analysis pipeline
- ✅ Ethical research guidelines
- ✅ Scalable architecture

---

## 🎓 Learning Resources

### Behavioral Science
- Thaler & Sunstein (2008) - Nudge Theory
- Kahneman & Tversky (1979) - Behavioral Economics
- Cialdini (2009) - Influence and Persuasion

### A/B Testing
- Kohavi, Tang & Xu (2020) - Trustworthy Online Controlled Experiments
- Optimizely Blog - A/B Testing Best Practices

### Technical
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Documentation: https://react.dev
- PostgreSQL Documentation: https://www.postgresql.org/docs/

---

## 🤝 Contributing

To contribute to this project:

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📝 License

This project is part of a PhD research initiative. Please contact the authors for licensing information.

---

## 👥 Team

- **PhD Researcher**: [Your Name]
- **Advisor**: [Advisor Name]
- **Institution**: [University Name]

---

## 📧 Contact & Support

For questions or issues:
1. Check `IMPLEMENTATION_GUIDE.md` for detailed documentation
2. Review `QUICKSTART.md` for common tasks
3. Check troubleshooting section above
4. Contact the research team

---

## 🎉 Getting Started

Ready to begin? Follow these steps:

1. **Read**: `QUICKSTART.md` (5 min read)
2. **Setup**: Follow the 5-minute quick start
3. **Test**: Run the experimental donation page
4. **Analyze**: Generate your first report
5. **Iterate**: Design new experiments

**Questions?** See `IMPLEMENTATION_GUIDE.md` for comprehensive documentation.

---

**Last Updated**: October 21, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready

---

## 📊 Quick Stats

- **Backend Files**: 18 Java classes
- **Frontend Files**: 5 React components
- **Database Tables**: 6 tables with indexes
- **API Endpoints**: 7 REST endpoints
- **Documentation**: 1500+ lines
- **Lines of Code**: 2000+ (excluding dependencies)
- **Setup Time**: ~15 minutes
- **Time to First Results**: ~1 hour

---

**Ready to revolutionize conservation funding through behavioral science? Let's go! 🚀**
