-- Create database
CREATE DATABASE IF NOT EXISTS parkwise;
USE parkwise;

-- Parks table
CREATE TABLE parks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    image_url VARCHAR(500),
    conservation_status VARCHAR(50),
    established_year INT,
    area DECIMAL(10, 2),
    best_time_to_visit VARCHAR(100),
    key_attractions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Species table
CREATE TABLE species (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    type ENUM('FLORA', 'FAUNA') NOT NULL,
    conservation_status VARCHAR(50),
    description TEXT,
    image_url VARCHAR(500),
    habitat VARCHAR(255),
    diet VARCHAR(100),
    lifespan VARCHAR(50),
    park_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (park_id) REFERENCES parks(id) ON DELETE SET NULL
);

-- Campaigns table
CREATE TABLE campaigns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15, 2),
    current_amount DECIMAL(15, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    image_url VARCHAR(500),
    supporters INT DEFAULT 0,
    park_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (park_id) REFERENCES parks(id) ON DELETE SET NULL
);

-- Donations table
CREATE TABLE donations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(15, 2) NOT NULL,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255),
    donor_message TEXT,
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    campaign_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
);

-- Insert sample data for parks
INSERT INTO parks (name, state, description, latitude, longitude, conservation_status, established_year, area, best_time_to_visit, key_attractions) VALUES
('Kaziranga National Park', 'Assam', 'Home to the world''s largest population of one-horned rhinoceroses, this UNESCO World Heritage Site spans the floodplains of the Brahmaputra River. The park also hosts significant populations of tigers, elephants, wild water buffalo, and swamp deer.', 26.5735, 93.1715, 'Protected', 1974, 430.00, 'November to April', 'Rhino Safari, Elephant Rides, Bird Watching'),
('Panna Tiger Reserve', 'Madhya Pradesh', 'Known for its successful tiger conservation program, Panna lost its entire tiger population in 2009 but has since made a remarkable recovery through dedicated conservation efforts. The Ken River flowing through the reserve adds to its scenic beauty.', 24.7136, 80.1889, 'Critical', 1981, 542.00, 'October to June', 'Tiger Safari, Ken River, Ancient Temples'),
('Manas National Park', 'Assam', 'A UNESCO Natural World Heritage site, Project Tiger Reserve, Elephant Reserve and Biosphere Reserve located in the Himalayan foothills. The park is known for its rare and endangered endemic wildlife like the Assam roofed turtle, hispid hare, golden langur and pygmy hog.', 26.7159, 91.0248, 'Protected', 1990, 950.00, 'October to April', 'Elephant Safari, River Rafting, Bird Watching'),
('Sunderbans National Park', 'West Bengal', 'The largest tidal halophytic mangrove forest in the world, famous for the Royal Bengal Tiger. The Sundarbans is a UNESCO World Heritage Site and provides a unique ecosystem and a rich wildlife habitat.', 21.9497, 88.9401, 'Critical', 1984, 1330.00, 'September to March', 'Tiger Spotting, Boat Safari, Mangrove Forests');

-- Insert sample data for species
INSERT INTO species (name, scientific_name, type, conservation_status, description, habitat, diet, lifespan, park_id) VALUES
('Indian Rhinoceros', 'Rhinoceros unicornis', 'FAUNA', 'VULNERABLE', 'The great one-horned rhinoceros is the largest of the three Asian rhinos and is identified by a single black horn and a grey-brown hide with skin folds. They primarily graze on grasses, fruits, leaves, and aquatic plants.', 'Floodplain grasslands and forests', 'Herbivore', '35-45 years', 1),
('Royal Bengal Tiger', 'Panthera tigris tigris', 'FAUNA', 'ENDANGERED', 'The Bengal tiger is the most numerous tiger subspecies and the national animal of both India and Bangladesh. Known for its distinctive orange coat with black stripes, it''s an apex predator playing a crucial role in maintaining ecosystem balance.', 'Tropical forests, mangroves, grasslands', 'Carnivore', '8-10 years in wild', 1),
('Sandalwood Tree', 'Santalum album', 'FLORA', 'VULNERABLE', 'Indian sandalwood is a small tropical tree known for its fragrant heartwood. The aromatic oil extracted from the wood is highly valued in perfumery, cosmetics, and traditional medicine.', 'Dry deciduous forests', 'Photosynthesis', '30-60 years', 2),
('Asian Elephant', 'Elephas maximus', 'FAUNA', 'ENDANGERED', 'The Asian elephant is the largest living land animal in Asia. They are highly intelligent and form deep family bonds. They play a crucial role in maintaining forest ecosystems by creating clearings and dispersing seeds.', 'Forests and grasslands', 'Herbivore', '60-70 years', 1);

-- Insert sample data for campaigns
INSERT INTO campaigns (title, description, target_amount, current_amount, start_date, end_date, status, supporters, park_id) VALUES
('Save the Bengal Tiger', 'Protect the remaining Bengal tiger population through anti-poaching efforts, habitat restoration, and community engagement programs. Your support will fund patrol units, camera traps, and conservation research.', 5000000.00, 3250000.00, '2024-01-01', '2024-12-31', 'ACTIVE', 1247, 1),
('Rhino Conservation Fund', 'Support Kaziranga''s rhino protection units and community engagement programs. Funds will be used for anti-poaching patrols, veterinary care, and habitat management to protect the one-horned rhinoceros.', 2500000.00, 1800000.00, '2024-01-15', '2024-10-15', 'ACTIVE', 892, 1),
('Elephant Corridor Protection', 'Secure and restore critical elephant migration corridors to reduce human-elephant conflict. This initiative will create safe passages and support affected communities with early warning systems.', 3500000.00, 2100000.00, '2024-02-01', '2024-11-30', 'ACTIVE', 756, NULL),
('Mangrove Restoration Project', 'Restore and protect mangrove ecosystems in the Sundarbans to combat climate change and protect coastal communities. This project will plant 100,000 mangrove saplings and monitor their growth.', 1500000.00, 1500000.00, '2024-01-01', '2024-06-15', 'COMPLETED', 543, 4);