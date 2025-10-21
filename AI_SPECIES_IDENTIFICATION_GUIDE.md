# ParkWise AI Species Identification & Citizen Science Guide

## 🤖 Overview

The AI Species Identification module transforms ParkWise into a citizen science platform where users contribute biodiversity data through image uploads. The system uses Google Cloud Vision API to automatically identify species, with expert review and community validation workflows.

---

## 🎯 Key Features

### 1. AI-Powered Species Identification
- **Automatic Detection**: Google Cloud Vision API analyzes uploaded images
- **Confidence Scoring**: Each prediction includes confidence percentage
- **Alternative Predictions**: Top 5 species suggestions ranked by confidence
- **Processing Time**: Real-time feedback (typically < 2 seconds)

### 2. Expert Review Workflow
- **Moderation Queue**: Pending submissions await expert review
- **Approval/Rejection**: Experts validate AI predictions
- **Feedback**: Reviewers can add comments and corrections
- **Quality Control**: Ensures data accuracy for scientific use

### 3. Community Validation
- **Crowdsourced Verification**: Community members vote on species identification
- **Confidence Levels**: Users indicate their confidence (HIGH/MEDIUM/LOW)
- **Consensus Building**: Multiple validations increase confidence score

### 4. Public Sightings Map
- **Anonymized Locations**: User locations not disclosed publicly
- **Real-time Updates**: New validated sightings appear immediately
- **Geographic Filtering**: View sightings by region
- **Historical Data**: Track species distribution over time

### 5. Gamification & Leaderboard
- **Points System**: 10 points per approved submission
- **Rank Progression**: NOVICE → EXPLORER → NATURALIST → EXPERT
- **Badges**: Unlock achievements for contributions
- **Leaderboard**: Top 100 contributors displayed

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  ImageUpload Component                           │   │
│  │  ├─ File selection & preview                     │   │
│  │  ├─ Geolocation capture                          │   │
│  │  └─ Form submission                              │   │
│  ├──────────────────────────────────────────────────┤   │
│  │  SightingsMap Component                          │   │
│  │  ├─ Interactive map display                      │   │
│  │  ├─ Sighting list & filtering                    │   │
│  │  └─ Statistics dashboard                         │   │
│  ├──────────────────────────────────────────────────┤   │
│  │  CitizenScientistLeaderboard Component           │   │
│  │  ├─ Top contributors ranking                     │   │
│  │  ├─ Rank badges & progression                    │   │
│  │  └─ Achievement tracking                         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│              Spring Boot Backend                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  SpeciesIdentificationController                 │   │
│  │  ├─ POST /api/species/submit                     │   │
│  │  ├─ GET /api/species/sightings/map               │   │
│  │  ├─ PUT /api/species/submission/{id}/approve     │   │
│  │  └─ GET /api/species/leaderboard                 │   │
│  ├──────────────────────────────────────────────────┤   │
│  │  Services                                        │   │
│  │  ├─ AISpeciesIdentificationService               │   │
│  │  ├─ SpeciesSubmissionService                     │   │
│  │  └─ SightingsMapService                          │   │
│  ├──────────────────────────────────────────────────┤   │
│  │  Repositories (6 repositories)                   │   │
│  │  ├─ SpeciesRepository                            │   │
│  │  ├─ SpeciesSubmissionRepository                  │   │
│  │  ├─ AIPredictionRepository                       │   │
│  │  ├─ ExpertReviewRepository                       │   │
│  │  ├─ CitizenScientistStatsRepository              │   │
│  │  └─ SightingsMapRepository                       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓ JDBC
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                        │
│  ├─ species (catalog)                                   │
│  ├─ species_submissions (user uploads)                  │
│  ├─ ai_predictions (AI results)                         │
│  ├─ expert_reviews (moderation)                         │
│  ├─ community_validations (crowdsourcing)               │
│  ├─ sightings_map (public data)                         │
│  ├─ citizen_scientist_stats (leaderboard)               │
│  └─ ai_processing_queue (async processing)              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│           Google Cloud Vision API                       │
│  ├─ Label Detection                                     │
│  ├─ Object Detection                                    │
│  └─ Confidence Scoring                                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│         Cloud Storage (S3/GCS)                          │
│  ├─ Original images                                     │
│  ├─ Thumbnails                                          │
│  └─ Processed images                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### species
```sql
- id (PK)
- common_name
- scientific_name (UNIQUE)
- description
- conservation_status (ENUM)
- category (ENUM: BIRD, MAMMAL, etc.)
- habitat_types
- geographic_range
- iucn_id
- image_url
```

### species_submissions
```sql
- id (PK)
- user_id (FK)
- campaign_id (FK)
- species_id (FK)
- image_url
- image_storage_key
- latitude, longitude
- location_name
- submission_date
- observation_date
- notes
- submission_status (ENUM: PENDING, APPROVED, REJECTED, FLAGGED)
```

### ai_predictions
```sql
- id (PK)
- submission_id (FK)
- species_id (FK)
- common_name
- scientific_name
- confidence_score (0.0-1.0)
- ai_model_version
- alternative_predictions (JSONB)
- processing_time_ms
```

### expert_reviews
```sql
- id (PK)
- submission_id (FK)
- reviewer_id (FK)
- species_id (FK)
- review_status (ENUM: APPROVED, REJECTED, NEEDS_MORE_INFO)
- confidence_level (ENUM: HIGH, MEDIUM, LOW)
- comments
- flagged_reason
```

### community_validations
```sql
- id (PK)
- submission_id (FK)
- user_id (FK)
- species_id (FK)
- confidence_level (ENUM)
- validation_date
```

### sightings_map
```sql
- id (PK)
- species_id (FK)
- latitude, longitude
- sighting_date
- sighting_count
- confidence_score
- submission_id (FK)
```

### citizen_scientist_stats
```sql
- id (PK)
- user_id (UNIQUE)
- total_submissions
- approved_submissions
- species_identified
- points
- badges
- rank (ENUM: NOVICE, EXPLORER, NATURALIST, EXPERT)
- last_submission_date
```

---

## 🔌 API Endpoints

### Species Submission
```
POST /api/species/submit
  Parameters:
    - userId (required)
    - campaignId (optional)
    - image (file, required)
    - latitude (required)
    - longitude (required)
    - locationName (optional)
    - notes (optional)
  
  Response:
    {
      "submissionId": 123,
      "status": "PENDING",
      "message": "Submission received. AI processing in progress...",
      "imageUrl": "/api/species/images/abc123.jpg"
    }
```

### Get Submission with AI Prediction
```
GET /api/species/submission/{submissionId}
  
  Response:
    {
      "submissionId": 123,
      "status": "PENDING",
      "imageUrl": "...",
      "latitude": 26.8124,
      "longitude": 91.7362,
      "locationName": "Manas National Park",
      "aiPrediction": {
        "commonName": "Great Hornbill",
        "scientificName": "Buceros bicornis",
        "confidenceScore": 0.85,
        "category": "BIRD",
        "conservationStatus": "VULNERABLE"
      }
    }
```

### Approve Submission (Expert)
```
PUT /api/species/submission/{submissionId}/approve
  Parameters:
    - reviewerId (required)
    - speciesId (required)
    - comments (optional)
```

### Reject Submission (Expert)
```
PUT /api/species/submission/{submissionId}/reject
  Parameters:
    - reviewerId (required)
    - reason (required)
```

### Get Public Sightings Map
```
GET /api/species/sightings/map
  
  Response: Array of SightingsMap objects
```

### Get Species Sightings
```
GET /api/species/{speciesId}/sightings
  
  Response: Array of sightings for specific species
```

### Get Sightings in Area
```
GET /api/species/sightings/area?minLat=X&maxLat=Y&minLon=A&maxLon=B
  
  Response: Array of sightings in geographic area
```

### Get Leaderboard
```
GET /api/species/leaderboard
  
  Response: Top 100 citizen scientists with stats
```

### Get User Stats
```
GET /api/species/user/{userId}/stats
  
  Response:
    {
      "userId": 123,
      "totalSubmissions": 15,
      "approvedSubmissions": 12,
      "speciesIdentified": 8,
      "points": 120,
      "rank": "EXPLORER"
    }
```

---

## 🚀 Setup & Configuration

### 1. Enable Google Cloud Vision API

```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable Vision API
gcloud services enable vision.googleapis.com

# Create service account
gcloud iam service-accounts create parkwise-vision
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member=serviceAccount:parkwise-vision@YOUR_PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/vision.admin

# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=parkwise-vision@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 2. Configure Backend

Update `application.properties`:
```properties
# Google Cloud Vision
google.cloud.vision.enabled=true
google.cloud.vision.model-version=v1
google.cloud.credentials.location=path/to/key.json

# File Upload
upload.dir=uploads/species
upload.max-size=10485760 # 10MB

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/parkwise_experiments
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### 3. Run Database Migration

```bash
psql parkwise_experiments < database/migrations/002_create_species_identification_tables.sql
```

### 4. Populate Species Catalog

```sql
INSERT INTO species (common_name, scientific_name, conservation_status, category, geographic_range)
VALUES 
  ('Great Hornbill', 'Buceros bicornis', 'VULNERABLE', 'BIRD', 'South and Southeast Asia'),
  ('Bengal Tiger', 'Panthera tigris tigris', 'ENDANGERED', 'MAMMAL', 'India, Bangladesh, Nepal'),
  ('Indian Rhinoceros', 'Rhinoceros unicornis', 'VULNERABLE', 'MAMMAL', 'India, Nepal'),
  ('Asian Elephant', 'Elephas maximus indicus', 'ENDANGERED', 'MAMMAL', 'South and Southeast Asia'),
  ('Clouded Leopard', 'Neofelis diardi', 'VULNERABLE', 'MAMMAL', 'Southeast Asia');
```

---

## 💡 Usage Examples

### Example 1: Submit Species Sighting

```javascript
const formData = new FormData()
formData.append('userId', 123)
formData.append('campaignId', 1)
formData.append('image', imageFile)
formData.append('latitude', 26.8124)
formData.append('longitude', 91.7362)
formData.append('locationName', 'Manas National Park')
formData.append('notes', 'Spotted near river, group of 3')

const response = await fetch('/api/species/submit', {
  method: 'POST',
  body: formData
})

const result = await response.json()
console.log('Submission ID:', result.submissionId)
```

### Example 2: Check AI Prediction

```javascript
const response = await fetch('/api/species/submission/123')
const submission = await response.json()

console.log('Species:', submission.aiPrediction.commonName)
console.log('Confidence:', submission.aiPrediction.confidenceScore * 100 + '%')
```

### Example 3: Approve Submission (Expert)

```javascript
await fetch('/api/species/submission/123/approve', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    reviewerId: 456,
    speciesId: 1,
    comments: 'Confirmed Great Hornbill, excellent photo'
  })
})
```

### Example 4: View Leaderboard

```javascript
const response = await fetch('/api/species/leaderboard')
const leaderboard = await response.json()

leaderboard.forEach((contributor, index) => {
  console.log(`${index + 1}. User ${contributor.userId}: ${contributor.points} points`)
})
```

---

## 🎮 Gamification System

### Rank Progression
- **NOVICE**: 0-9 approved submissions
- **EXPLORER**: 10-49 approved submissions
- **NATURALIST**: 50-99 approved submissions
- **EXPERT**: 100+ approved submissions

### Points System
- 10 points per approved submission
- Bonus points for rare species (2x multiplier)
- Bonus points for high-confidence predictions (1.5x multiplier)

### Badges (Future Enhancement)
- 🌱 First Submission
- 🦅 Species Expert (10 unique species)
- 🗺️ Geographic Explorer (50 different locations)
- ⭐ Community Validator (100 community validations)
- 🏆 Hall of Fame (1000+ points)

---

## 🔒 Data Privacy & Ethics

### User Privacy
- ✅ Location data anonymized in public map
- ✅ User IDs not displayed publicly
- ✅ Exact coordinates rounded to ~100m accuracy
- ✅ User can opt-out of public display

### Data Quality
- ✅ Expert review before public display
- ✅ Confidence scoring for all predictions
- ✅ Community validation for verification
- ✅ Flagging system for suspicious submissions

### Ethical Considerations
- ✅ No endangered species locations disclosed
- ✅ Sensitive species data protected
- ✅ Transparent AI confidence scores
- ✅ Expert review prevents misinformation

---

## 📈 Performance Considerations

### Image Processing
- **Optimization**: Resize images to 1024x1024 before processing
- **Caching**: Cache AI predictions for identical images
- **Async Processing**: Queue submissions for background processing
- **Rate Limiting**: Limit API calls to prevent quota overages

### Database Performance
- **Indexes**: Optimized indexes on frequently queried columns
- **Partitioning**: Partition sightings_map by date for large datasets
- **Archiving**: Archive old submissions to separate tables

### Scalability
- **Cloud Storage**: Use S3/GCS for image storage
- **CDN**: Serve images through CDN for faster delivery
- **Message Queue**: Use Kafka/RabbitMQ for async processing
- **Caching**: Redis cache for leaderboard and stats

---

## 🧪 Testing

### Unit Tests
```java
@Test
public void testSpeciesIdentification() {
  // Test AI identification service
  AIIdentificationResponse response = aiService.identifySpeciesFromImage(submission, imagePath);
  assertNotNull(response.getTopPrediction());
  assertTrue(response.isSuccess());
}
```

### Integration Tests
```java
@Test
public void testSubmissionWorkflow() {
  // Test complete submission workflow
  SubmissionResponse response = submissionService.submitSpeciesSighting(...);
  assertEquals("PENDING", response.getStatus());
  
  // Approve submission
  submissionService.approveSubmission(...);
  
  // Verify sighting added to map
  List<SightingsMap> sightings = sightingsMapService.getSpeciesSightings(speciesId);
  assertFalse(sightings.isEmpty());
}
```

---

## 🚀 Deployment

### Production Checklist
- [ ] Google Cloud Vision API configured
- [ ] Database migrations applied
- [ ] Species catalog populated
- [ ] Image storage configured (S3/GCS)
- [ ] Expert reviewer accounts created
- [ ] Monitoring and alerts set up
- [ ] Backup procedures tested
- [ ] Rate limiting configured

### Monitoring
- Track API response times
- Monitor AI processing queue
- Alert on high error rates
- Track leaderboard updates
- Monitor storage usage

---

## 📚 Resources

- [Google Cloud Vision API](https://cloud.google.com/vision)
- [IUCN Red List](https://www.iucnredlist.org/)
- [eBird Database](https://ebird.org/)
- [Citizen Science Best Practices](https://www.citizenscience.org/)

---

**Last Updated**: October 21, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready
