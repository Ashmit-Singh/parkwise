# ParkWise Behavioral Intervention Implementation Guide

## Overview

This guide provides step-by-step instructions to implement behavioral interventions and A/B testing capabilities into the ParkWise platform.

---

## 1. Database Setup

### 1.1 Prerequisites
- PostgreSQL 12+ installed
- Database user with CREATE TABLE permissions

### 1.2 Create Database
```bash
createdb parkwise_experiments
```

### 1.3 Run Migrations
```bash
psql parkwise_experiments < database/migrations/001_create_experiment_tables.sql
```

### 1.4 Verify Tables
```sql
\dt  -- List all tables
SELECT * FROM experiments;
SELECT * FROM experiment_variants;
SELECT * FROM experiment_assignment;
SELECT * FROM user_event_log;
SELECT * FROM donation_events;
```

---

## 2. Backend Setup (Spring Boot)

### 2.1 Update application.properties

Add PostgreSQL configuration:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/parkwise_experiments
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.com.parkwise.experiment=DEBUG
```

### 2.2 Update pom.xml

Add PostgreSQL dependency:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.6.0</version>
    <scope>runtime</scope>
</dependency>
```

### 2.3 Build and Run Backend
```bash
cd backend
mvn clean package
mvn spring-boot:run
```

### 2.4 Verify Backend APIs

Test experiment assignment:
```bash
curl "http://localhost:8081/api/experiments/assign?userId=123&experimentId=1"
```

Expected response:
```json
{
  "experimentId": 1,
  "experimentName": "default_donation_nudge",
  "variantId": 1,
  "variantName": "control",
  "description": "Control group - no nudges",
  "userId": 123
}
```

---

## 3. Frontend Setup (React)

### 3.1 Install Dependencies

The required packages are already in `package.json`:
```bash
cd frontend
npm install
```

### 3.2 Update API Base URL

In `src/hooks/useExperiment.js`, ensure the API URL matches your backend:
```javascript
const API_BASE_URL = 'http://localhost:8081/api'
```

### 3.3 Add Route to App.jsx

Update `src/App.jsx` to include the experimental donation page:
```jsx
import DonateExperimental from './pages/DonateExperimental'

// In Routes:
<Route path="/donate-experimental" element={<DonateExperimental />} />
```

### 3.4 Run Frontend
```bash
npm run dev
```

Access at: `http://localhost:3000/donate-experimental`

---

## 4. Creating Experiments

### 4.1 Create Experiment via SQL

```sql
-- Insert experiment
INSERT INTO experiments (name, description, status)
VALUES (
  'default_donation_nudge',
  'Test default donation amounts and social proof',
  'ACTIVE'
);

-- Get experiment ID
SELECT id FROM experiments WHERE name = 'default_donation_nudge';
-- Result: 1

-- Insert variants
INSERT INTO experiment_variants (experiment_id, variant_name, description, allocation_percentage)
VALUES
  (1, 'control', 'Control group - no nudges', 25.00),
  (1, 'social_proof', 'Shows donor counts and peer activity', 25.00),
  (1, 'personalized', 'Pre-fills with user average donation', 25.00),
  (1, 'high_default', 'Pre-fills with ₹1000 default', 25.00);
```

### 4.2 Create Experiment via API (Future Enhancement)

```bash
curl -X POST http://localhost:8081/api/experiments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "impact_feedback_test",
    "description": "Test impact messaging",
    "variants": [
      {"name": "control", "allocation": 50},
      {"name": "impact_feedback", "allocation": 50}
    ]
  }'
```

---

## 5. Testing the System

### 5.1 Manual Testing Flow

1. **Start Backend**
   ```bash
   cd backend && mvn spring-boot:run
   ```

2. **Start Frontend**
   ```bash
   cd frontend && npm run dev
   ```

3. **Open Browser**
   - Navigate to: `http://localhost:3000/donate-experimental`
   - Open Developer Console (F12)

4. **Test Donation Flow**
   - Page loads and fetches experiment assignment
   - Check console for "Event logged: donation_page_viewed"
   - Change donation amount (logs "donation_amount_changed")
   - Click "Donate" button
   - Observe success message
   - Check console for "Donation event logged"

### 5.2 Verify Data in Database

```sql
-- Check experiment assignments
SELECT * FROM experiment_assignment LIMIT 5;

-- Check user events
SELECT * FROM user_event_log ORDER BY created_at DESC LIMIT 10;

-- Check donation events
SELECT * FROM donation_events ORDER BY created_at DESC LIMIT 5;

-- View metrics by variant
SELECT 
  ev.variant_id,
  ev.variant_name,
  COUNT(DISTINCT ea.user_id) as total_users,
  COUNT(DISTINCT CASE WHEN de.donation_status = 'COMPLETED' THEN de.id END) as completed_donations,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN de.donation_status = 'COMPLETED' THEN de.id END) / 
        COUNT(DISTINCT ea.user_id), 2) as conversion_rate,
  ROUND(AVG(de.donation_amount), 2) as avg_donation
FROM experiment_variants ev
LEFT JOIN experiment_assignment ea ON ea.variant_id = ev.id
LEFT JOIN donation_events de ON de.variant_id = ev.id
GROUP BY ev.variant_id, ev.variant_name;
```

---

## 6. Data Analysis

### 6.1 Export Data

```bash
# Export donation events
psql parkwise_experiments -c "COPY donation_events TO STDOUT CSV HEADER" > donation_events.csv

# Export user events
psql parkwise_experiments -c "COPY user_event_log TO STDOUT CSV HEADER" > user_event_log.csv

# Export experiment assignments
psql parkwise_experiments -c "COPY experiment_assignment TO STDOUT CSV HEADER" > experiment_assignment.csv
```

### 6.2 Run Analysis Script

```bash
cd analytics
python experiment_analysis.py
```

This generates `experiment_report.json` with:
- Conversion rates by variant
- Donation amount statistics
- Repeat donation rates
- Statistical significance tests
- Effect sizes

### 6.3 Example Report Output

```json
{
  "timestamp": "2025-10-21T22:50:00",
  "summary": {
    "total_donations": 1247,
    "unique_users": 856,
    "variants": ["control", "social_proof", "personalized", "high_default"]
  },
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

## 7. Behavioral Interventions Implemented

### 7.1 Social Proof Nudge
**Component**: `SocialProofNudge.jsx`
- Shows donor counts
- Displays today's donation count
- Highlights top supporter
- **Effect**: Leverages social proof to encourage donations

### 7.2 Default Amount Nudge
**Component**: `DefaultAmountNudge.jsx`
- **Control**: No default (0)
- **Personalized**: 110% of user's average donation
- **High Default**: ₹1000
- **Low Default**: ₹250
- **Effect**: Tests choice architecture and default effects

### 7.3 Progress Bar
**Component**: `ProgressBar.jsx`
- Shows campaign progress towards goal
- Displays remaining amount needed
- Shows donor count
- **Effect**: Creates urgency and shows momentum

### 7.4 Impact Feedback
**Component**: `ImpactFeedback.jsx`
- Shows real-time impact of donation
- Customized by campaign type
- Scales with donation amount
- **Effect**: Increases perceived value and self-efficacy

---

## 8. API Endpoints Reference

### Experiment Management
```
GET  /api/experiments/assign?userId=123&experimentId=1
GET  /api/experiments/assignment?userId=123&experimentId=1
GET  /api/experiments/{experimentId}/metrics
```

### Analytics & Logging
```
POST /api/analytics/events
POST /api/analytics/donations
PUT  /api/analytics/donations/{donationEventId}/complete
PUT  /api/analytics/donations/{donationEventId}/fail
```

### Request/Response Examples

**Assign User to Experiment**
```bash
curl "http://localhost:8081/api/experiments/assign?userId=123&experimentId=1"

Response:
{
  "experimentId": 1,
  "experimentName": "default_donation_nudge",
  "variantId": 2,
  "variantName": "social_proof",
  "description": "Shows donor counts and peer activity",
  "userId": 123
}
```

**Log Event**
```bash
curl -X POST http://localhost:8081/api/analytics/events \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "experimentId": 1,
    "variantId": 2,
    "eventType": "donation_page_viewed",
    "eventValue": null,
    "metadata": {
      "timestamp": "2025-10-21T22:50:00",
      "userAgent": "Mozilla/5.0..."
    }
  }'
```

**Log Donation**
```bash
curl -X POST http://localhost:8081/api/analytics/donations \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "campaignId": 1,
    "experimentId": 1,
    "variantId": 2,
    "donationAmount": 500,
    "donationStatus": "PENDING"
  }'
```

---

## 9. Scaling & Performance Considerations

### 9.1 Database Optimization
- Indexes are created on frequently queried columns
- Consider partitioning `user_event_log` by date for large datasets
- Archive old experiments to separate tables

### 9.2 Caching
- Cache experiment definitions (rarely change)
- Cache variant allocations
- Use Redis for high-traffic scenarios

### 9.3 Async Processing
- Use message queues (Kafka/RabbitMQ) for event logging at scale
- Process analytics calculations asynchronously

### 9.4 Monitoring
- Monitor API response times
- Track database query performance
- Alert on anomalous conversion rates

---

## 10. Ethical Considerations & Compliance

### 10.1 User Consent
- Display clear notice that users are in an experiment
- Provide opt-out mechanism
- Respect user preferences

### 10.2 Data Privacy
- Anonymize user IDs in reports
- Encrypt sensitive data
- Comply with GDPR/local data protection laws

### 10.3 Transparency
- Document all interventions
- Share results with stakeholders
- Avoid deceptive practices

### 10.4 Fairness
- Ensure equitable access to platform features
- Monitor for biased outcomes
- Regular ethical audits

---

## 11. Troubleshooting

### Issue: "Experiment not found"
**Solution**: Ensure experiment exists in database
```sql
SELECT * FROM experiments WHERE id = 1;
```

### Issue: Events not logging
**Solution**: Check backend logs and verify API endpoint is accessible
```bash
curl -v http://localhost:8081/api/analytics/events
```

### Issue: Variant always "control"
**Solution**: Verify experiment has multiple variants with proper allocation percentages
```sql
SELECT * FROM experiment_variants WHERE experiment_id = 1;
```

### Issue: CORS errors
**Solution**: Update backend CORS configuration in `application.properties`
```properties
spring.web.cors.allowed-origins=http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
```

---

## 12. Next Steps

1. **Create More Experiments**: Design experiments for other behavioral interventions
2. **Integrate with Real Payments**: Connect to payment gateway
3. **Build Analytics Dashboard**: Create real-time visualization of results
4. **A/B Test Other Features**: Apply to campaigns, species pages, etc.
5. **Machine Learning**: Predict optimal nudge per user segment

---

## 13. Resources

- **Nudge Theory**: Thaler & Sunstein (2008)
- **A/B Testing**: Kohavi, Tang & Xu (2020)
- **Behavioral Economics**: Kahneman & Tversky (1979)
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React Docs**: https://react.dev

---

**Last Updated**: October 21, 2025  
**Version**: 1.0  
**Status**: Ready for Implementation
