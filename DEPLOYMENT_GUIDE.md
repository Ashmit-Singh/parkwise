# ParkWise Production Deployment Guide 🚀

## Prerequisites

### Required Software
- Docker 24+ and Docker Compose 2.20+
- Git
- PostgreSQL client (for database management)
- kubectl (for Kubernetes deployment)
- AWS CLI / GCP CLI / Azure CLI (depending on cloud provider)

### Required Accounts & Services
- Cloud provider account (AWS/GCP/Azure)
- Domain name and DNS management
- SSL certificate (Let's Encrypt recommended)
- Email service (SMTP)
- Google Cloud Platform (for Vision API)
- Blockchain RPC provider (Alchemy/Infura)
- S3-compatible storage
- Monitoring service (optional: Datadog, New Relic)

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/parkwise.git
cd parkwise
```

### 2. Configure Environment Variables
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your production values
nano .env
```

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/parkwise
DATABASE_USERNAME=parkwise_user
DATABASE_PASSWORD=<strong-password>

# Redis
REDIS_HOST=redis.your-domain.com
REDIS_PORT=6379
REDIS_PASSWORD=<strong-password>

# JWT
JWT_SECRET=<generate-strong-secret>

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=<app-password>

# AI Services
GOOGLE_CLOUD_API_KEY=<your-api-key>

# Blockchain
WEB3_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/<key>
WEB3_PRIVATE_KEY=<deployer-private-key>
CONTRACT_ADDRESS=<deployed-contract-address>

# AWS S3
AWS_ACCESS_KEY=<access-key>
AWS_SECRET_KEY=<secret-key>
S3_BUCKET_NAME=parkwise-uploads
AWS_REGION=us-east-1

# Monitoring
GRAFANA_USER=admin
GRAFANA_PASSWORD=<strong-password>
```

## Database Setup

### 1. Create Production Database
```bash
# Connect to PostgreSQL
psql -h your-db-host -U postgres

# Create database and user
CREATE DATABASE parkwise;
CREATE USER parkwise_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE parkwise TO parkwise_user;

# Enable PostGIS extension
\c parkwise
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 2. Run Migrations
```bash
# Run initial schema
psql -h your-db-host -U parkwise_user -d parkwise -f database/create_and_load.sql

# Run seed data (optional for production)
psql -h your-db-host -U parkwise_user -d parkwise -f database/seed_data.sql
```

### 3. Create Database Backups
```bash
# Setup automated backups
pg_dump -h your-db-host -U parkwise_user parkwise > backup_$(date +%Y%m%d).sql

# Add to crontab for daily backups
0 2 * * * pg_dump -h your-db-host -U parkwise_user parkwise | gzip > /backups/parkwise_$(date +\%Y\%m\%d).sql.gz
```

## Docker Deployment

### 1. Build Images
```bash
# Build backend
docker build -f Dockerfile.backend -t parkwise-backend:latest .

# Build frontend
docker build -f Dockerfile.frontend -t parkwise-frontend:latest .
```

### 2. Start Services
```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Verify Deployment
```bash
# Check backend health
curl http://localhost:8080/actuator/health

# Check frontend
curl http://localhost:80/health

# Check database connection
docker-compose exec backend sh -c 'wget -qO- http://localhost:8080/actuator/health | grep UP'
```

## Kubernetes Deployment

### 1. Create Kubernetes Manifests
```bash
# Create namespace
kubectl create namespace parkwise

# Create secrets
kubectl create secret generic parkwise-secrets \
  --from-env-file=.env \
  --namespace=parkwise

# Apply configurations
kubectl apply -f k8s/
```

### 2. Deploy Services
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: parkwise-backend
  namespace: parkwise
spec:
  replicas: 3
  selector:
    matchLabels:
      app: parkwise-backend
  template:
    metadata:
      labels:
        app: parkwise-backend
    spec:
      containers:
      - name: backend
        image: parkwise-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        envFrom:
        - secretRef:
            name: parkwise-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
```

### 3. Setup Ingress
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: parkwise-ingress
  namespace: parkwise
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - parkwise.com
    - www.parkwise.com
    secretName: parkwise-tls
  rules:
  - host: parkwise.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: parkwise-backend
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: parkwise-frontend
            port:
              number: 80
```

## SSL/TLS Setup

### Using Let's Encrypt
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f k8s/cert-issuer.yaml
```

## Monitoring Setup

### 1. Access Grafana
```bash
# Get Grafana password
echo $GRAFANA_PASSWORD

# Access dashboard
open http://localhost:3000
```

### 2. Import Dashboards
- Spring Boot Dashboard (ID: 4701)
- PostgreSQL Dashboard (ID: 9628)
- Redis Dashboard (ID: 11835)
- Node Exporter Dashboard (ID: 1860)

### 3. Setup Alerts
```yaml
# monitoring/alerts.yml
groups:
  - name: parkwise_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/sec"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is above 90%"

      - alert: DatabaseDown
        expr: up{job="postgres"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"
          description: "PostgreSQL is not responding"
```

## Security Checklist

### Pre-Deployment
- [ ] Change all default passwords
- [ ] Generate strong JWT secret
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Setup VPC/Security groups
- [ ] Enable database encryption at rest
- [ ] Configure backup encryption
- [ ] Setup secrets management (AWS Secrets Manager/Vault)
- [ ] Enable audit logging
- [ ] Configure rate limiting

### Post-Deployment
- [ ] Run security scan (OWASP ZAP)
- [ ] Perform penetration testing
- [ ] Setup WAF (Web Application Firewall)
- [ ] Enable DDoS protection
- [ ] Configure intrusion detection
- [ ] Setup security monitoring
- [ ] Create incident response plan
- [ ] Document security procedures

## Performance Optimization

### Database
```sql
-- Create indexes
CREATE INDEX idx_parks_state ON parks(state);
CREATE INDEX idx_species_conservation_status ON species(conservation_status);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_sightings_species_id ON sightings(species_id);
CREATE INDEX idx_sightings_location ON sightings USING GIST(location);

-- Analyze tables
ANALYZE parks;
ANALYZE species;
ANALYZE campaigns;
```

### Application
```properties
# application-prod.properties
# Connection pool tuning
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5

# JPA optimization
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Cache configuration
spring.cache.redis.time-to-live=3600000
```

## Scaling Strategy

### Horizontal Scaling
```bash
# Scale backend pods
kubectl scale deployment parkwise-backend --replicas=5 -n parkwise

# Setup autoscaling
kubectl autoscale deployment parkwise-backend \
  --cpu-percent=70 \
  --min=3 \
  --max=10 \
  -n parkwise
```

### Database Scaling
- Setup read replicas
- Implement connection pooling
- Add caching layer (Redis)
- Consider database sharding for large datasets

## Backup & Recovery

### Automated Backups
```bash
# Database backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/parkwise_$DATE.sql.gz"

pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE s3://parkwise-backups/

# Keep only last 30 days
find $BACKUP_DIR -name "parkwise_*.sql.gz" -mtime +30 -delete
```

### Recovery Procedure
```bash
# Restore from backup
gunzip < backup_file.sql.gz | psql -h $DB_HOST -U $DB_USER $DB_NAME

# Verify restoration
psql -h $DB_HOST -U $DB_USER $DB_NAME -c "SELECT COUNT(*) FROM parks;"
```

## Rollback Procedure

### Docker
```bash
# Rollback to previous version
docker-compose -f docker-compose.prod.yml down
docker tag parkwise-backend:previous parkwise-backend:latest
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes
```bash
# Rollback deployment
kubectl rollout undo deployment/parkwise-backend -n parkwise

# Check rollout status
kubectl rollout status deployment/parkwise-backend -n parkwise
```

## Troubleshooting

### Common Issues

#### Backend Not Starting
```bash
# Check logs
docker-compose logs backend

# Check database connection
docker-compose exec backend sh -c 'nc -zv postgres 5432'

# Verify environment variables
docker-compose exec backend env | grep DATABASE
```

#### High Memory Usage
```bash
# Check memory usage
docker stats

# Adjust JVM settings
JAVA_OPTS="-Xms512m -Xmx2g -XX:MaxMetaspaceSize=256m"
```

#### Slow Queries
```sql
-- Enable slow query log
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Maintenance

### Regular Tasks
- **Daily**: Check logs, monitor metrics, verify backups
- **Weekly**: Review security alerts, update dependencies
- **Monthly**: Performance review, capacity planning, security audit
- **Quarterly**: Disaster recovery drill, penetration testing

### Update Procedure
```bash
# 1. Backup database
./scripts/backup.sh

# 2. Pull latest code
git pull origin main

# 3. Build new images
docker-compose build

# 4. Run migrations
./scripts/migrate.sh

# 5. Deploy with zero downtime
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend

# 6. Verify deployment
./scripts/health-check.sh
```

## Support & Documentation

- **API Documentation**: https://parkwise.com/api/docs
- **Admin Dashboard**: https://parkwise.com/admin
- **Monitoring**: https://grafana.parkwise.com
- **Status Page**: https://status.parkwise.com

## Emergency Contacts

- **On-Call Engineer**: +1-XXX-XXX-XXXX
- **DevOps Team**: devops@parkwise.com
- **Security Team**: security@parkwise.com

---

**Last Updated:** October 24, 2025
**Version:** 1.0
**Maintained by:** ParkWise DevOps Team
