-- Migration: Create Species Identification & Citizen Science Tables
-- Purpose: Support AI-powered species identification and citizen science data collection

-- Table: Species Catalog
CREATE TABLE IF NOT EXISTS species (
    id SERIAL PRIMARY KEY,
    common_name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    conservation_status VARCHAR(50), -- EXTINCT, EXTINCT_IN_WILD, CRITICALLY_ENDANGERED, ENDANGERED, VULNERABLE, NEAR_THREATENED, LEAST_CONCERN, DATA_DEFICIENT
    category VARCHAR(50), -- BIRD, MAMMAL, REPTILE, AMPHIBIAN, FISH, INSECT, PLANT, etc.
    habitat_types TEXT[], -- Array of habitat types
    geographic_range TEXT,
    iucn_id VARCHAR(100),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: User Submissions (Citizen Science)
CREATE TABLE IF NOT EXISTS species_submissions (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    campaign_id BIGINT,
    species_id INTEGER REFERENCES species(id) ON DELETE SET NULL,
    image_url VARCHAR(500) NOT NULL,
    image_storage_key VARCHAR(500), -- S3/GCS key
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_name VARCHAR(255),
    submission_date TIMESTAMP NOT NULL,
    observation_date DATE,
    notes TEXT,
    submission_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, FLAGGED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (submission_status),
    INDEX idx_species_id (species_id),
    INDEX idx_location (latitude, longitude)
);

-- Table: AI Predictions
CREATE TABLE IF NOT EXISTS ai_predictions (
    id SERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL REFERENCES species_submissions(id) ON DELETE CASCADE,
    species_id INTEGER REFERENCES species(id) ON DELETE SET NULL,
    common_name VARCHAR(255),
    scientific_name VARCHAR(255),
    confidence_score DECIMAL(5, 4), -- 0.0 to 1.0
    ai_model_version VARCHAR(50),
    alternative_predictions JSONB, -- Top 5 predictions with scores
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_submission_id (submission_id),
    INDEX idx_confidence (confidence_score DESC)
);

-- Table: Expert Reviews & Moderation
CREATE TABLE IF NOT EXISTS expert_reviews (
    id SERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL REFERENCES species_submissions(id) ON DELETE CASCADE,
    reviewer_id BIGINT NOT NULL,
    species_id INTEGER REFERENCES species(id) ON DELETE SET NULL,
    review_status VARCHAR(50) NOT NULL, -- APPROVED, REJECTED, NEEDS_MORE_INFO
    confidence_level VARCHAR(50), -- HIGH, MEDIUM, LOW
    comments TEXT,
    flagged_reason VARCHAR(255), -- If flagged for quality/authenticity
    review_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_submission_id (submission_id),
    INDEX idx_reviewer_id (reviewer_id),
    INDEX idx_status (review_status)
);

-- Table: Community Validation (Crowdsourced verification)
CREATE TABLE IF NOT EXISTS community_validations (
    id SERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL REFERENCES species_submissions(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL,
    species_id INTEGER REFERENCES species(id) ON DELETE SET NULL,
    confidence_level VARCHAR(50), -- HIGH, MEDIUM, LOW
    validation_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(submission_id, user_id), -- One validation per user per submission
    INDEX idx_submission_id (submission_id),
    INDEX idx_user_id (user_id)
);

-- Table: Sightings Map (Public, anonymized data)
CREATE TABLE IF NOT EXISTS sightings_map (
    id SERIAL PRIMARY KEY,
    species_id INTEGER NOT NULL REFERENCES species(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    sighting_date DATE NOT NULL,
    sighting_count INTEGER DEFAULT 1,
    confidence_score DECIMAL(5, 4),
    submission_id BIGINT REFERENCES species_submissions(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_species_id (species_id),
    INDEX idx_location (latitude, longitude),
    INDEX idx_date (sighting_date)
);

-- Table: Leaderboard & Gamification
CREATE TABLE IF NOT EXISTS citizen_scientist_stats (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    total_submissions INTEGER DEFAULT 0,
    approved_submissions INTEGER DEFAULT 0,
    species_identified INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    badges TEXT[], -- Array of badge names
    rank VARCHAR(50), -- NOVICE, EXPLORER, NATURALIST, EXPERT
    last_submission_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_points (points DESC),
    INDEX idx_rank (rank)
);

-- Table: AI Processing Queue
CREATE TABLE IF NOT EXISTS ai_processing_queue (
    id SERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL REFERENCES species_submissions(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'QUEUED', -- QUEUED, PROCESSING, COMPLETED, FAILED
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Create Indexes for Performance
CREATE INDEX idx_species_conservation_status ON species(conservation_status);
CREATE INDEX idx_species_category ON species(category);
CREATE INDEX idx_submissions_created_at ON species_submissions(created_at DESC);
CREATE INDEX idx_sightings_created_at ON sightings_map(created_at DESC);

-- Create View: Validated Sightings (for public map)
CREATE OR REPLACE VIEW validated_sightings AS
SELECT 
    s.id,
    sp.id as species_id,
    sp.common_name,
    sp.scientific_name,
    sp.conservation_status,
    s.latitude,
    s.longitude,
    s.sighting_date,
    s.sighting_count,
    s.confidence_score,
    s.created_at
FROM sightings_map s
JOIN species sp ON s.species_id = sp.id
WHERE s.confidence_score >= 0.75
ORDER BY s.created_at DESC;

-- Create View: User Contributions
CREATE OR REPLACE VIEW user_contributions AS
SELECT 
    u.user_id,
    COUNT(DISTINCT ss.id) as total_submissions,
    COUNT(DISTINCT CASE WHEN ss.submission_status = 'APPROVED' THEN ss.id END) as approved_submissions,
    COUNT(DISTINCT ss.species_id) as unique_species,
    MAX(ss.created_at) as last_submission
FROM species_submissions ss
JOIN (SELECT DISTINCT user_id FROM species_submissions) u ON ss.user_id = u.user_id
GROUP BY u.user_id;
