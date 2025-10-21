# ParkWise Behavioral Interventions - Deployment Checklist

## Pre-Deployment Verification

### Database Setup ✓
- [ ] PostgreSQL 12+ installed and running
- [ ] Database `parkwise_experiments` created
- [ ] Migration script executed successfully
- [ ] All 6 tables created with proper indexes
- [ ] Test query returns results: `SELECT COUNT(*) FROM experiments;`

### Backend Setup ✓
- [ ] Java 17+ installed
- [ ] Maven installed and working
- [ ] `application.properties` updated with PostgreSQL credentials
- [ ] PostgreSQL JDBC driver added to `pom.xml`
- [ ] Backend builds without errors: `mvn clean package`
- [ ] Backend starts successfully: `mvn spring-boot:run`
- [ ] Health check passes: `curl http://localhost:8081/actuator/health`

### Frontend Setup ✓
- [ ] Node.js 16+ installed
- [ ] npm dependencies installed: `npm install`
- [ ] API base URL configured in `useExperiment.js`
- [ ] Frontend builds without errors: `npm run build`
- [ ] Frontend starts successfully: `npm run dev`
- [ ] No console errors in browser

### Analytics Setup ✓
- [ ] Python 3.8+ installed
- [ ] Virtual environment created: `python -m venv venv`
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] Analysis script runs without errors: `python experiment_analysis.py`

---

## Integration Testing

### API Endpoints ✓
- [ ] Test experiment assignment:
  ```bash
  curl "http://localhost:8081/api/experiments/assign?userId=123&experimentId=1"
  ```
  Expected: 200 OK with variant info

- [ ] Test event logging:
  ```bash
  curl -X POST http://localhost:8081/api/analytics/events \
    -H "Content-Type: application/json" \
    -d '{"userId":123,"eventType":"test","experimentId":1}'
  ```
  Expected: 200 OK

- [ ] Test metrics endpoint:
  ```bash
  curl "http://localhost:8081/api/experiments/1/metrics"
  ```
  Expected: 200 OK with metrics data

### Frontend Integration ✓
- [ ] Page loads without errors: `http://localhost:3000/donate-experimental`
- [ ] Experiment assignment fetched (check console)
- [ ] Behavioral nudges render based on variant
- [ ] Donation form functional
- [ ] Event logging works (check network tab)
- [ ] Success message displays after donation

### Data Flow ✓
- [ ] User assigned to variant
- [ ] Events logged to database
- [ ] Donations recorded with correct variant
- [ ] Metrics calculate correctly
- [ ] Analysis script processes data without errors

---

## Performance Testing

### Load Testing ✓
- [ ] Backend handles 100 concurrent requests
- [ ] Database queries complete in < 500ms
- [ ] Frontend loads in < 3 seconds
- [ ] No memory leaks detected

### Database Performance ✓
- [ ] Indexes are being used (check EXPLAIN ANALYZE)
- [ ] Query plans are optimal
- [ ] No N+1 query problems
- [ ] Connection pool configured properly

### Frontend Performance ✓
- [ ] Page load time < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] No layout shifts
- [ ] Smooth animations

---

## Security Verification

### Authentication & Authorization ✓
- [ ] API endpoints secured (if applicable)
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Database credentials not in version control

### Data Protection ✓
- [ ] Database connection encrypted (if remote)
- [ ] HTTPS enabled (for production)
- [ ] User data anonymized in reports
- [ ] No PII in event logs

### Input Validation ✓
- [ ] All API inputs validated
- [ ] SQL injection prevented (using parameterized queries)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented (if applicable)

---

## Documentation Verification

### Code Documentation ✓
- [ ] All classes have JavaDoc comments
- [ ] All methods documented
- [ ] Complex logic explained
- [ ] API endpoints documented

### User Documentation ✓
- [ ] QUICKSTART.md is clear and complete
- [ ] IMPLEMENTATION_GUIDE.md covers all setup steps
- [ ] API reference is accurate
- [ ] Troubleshooting guide is helpful

### Research Documentation ✓
- [ ] PhD_Research_Proposal.md is complete
- [ ] Methodology clearly described
- [ ] Expected outcomes documented
- [ ] Ethical considerations addressed

---

## Staging Deployment

### Pre-Staging ✓
- [ ] All code committed to version control
- [ ] No uncommitted changes
- [ ] Tests passing locally
- [ ] Code review completed

### Staging Environment ✓
- [ ] Staging database created and migrated
- [ ] Backend deployed to staging server
- [ ] Frontend deployed to staging CDN
- [ ] Environment variables configured

### Staging Testing ✓
- [ ] All endpoints tested in staging
- [ ] Full user flow tested end-to-end
- [ ] Performance acceptable
- [ ] No errors in logs
- [ ] Data persists correctly

### Staging Monitoring ✓
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Performance monitoring active
- [ ] Database monitoring configured
- [ ] Alerts set up for critical issues

---

## Production Deployment

### Pre-Production ✓
- [ ] Production database created and migrated
- [ ] Database backups configured
- [ ] Disaster recovery plan documented
- [ ] Rollback procedure tested

### Production Infrastructure ✓
- [ ] Production servers provisioned
- [ ] Load balancer configured
- [ ] SSL certificates installed
- [ ] DNS records updated
- [ ] CDN configured for frontend

### Production Deployment ✓
- [ ] Backend deployed to production
- [ ] Frontend deployed to production CDN
- [ ] Environment variables configured
- [ ] Feature flags configured (if applicable)
- [ ] Deployment verified successful

### Post-Deployment Verification ✓
- [ ] All endpoints responding
- [ ] No errors in production logs
- [ ] Metrics being collected
- [ ] Monitoring dashboards working
- [ ] Alerts functioning

---

## Monitoring & Maintenance

### Real-Time Monitoring ✓
- [ ] Application performance monitoring (APM) active
- [ ] Error tracking enabled
- [ ] Log aggregation working
- [ ] Metrics collection running
- [ ] Alerts configured

### Daily Checks ✓
- [ ] Review error logs
- [ ] Check database size
- [ ] Verify backup completion
- [ ] Monitor API response times
- [ ] Check user engagement metrics

### Weekly Checks ✓
- [ ] Review experiment results
- [ ] Analyze conversion rates
- [ ] Check statistical significance
- [ ] Review user feedback
- [ ] Plan next experiments

### Monthly Checks ✓
- [ ] Full system health review
- [ ] Performance optimization review
- [ ] Security audit
- [ ] Capacity planning
- [ ] Research progress review

---

## Experiment Launch Checklist

### Before Launching Experiment ✓
- [ ] Experiment defined in database
- [ ] Variants configured with correct allocation
- [ ] Hypothesis clearly stated
- [ ] Success metrics defined
- [ ] Sample size calculated
- [ ] Duration planned

### During Experiment ✓
- [ ] Monitor daily metrics
- [ ] Check for data quality issues
- [ ] Verify random assignment
- [ ] Monitor for technical issues
- [ ] Track user feedback

### After Experiment ✓
- [ ] Export final data
- [ ] Run statistical analysis
- [ ] Calculate effect sizes
- [ ] Document results
- [ ] Share findings with team
- [ ] Plan next experiment

---

## Rollback Procedures

### If Backend Fails ✓
- [ ] Revert to previous version: `git checkout <previous-commit>`
- [ ] Rebuild: `mvn clean package`
- [ ] Restart service
- [ ] Verify endpoints responding
- [ ] Check logs for errors

### If Frontend Fails ✓
- [ ] Revert to previous build
- [ ] Clear CDN cache
- [ ] Verify new version deployed
- [ ] Check browser console for errors

### If Database Fails ✓
- [ ] Restore from backup
- [ ] Verify data integrity
- [ ] Run migrations if needed
- [ ] Restart backend services

---

## Post-Launch Optimization

### Performance Optimization ✓
- [ ] Analyze slow queries
- [ ] Add missing indexes
- [ ] Optimize N+1 queries
- [ ] Cache frequently accessed data
- [ ] Compress responses

### User Experience Optimization ✓
- [ ] Analyze user feedback
- [ ] Review conversion funnel
- [ ] Optimize form fields
- [ ] Improve error messages
- [ ] Enhance mobile experience

### Research Optimization ✓
- [ ] Analyze experiment results
- [ ] Identify winning variants
- [ ] Plan follow-up experiments
- [ ] Refine hypotheses
- [ ] Prepare publications

---

## Sign-Off

### Technical Lead ✓
- [ ] Name: ___________________
- [ ] Date: ___________________
- [ ] Signature: ___________________

### Research Lead ✓
- [ ] Name: ___________________
- [ ] Date: ___________________
- [ ] Signature: ___________________

### Project Manager ✓
- [ ] Name: ___________________
- [ ] Date: ___________________
- [ ] Signature: ___________________

---

## Notes & Issues

### Known Issues
- [ ] Issue 1: ___________________
  - Status: ___________________
  - Resolution: ___________________

- [ ] Issue 2: ___________________
  - Status: ___________________
  - Resolution: ___________________

### Recommendations
- [ ] Recommendation 1: ___________________
- [ ] Recommendation 2: ___________________
- [ ] Recommendation 3: ___________________

### Follow-up Tasks
- [ ] Task 1: ___________________
  - Owner: ___________________
  - Due Date: ___________________

- [ ] Task 2: ___________________
  - Owner: ___________________
  - Due Date: ___________________

---

## Contact Information

### Technical Support
- **Backend Lead**: ___________________
- **Frontend Lead**: ___________________
- **Database Admin**: ___________________
- **DevOps**: ___________________

### Research Support
- **PhD Researcher**: ___________________
- **Research Advisor**: ___________________
- **Ethics Committee**: ___________________

### Emergency Contacts
- **On-Call Engineer**: ___________________
- **Backup**: ___________________
- **Escalation**: ___________________

---

## Appendices

### A. Database Backup Procedure
```bash
# Full backup
pg_dump parkwise_experiments > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql parkwise_experiments < backup_20251021_225000.sql
```

### B. Log Locations
- Backend: `backend/logs/application.log`
- Frontend: Browser console (F12)
- Database: PostgreSQL logs
- Analytics: `analytics/experiment_analysis.log`

### C. Configuration Files
- Backend: `backend/src/main/resources/application.properties`
- Frontend: `frontend/src/hooks/useExperiment.js`
- Database: `database/migrations/001_create_experiment_tables.sql`

### D. Emergency Procedures
- **Service Down**: Restart backend, check database connection
- **Data Corruption**: Restore from backup, run migrations
- **Performance Issues**: Check slow queries, add indexes
- **Security Breach**: Rotate credentials, audit logs, notify team

---

**Deployment Date**: ___________________  
**Version Deployed**: ___________________  
**Status**: ☐ Ready ☐ In Progress ☐ Complete ☐ Rolled Back

---

**Last Updated**: October 21, 2025  
**Version**: 1.0
