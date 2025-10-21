-- Migration: Create Experiment Management Tables
-- Purpose: Support A/B testing and behavioral intervention tracking

-- Table: Experiment Definitions
CREATE TABLE IF NOT EXISTS experiments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, paused, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    ended_at TIMESTAMP
);

-- Table: Experiment Variants
CREATE TABLE IF NOT EXISTS experiment_variants (
    id SERIAL PRIMARY KEY,
    experiment_id INTEGER NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    variant_name VARCHAR(50) NOT NULL,
    description TEXT,
    allocation_percentage DECIMAL(5, 2) DEFAULT 50.00, -- Traffic allocation %
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(experiment_id, variant_name)
);

-- Table: User Experiment Assignment
CREATE TABLE IF NOT EXISTS experiment_assignment (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    experiment_id INTEGER NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    variant_id INTEGER NOT NULL REFERENCES experiment_variants(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, experiment_id)
);

-- Table: User Event Log (Core Analytics)
CREATE TABLE IF NOT EXISTS user_event_log (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    experiment_id INTEGER REFERENCES experiments(id) ON DELETE SET NULL,
    variant_id INTEGER REFERENCES experiment_variants(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- page_view, donation_started, donation_submitted, etc.
    event_value VARCHAR(500), -- JSON or simple value
    metadata JSONB, -- Additional context
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_experiment (user_id, experiment_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
);

-- Table: Donation Events (Specific tracking for donations)
CREATE TABLE IF NOT EXISTS donation_events (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    campaign_id BIGINT NOT NULL,
    experiment_id INTEGER REFERENCES experiments(id) ON DELETE SET NULL,
    variant_id INTEGER REFERENCES experiment_variants(id) ON DELETE SET NULL,
    donation_amount DECIMAL(10, 2) NOT NULL,
    donation_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
    event_log_id BIGINT REFERENCES user_event_log(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    INDEX idx_user_campaign (user_id, campaign_id),
    INDEX idx_experiment_variant (experiment_id, variant_id)
);

-- Table: Experiment Metrics (Pre-computed summaries)
CREATE TABLE IF NOT EXISTS experiment_metrics (
    id SERIAL PRIMARY KEY,
    experiment_id INTEGER NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    variant_id INTEGER NOT NULL REFERENCES experiment_variants(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL, -- conversion_rate, avg_donation, repeat_donor_rate
    metric_value DECIMAL(15, 4),
    sample_size INTEGER,
    computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(experiment_id, variant_id, metric_name)
);

-- Create Indexes for Performance
CREATE INDEX idx_experiment_status ON experiments(status);
CREATE INDEX idx_experiment_assignment_user ON experiment_assignment(user_id);
CREATE INDEX idx_experiment_assignment_experiment ON experiment_assignment(experiment_id);
CREATE INDEX idx_event_log_user_time ON user_event_log(user_id, created_at DESC);
CREATE INDEX idx_donation_events_experiment ON donation_events(experiment_id, variant_id);
