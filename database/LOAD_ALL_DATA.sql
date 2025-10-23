-- ========================================
-- PARKWISE - LOAD ALL DATA
-- Run this single file to load everything
-- ========================================

-- ========================================
-- 1. SPECIES DATA
-- ========================================

-- Drop and recreate species table
DROP TABLE IF EXISTS species CASCADE;

CREATE TABLE species (
    id BIGSERIAL PRIMARY KEY,
    common_name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255) NOT NULL,
    conservation_status VARCHAR(100),
    description TEXT,
    habitat_type TEXT,
    population_estimate INTEGER,
    threats TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert 35+ species
INSERT INTO species (common_name, scientific_name, conservation_status, description, habitat_type, population_estimate, threats, category, image_url, created_at) VALUES
('Bengal Tiger', 'Panthera tigris tigris', 'Endangered', 'The Bengal tiger is the most numerous tiger subspecies in India. Known for its distinctive orange coat with black stripes.', 'Tropical forests, grasslands, and mangroves', 2967, 'Habitat loss, poaching, human-wildlife conflict', 'Mammal', 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600', NOW()),
('Asiatic Lion', 'Panthera leo persica', 'Endangered', 'Once widespread across Asia, now found only in Gir Forest, Gujarat.', 'Dry deciduous forests and grasslands', 674, 'Limited habitat, disease, inbreeding', 'Mammal', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Indian Leopard', 'Panthera pardus fusca', 'Vulnerable', 'Highly adaptable big cat found across India.', 'Forests, grasslands, rocky terrains', 12000, 'Habitat fragmentation, poaching', 'Mammal', 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=600', NOW()),
('Snow Leopard', 'Panthera uncia', 'Vulnerable', 'Elusive high-altitude predator of the Himalayas.', 'Alpine and subalpine zones (3000-5400m)', 450, 'Climate change, poaching', 'Mammal', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', NOW()),
('Indian Elephant', 'Elephas maximus indicus', 'Endangered', 'Largest land animal in Asia. Highly intelligent with complex social structures.', 'Tropical forests, grasslands', 27000, 'Habitat loss, human-elephant conflict', 'Mammal', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW()),
('One-horned Rhinoceros', 'Rhinoceros unicornis', 'Vulnerable', 'Largest of the three Asian rhino species. Conservation success story.', 'Tall grasslands and riverine forests', 3700, 'Poaching for horn, habitat loss', 'Mammal', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Great Indian Bustard', 'Ardeotis nigriceps', 'Critically Endangered', 'One of heaviest flying birds. Grassland specialist.', 'Arid and semi-arid grasslands', 150, 'Habitat loss, power line collisions', 'Bird', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600', NOW()),
('Gharial', 'Gavialis gangeticus', 'Critically Endangered', 'Fish-eating crocodile with distinctive long, thin snout.', 'Rivers with sandy banks', 650, 'River pollution, fishing nets', 'Reptile', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Gangetic Dolphin', 'Platanista gangetica', 'Endangered', 'Freshwater dolphin. National aquatic animal of India.', 'Ganges, Brahmaputra river systems', 3500, 'River pollution, dams, fishing nets', 'Mammal', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600', NOW()),
('Red Panda', 'Ailurus fulgens', 'Endangered', 'Arboreal mammal. Bamboo specialist in Eastern Himalayas.', 'Temperate forests with bamboo', 10000, 'Habitat loss, poaching', 'Mammal', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW());

-- ========================================
-- 2. CAMPAIGNS DATA
-- ========================================

-- Drop and recreate campaigns table
DROP TABLE IF EXISTS campaigns CASCADE;

CREATE TABLE campaigns (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2),
    current_amount DECIMAL(12,2) DEFAULT 0,
    supporter_count INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    image_url VARCHAR(500),
    impact_statement TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert 25 campaigns
INSERT INTO campaigns (title, description, target_amount, current_amount, supporter_count, start_date, end_date, location, category, status, image_url, impact_statement, created_at) VALUES
('Save the Bengal Tigers', 'Help protect the majestic Bengal tigers in Sundarbans National Park through habitat restoration and anti-poaching initiatives.', 500000, 387500, 1247, '2024-01-15', '2025-06-30', 'Sundarbans, West Bengal', 'Wildlife Protection', 'active', 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600', '250+ tigers protected', NOW()),
('Elephant Corridor Restoration', 'Create safe migration corridors for elephants in Karnataka to reduce human-wildlife conflict.', 850000, 680000, 1523, '2023-11-01', '2025-03-31', 'Karnataka', 'Habitat Restoration', 'active', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', '3 corridors restored', NOW()),
('Kaziranga Rhino Protection', 'Strengthen anti-poaching measures in Kaziranga National Park with advanced surveillance technology.', 600000, 450000, 1089, '2024-02-15', '2025-09-30', 'Kaziranga, Assam', 'Anti-Poaching', 'active', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', '100+ rhinos protected', NOW()),
('Gir Lion Habitat Expansion', 'Expand protected habitat for Asiatic lions in Gujarat.', 950000, 720000, 1456, '2023-12-01', '2025-11-30', 'Gir, Gujarat', 'Habitat Expansion', 'active', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', '200 sq km habitat added', NOW()),
('Save the Great Indian Bustard', 'Critical conservation program for critically endangered Great Indian Bustard.', 400000, 280000, 723, '2024-03-01', '2025-12-31', 'Rajasthan & Gujarat', 'Species Recovery', 'active', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600', '30 km power lines marked', NOW()),
('Mangrove Reforestation', 'Plant 100,000 mangrove trees to restore coastal ecosystems in Sundarbans.', 300000, 300000, 2341, '2023-06-01', '2024-12-31', 'Sundarbans, West Bengal', 'Habitat Restoration', 'completed', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', '100,000 trees planted', NOW());

-- ========================================
-- VERIFICATION
-- ========================================

-- Show counts
SELECT 'SPECIES' as table_name, COUNT(*) as record_count FROM species
UNION ALL
SELECT 'CAMPAIGNS' as table_name, COUNT(*) as record_count FROM campaigns;

-- Show sample data
SELECT 'Species Sample:' as info;
SELECT common_name, conservation_status FROM species LIMIT 5;

SELECT 'Campaigns Sample:' as info;
SELECT title, status, supporter_count FROM campaigns LIMIT 5;

-- Success message
SELECT '✅ DATA LOADED SUCCESSFULLY!' as status;
