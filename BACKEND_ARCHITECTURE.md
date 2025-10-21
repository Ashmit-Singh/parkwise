# ParkWise Backend Architecture Blueprint

## Overview
Enterprise-grade Spring Boot 3.5.0 backend with blockchain integration, behavioral experiments, geospatial features, and AI insights.

## Module Architecture

### 1. Blockchain Module
**Purpose**: Immutable donation tracking and fund distribution

#### Components:
- **Smart Contracts** (Solidity)
  - `DonationEscrow.sol` - Handles donation locking and release
  - `ImpactOracle.sol` - Verifies conservation impact metrics
  - `ReputationToken.sol` - Gamification rewards

- **Java Integration Layer**
  - `BlockchainService.java` - Web3j integration
  - `SmartContractService.java` - Contract interaction
  - `TransactionMonitorService.java` - Event listening

- **Entities**
  - `BlockchainTransaction` - TX logs with hash, timestamp, status
  - `DonorRecord` - Wallet address, total donated, reputation score
  - `BeneficiaryRecord` - NGO wallet, funds received, verification status

- **APIs**
  ```
  POST   /api/blockchain/donate
  GET    /api/blockchain/transactions/{userId}
  GET    /api/blockchain/verify/{txHash}
  POST   /api/blockchain/release-funds
  GET    /api/blockchain/impact/{projectId}
  ```

### 2. Experiment Module (Behavioral Science)
**Purpose**: A/B testing for donation optimization

#### Components:
- **Entities**
  - `Experiment` - Test configuration, variants, status
  - `ExperimentVariant` - A/B/C test variations
  - `ExperimentAssignment` - User → Variant mapping
  - `UserEventLog` - Click, view, conversion tracking
  - `DonationEvent` - Conversion tracking with metadata

- **Services**
  - `ExperimentService` - Assignment algorithm (Thompson Sampling)
  - `BanditService` - Multi-armed bandit optimization
  - `AnalyticsService` - Statistical analysis, p-values
  - `PrivacyService` - GDPR-compliant anonymization

- **APIs**
  ```
  POST   /api/experiments/create
  GET    /api/experiments/{id}/assign
  POST   /api/experiments/log-event
  GET    /api/experiments/{id}/metrics
  GET    /api/experiments/{id}/export
  POST   /api/experiments/{id}/conclude
  ```

### 3. Geospatial Module
**Purpose**: Location verification and geo-tagged conservation

#### Components:
- **Entities**
  - `GeoProject` - Conservation site with polygon boundaries
  - `GeofenceAlert` - Intrusion/activity notifications
  - `LocationVerification` - Photo metadata validation

- **Services**
  - `GeofenceService` - Point-in-polygon detection
  - `GoogleMapsService` - Geocoding, distance calculations
  - `LocationValidator` - EXIF data verification

- **APIs**
  ```
  POST   /api/geo/projects/create
  GET    /api/geo/projects/nearby?lat={}&lng={}
  POST   /api/geo/verify-location
  GET    /api/geo/geofence-status
  GET    /api/geo/heatmap-data
  ```

### 4. AI Insights Module
**Purpose**: Predictive analytics and ML integration

#### Components:
- **Services**
  - `PredictionService` - Donation likelihood scoring
  - `RecommendationEngine` - Personalized project matching
  - `ChurnPredictionService` - User retention analysis
  - `MLModelConnector` - Python ML service integration

- **APIs**
  ```
  GET    /api/ai/donor-score/{userId}
  GET    /api/ai/recommend-projects/{userId}
  GET    /api/ai/engagement-forecast
  POST   /api/ai/retrain-model
  ```

### 5. Security & Identity Layer

#### Features:
- **Dual Authentication**
  - Traditional: JWT with refresh tokens
  - Web3: Wallet signature verification (MetaMask)

- **Roles & Permissions**
  - `DONOR` - Make donations, view impact
  - `RESEARCHER` - Create experiments, view analytics
  - `ADMIN` - Full system access
  - `NGO` - Submit projects, withdraw funds

- **Security Config**
  - CORS configuration
  - Rate limiting
  - SQL injection prevention
  - XSS protection

## Database Schema

### Core Tables
```sql
-- Blockchain
blockchain_transactions (id, tx_hash, from_address, to_address, amount, status, timestamp)
donor_records (id, wallet_address, total_donated, reputation_score, verification_status)
beneficiary_records (id, ngo_name, wallet_address, total_received, verified)

-- Experiments
experiments (id, name, description, status, start_date, end_date)
experiment_variants (id, experiment_id, name, config_json, weight)
experiment_assignments (id, user_id, experiment_id, variant_id, assigned_at)
user_event_logs (id, user_id, experiment_id, event_type, timestamp, metadata)
donation_events (id, user_id, variant_id, amount, timestamp)

-- Geospatial
geo_projects (id, name, location_lat, location_lng, boundary_polygon, status)
geofence_alerts (id, project_id, alert_type, timestamp, metadata)

-- Users & Auth
users (id, email, wallet_address, role, created_at)
jwt_tokens (id, user_id, token, expires_at)
```

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.0
- **Database**: PostgreSQL 15 + PostGIS
- **Blockchain**: Web3j + Ethereum/Polygon
- **Caching**: Redis
- **Queue**: RabbitMQ (for async TX monitoring)
- **Testing**: JUnit 5, Mockito, TestContainers

### Infrastructure
- **Deployment**: Docker + Kubernetes
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack
- **CI/CD**: GitHub Actions

## API Documentation
- **OpenAPI 3.0** with Swagger UI
- **Endpoint**: `/swagger-ui.html`

## Performance Targets
- API Response: < 200ms (p95)
- Blockchain TX: < 30s confirmation
- Concurrent Users: 10,000+
- Uptime: 99.9%

## Next Steps
1. Implement Blockchain module with Web3j
2. Enhance Experiment module with advanced analytics
3. Add Geospatial APIs with PostGIS
4. Build AI Insights endpoints
5. Implement wallet-based authentication
6. Create comprehensive test suite
