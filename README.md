# 🌿 ParkWise - Wildlife Conservation Platform

[![CI/CD](https://github.com/parkwise/parkwise/workflows/CI%2FCD/badge.svg)](https://github.com/parkwise/parkwise/actions)
[![codecov](https://codecov.io/gh/parkwise/parkwise/branch/main/graph/badge.svg)](https://codecov.io/gh/parkwise/parkwise)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> A comprehensive platform for wildlife conservation, species tracking, and community-driven conservation campaigns across India's national parks.

## 🎯 Features

### Core Features
- 🏞️ **National Parks Directory** - Comprehensive database of India's protected areas
- 🐯 **Species Tracking** - AI-powered species identification and sighting reports
- 💰 **Conservation Campaigns** - Crowdfunding for wildlife protection initiatives
- 🗺️ **Geospatial Intelligence** - Location-based features and heatmaps
- 🔗 **Blockchain Integration** - Transparent donation tracking
- 📊 **Analytics Dashboard** - Real-time conservation metrics

### Advanced Features
- 🤖 **AI Species Recognition** - Google Cloud Vision API integration
- 🎓 **Citizen Science Portal** - Community-driven data collection
- 📱 **Progressive Web App** - Offline-first mobile experience
- 🔐 **Secure Authentication** - JWT-based auth with role-based access
- 📈 **Real-time Monitoring** - Prometheus + Grafana dashboards
- 🌐 **Multi-language Support** - English, Hindi, and regional languages

## 🚀 Quick Start

### Prerequisites
- Docker 24+ & Docker Compose 2.20+
- Node.js 20+ (for local development)
- Java 21+ (for local development)
- PostgreSQL 16+ (or use Docker)

### Local Development

```bash
# Clone the repository
git clone https://github.com/parkwise/parkwise.git
cd parkwise

# Copy environment file
cp .env.example .env

# Start services with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8080
# API Docs: http://localhost:8080/swagger-ui.html
```

### Manual Setup

#### Backend
```bash
cd backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run

# Run tests
mvn test
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

#### Database
```bash
# Create database
createdb parkwise

# Run migrations
psql -d parkwise -f database/create_and_load.sql

# Load seed data
psql -d parkwise -f database/seed_data.sql
```

## 📁 Project Structure

```
parkwise/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/parkwise/
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── service/         # Business logic
│   │   │   │   ├── repository/      # Data access
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── dto/             # Data transfer objects
│   │   │   │   ├── security/        # Security config
│   │   │   │   ├── geo/             # Geospatial features
│   │   │   │   └── blockchain/      # Blockchain integration
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-prod.properties
│   │   └── test/            # Unit & integration tests
│   └── pom.xml
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── stores/          # State management
│   │   └── utils/           # Utility functions
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── database/                # Database scripts
│   ├── create_and_load.sql
│   ├── seed_data.sql
│   └── migrations/
│
├── monitoring/              # Monitoring configs
│   ├── prometheus.yml
│   ├── alerts.yml
│   └── grafana/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # CI/CD pipeline
│
├── docker-compose.yml       # Development compose
├── docker-compose.prod.yml  # Production compose
├── Dockerfile.backend
├── Dockerfile.frontend
├── nginx.conf
├── .env.example
├── DEPLOYMENT_GUIDE.md
├── PRODUCTION_ROADMAP.md
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Framework:** Spring Boot 3.2
- **Language:** Java 21
- **Database:** PostgreSQL 16 + PostGIS
- **Cache:** Redis 7
- **Security:** Spring Security + JWT
- **API Docs:** OpenAPI 3.0 (Swagger)
- **Testing:** JUnit 5, Mockito, TestContainers

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** TailwindCSS 3
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Maps:** Mapbox GL JS
- **Testing:** Jest, React Testing Library

### DevOps
- **Containerization:** Docker, Docker Compose
- **Orchestration:** Kubernetes
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus, Grafana
- **Logging:** ELK Stack
- **Cloud:** AWS/GCP/Azure

### AI/ML
- **Vision API:** Google Cloud Vision
- **Image Processing:** TensorFlow
- **Species Classification:** Custom ML models

### Blockchain
- **Network:** Polygon (Matic)
- **Smart Contracts:** Solidity
- **Web3:** Web3.js, Ethers.js

## 📊 API Documentation

### Authentication
```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "user",
  "password": "password123"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Parks
```bash
# Get all parks
GET /api/parks

# Get park by ID
GET /api/parks/{id}

# Search parks by state
GET /api/parks/state/{state}
```

### Species
```bash
# Get all species
GET /api/species

# Submit sighting
POST /api/species/sightings
{
  "speciesId": 1,
  "latitude": 28.5355,
  "longitude": 77.3910,
  "image": "base64_encoded_image"
}

# Get leaderboard
GET /api/species/leaderboard
```

### Campaigns
```bash
# Get all campaigns
GET /api/campaigns

# Create campaign
POST /api/campaigns
{
  "title": "Save the Tigers",
  "description": "...",
  "targetAmount": 500000,
  "location": "Sundarbans, West Bengal"
}

# Donate to campaign
POST /api/campaigns/{id}/donate
{
  "amount": 1000,
  "donorName": "John Doe"
}
```

Full API documentation available at: `/api/docs`

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report

# Run integration tests
mvn verify -P integration-tests
```

### Frontend Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

## 📈 Monitoring & Observability

### Metrics
- Application metrics via Actuator
- Custom business metrics
- Database performance metrics
- Cache hit/miss rates

### Dashboards
- **Grafana:** http://localhost:3000
- **Prometheus:** http://localhost:9090
- **Application:** http://localhost:8080/actuator

### Alerts
- High error rate (> 5%)
- High memory usage (> 90%)
- Database connection issues
- API response time (> 1s)

## 🔒 Security

### Implemented
- ✅ JWT authentication
- ✅ Password hashing (BCrypt)
- ✅ CORS configuration
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ Security headers

### Best Practices
- Regular security audits
- Dependency vulnerability scanning
- Secrets management
- HTTPS/TLS encryption
- Database encryption at rest
- Audit logging

## 🌍 Deployment

### Docker
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Kubernetes
```bash
# Create namespace
kubectl create namespace parkwise

# Apply configurations
kubectl apply -f k8s/

# Check status
kubectl get pods -n parkwise
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Basic CRUD operations
- [x] Authentication system
- [x] Database setup
- [x] Frontend UI

### Phase 2: Core Features ✅
- [x] Parks directory
- [x] Species tracking
- [x] Campaign management
- [x] User profiles

### Phase 3: Advanced Features 🚧
- [x] AI species recognition
- [x] Geospatial features
- [ ] Real-time notifications
- [ ] Mobile app (PWA)

### Phase 4: Scale & Optimize 📋
- [ ] Performance optimization
- [ ] Caching layer
- [ ] CDN integration
- [ ] Load balancing

### Phase 5: Research & Analytics 📋
- [ ] A/B testing framework
- [ ] Behavioral interventions
- [ ] Advanced analytics
- [ ] Research dashboard

See [PRODUCTION_ROADMAP.md](PRODUCTION_ROADMAP.md) for complete roadmap.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Backend: Follow Google Java Style Guide
- Frontend: ESLint + Prettier configuration
- Commits: Conventional Commits specification

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead:** Your Name
- **Backend:** Development Team
- **Frontend:** Development Team
- **DevOps:** Operations Team
- **Research:** Research Team

## 📞 Support

- **Documentation:** https://docs.parkwise.com
- **Issues:** https://github.com/parkwise/parkwise/issues
- **Discussions:** https://github.com/parkwise/parkwise/discussions
- **Email:** support@parkwise.com
- **Slack:** parkwise.slack.com

## 🙏 Acknowledgments

- Wildlife Institute of India
- National Parks Authority
- Conservation NGOs
- Open Source Community
- All Contributors

## 📊 Project Stats

- **Lines of Code:** 50,000+
- **Test Coverage:** 80%+
- **API Endpoints:** 50+
- **Database Tables:** 20+
- **Active Users:** Growing
- **Species Tracked:** 150+
- **Parks Covered:** 100+

---

**Made with ❤️ for Wildlife Conservation**

*Last Updated: October 24, 2025*
