-- Migration for blockchain synchronization tables
-- Part of ParkWise Phase 2: On-chain/Off-chain Integration

-- ========================================
-- Blockchain Sync State Table
-- ========================================

CREATE TABLE IF NOT EXISTS blockchain_sync_state (
    contract_address VARCHAR(42) PRIMARY KEY,
    block_number BIGINT NOT NULL DEFAULT 0,
    synced_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_error TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blockchain_sync_block ON blockchain_sync_state(block_number);

COMMENT ON TABLE blockchain_sync_state IS 'Tracks last synced block for each smart contract';

-- ========================================
-- Fund Releases Table
-- ========================================

CREATE TABLE IF NOT EXISTS fund_releases (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES geo_projects(id) ON DELETE CASCADE,
    amount DECIMAL(20, 8) NOT NULL,
    verifier_address VARCHAR(42) NOT NULL,
    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
    block_number BIGINT NOT NULL,
    released_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT positive_release_amount CHECK (amount > 0)
);

CREATE INDEX idx_fund_releases_project ON fund_releases(project_id);
CREATE INDEX idx_fund_releases_verifier ON fund_releases(verifier_address);
CREATE INDEX idx_fund_releases_tx_hash ON fund_releases(transaction_hash);

COMMENT ON TABLE fund_releases IS 'Records blockchain-verified fund releases';

-- ========================================
-- NGO Reputation Table
-- ========================================

CREATE TABLE IF NOT EXISTS ngo_reputation (
    address VARCHAR(42) PRIMARY KEY,
    score INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_reputation_score CHECK (score >= 0 AND score <= 1000)
);

CREATE INDEX idx_ngo_reputation_score ON ngo_reputation(score DESC);

COMMENT ON TABLE ngo_reputation IS 'On-chain reputation scores for NGO addresses';

-- ========================================
-- Impact Reports Table Updates
-- ========================================

-- Add blockchain verification columns if they don't exist
ALTER TABLE impact_reports 
ADD COLUMN IF NOT EXISTS transaction_hash VARCHAR(66) UNIQUE,
ADD COLUMN IF NOT EXISTS evidence_url TEXT,
ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8);

CREATE INDEX IF NOT EXISTS idx_impact_reports_tx_hash ON impact_reports(transaction_hash);

-- ========================================
-- Blockchain Transactions Updates
-- ========================================

-- Add blockchain-specific columns
ALTER TABLE blockchain_transactions
ADD COLUMN IF NOT EXISTS block_number BIGINT,
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_blockchain_tx_block ON blockchain_transactions(block_number);

-- ========================================
-- Event Logs Table (for debugging)
-- ========================================

CREATE TABLE IF NOT EXISTS blockchain_event_logs (
    id SERIAL PRIMARY KEY,
    contract_address VARCHAR(42) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    transaction_hash VARCHAR(66) NOT NULL,
    block_number BIGINT NOT NULL,
    log_index INTEGER NOT NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    UNIQUE(transaction_hash, log_index)
);

CREATE INDEX idx_event_logs_contract ON blockchain_event_logs(contract_address);
CREATE INDEX idx_event_logs_block ON blockchain_event_logs(block_number);
CREATE INDEX idx_event_logs_event_name ON blockchain_event_logs(event_name);
CREATE INDEX idx_event_logs_processed ON blockchain_event_logs(processed) WHERE processed = false;

COMMENT ON TABLE blockchain_event_logs IS 'Raw blockchain event logs for audit trail';

-- ========================================
-- Eco Token Balances Table
-- ========================================

CREATE TABLE IF NOT EXISTS eco_token_balances (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_address VARCHAR(42) NOT NULL,
    balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
    impact_points INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id),
    CONSTRAINT positive_balance CHECK (balance >= 0),
    CONSTRAINT positive_points CHECK (impact_points >= 0)
);

CREATE INDEX idx_eco_token_user ON eco_token_balances(user_id);
CREATE INDEX idx_eco_token_wallet ON eco_token_balances(wallet_address);

COMMENT ON TABLE eco_token_balances IS 'Off-chain cache of EcoToken balances';

-- ========================================
-- Impact Verification Records
-- ========================================

CREATE TABLE IF NOT EXISTS impact_verifications (
    id SERIAL PRIMARY KEY,
    impact_record_id INTEGER UNIQUE NOT NULL,
    project_id INTEGER NOT NULL REFERENCES geo_projects(id),
    contributor_address VARCHAR(42) NOT NULL,
    impact_score INTEGER NOT NULL CHECK (impact_score >= 0 AND impact_score <= 100),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    evidence_ipfs_hash TEXT NOT NULL,
    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_impact_verif_project ON impact_verifications(project_id);
CREATE INDEX idx_impact_verif_contributor ON impact_verifications(contributor_address);
CREATE INDEX idx_impact_verif_verified ON impact_verifications(verified);

COMMENT ON TABLE impact_verifications IS 'Blockchain-verified conservation impact records';

-- ========================================
-- Donor Segments Cache Table
-- ========================================

CREATE TABLE IF NOT EXISTS donor_segments (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    segment_id INTEGER NOT NULL,
    segment_name VARCHAR(50) NOT NULL,
    engagement_score DECIMAL(5, 2) NOT NULL CHECK (engagement_score >= 0 AND engagement_score <= 100),
    donation_count INTEGER NOT NULL DEFAULT 0,
    avg_donation DECIMAL(20, 8) NOT NULL DEFAULT 0,
    days_since_last INTEGER NOT NULL DEFAULT 0,
    last_calculated TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_donor_segments_segment ON donor_segments(segment_name);
CREATE INDEX idx_donor_segments_score ON donor_segments(engagement_score DESC);

COMMENT ON TABLE donor_segments IS 'AI-predicted donor segmentation cache';

-- ========================================
-- Project Impact Scores Cache
-- ========================================

CREATE TABLE IF NOT EXISTS project_impact_scores (
    project_id INTEGER PRIMARY KEY REFERENCES geo_projects(id) ON DELETE CASCADE,
    base_impact_score DECIMAL(5, 2) NOT NULL CHECK (base_impact_score >= 0 AND base_impact_score <= 100),
    proximity_bonus DECIMAL(5, 2) NOT NULL DEFAULT 0,
    final_impact_score DECIMAL(5, 2) NOT NULL CHECK (final_impact_score >= 0 AND final_impact_score <= 100),
    classification VARCHAR(50) NOT NULL,
    last_calculated TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_impact_score ON project_impact_scores(final_impact_score DESC);
CREATE INDEX idx_project_impact_class ON project_impact_scores(classification);

COMMENT ON TABLE project_impact_scores IS 'AI-calculated geo-impact scores for projects';

-- ========================================
-- Sync Service Health Monitoring
-- ========================================

CREATE TABLE IF NOT EXISTS sync_service_health (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'RUNNING',
    last_heartbeat TIMESTAMP NOT NULL DEFAULT NOW(),
    blocks_per_minute DECIMAL(10, 2),
    error_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    metadata JSONB
);

CREATE INDEX idx_sync_health_service ON sync_service_health(service_name);
CREATE INDEX idx_sync_health_heartbeat ON sync_service_health(last_heartbeat DESC);

COMMENT ON TABLE sync_service_health IS 'Health monitoring for blockchain sync service';

-- ========================================
-- Insert initial data
-- ========================================

-- Initialize sync state (will be updated by sync service)
INSERT INTO blockchain_sync_state (contract_address, block_number, synced_at)
VALUES ('0x0000000000000000000000000000000000000000', 0, NOW())
ON CONFLICT (contract_address) DO NOTHING;

-- Initialize sync service health
INSERT INTO sync_service_health (service_name, status)
VALUES ('blockchain_sync_service', 'INITIALIZING')
ON CONFLICT DO NOTHING;

-- ========================================
-- Grant permissions (adjust as needed)
-- ========================================

-- Grant permissions to application user
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO parkwise_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO parkwise_app;

-- ========================================
-- Materialized View for Dashboard
-- ========================================

CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_metrics AS
SELECT
    -- Blockchain metrics
    COUNT(DISTINCT bt.user_id) AS total_donors,
    COUNT(bt.id) AS total_donations,
    COALESCE(SUM(bt.amount), 0) AS total_value_eth,
    COALESCE(AVG(bt.amount), 0) AS avg_donation,
    
    -- Project metrics
    COUNT(DISTINCT gp.id) AS active_projects,
    COALESCE(AVG(gp.species_count), 0) AS avg_species_per_project,
    COALESCE(SUM(gp.area_size), 0) AS total_protected_hectares,
    
    -- Impact metrics
    COUNT(iv.id) AS total_impact_verifications,
    COALESCE(AVG(iv.impact_score), 0) AS avg_impact_score,
    
    -- Timestamp
    NOW() AS last_updated
FROM blockchain_transactions bt
CROSS JOIN geo_projects gp
LEFT JOIN impact_verifications iv ON iv.verified = true;

CREATE UNIQUE INDEX idx_dashboard_metrics_refresh ON dashboard_metrics (last_updated);

COMMENT ON MATERIALIZED VIEW dashboard_metrics IS 'Cached dashboard metrics (refresh every 5 minutes)';

-- Function to refresh dashboard metrics
CREATE OR REPLACE FUNCTION refresh_dashboard_metrics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_metrics;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Success message
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '✅ Blockchain sync tables created successfully';
    RAISE NOTICE '📊 Tables: blockchain_sync_state, fund_releases, ngo_reputation, impact_verifications, donor_segments, project_impact_scores';
    RAISE NOTICE '🔍 Monitoring: blockchain_event_logs, sync_service_health';
    RAISE NOTICE '📈 Dashboard: dashboard_metrics materialized view';
END $$;
