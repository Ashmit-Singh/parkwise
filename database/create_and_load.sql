-- Create parks table and load data
-- Run this in pgAdmin Query Tool

-- Create parks table
CREATE TABLE IF NOT EXISTS parks (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url VARCHAR(500),
    conservation_status VARCHAR(100),
    established_year INTEGER,
    area DOUBLE PRECISION,
    best_time_to_visit VARCHAR(255),
    key_attractions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert 30+ Major National Parks and Wildlife Sanctuaries
INSERT INTO parks (name, state, description, area, established_year, latitude, longitude, best_time_to_visit, key_attractions, conservation_status, image_url, created_at) VALUES
-- Tiger Reserves
('Jim Corbett National Park', 'Uttarakhand', 'India''s oldest national park, famous for Bengal tigers and diverse wildlife. Named after legendary hunter-turned-conservationist Jim Corbett.', 520.82, 1936, 29.5317, 78.7750, 'November to June', 'Bengal Tigers, Asian Elephants, Gharials, 600+ bird species', 'Protected', 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600', NOW()),
('Ranthambore National Park', 'Rajasthan', 'One of the best places to spot tigers in their natural habitat. Historic Ranthambore Fort within the park.', 392.00, 1980, 26.0173, 76.5026, 'October to April', 'Bengal Tigers, Leopards, Sloth Bears, Ancient Fort', 'Protected', 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600', NOW()),
('Kanha National Park', 'Madhya Pradesh', 'Inspiration for Rudyard Kipling''s "The Jungle Book". One of India''s largest tiger reserves with sal and bamboo forests.', 940.00, 1955, 22.3344, 80.6114, 'October to June', 'Bengal Tigers, Barasingha (Swamp Deer), Indian Wild Dogs', 'Protected', 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', NOW()),
('Bandhavgarh National Park', 'Madhya Pradesh', 'Highest density of Bengal tigers in India. Ancient fort and caves with inscriptions dating back to 1st century BC.', 448.00, 1968, 23.7000, 80.9833, 'October to June', 'Bengal Tigers, Leopards, White Tigers (historically)', 'Protected', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Pench National Park', 'Madhya Pradesh', 'Another inspiration for "The Jungle Book". Pristine teak forests and rich biodiversity.', 758.00, 1975, 21.6417, 79.2083, 'November to May', 'Bengal Tigers, Leopards, Wild Dogs, 285 bird species', 'Protected', 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=600', NOW()),
('Tadoba Andhari Tiger Reserve', 'Maharashtra', 'Maharashtra''s oldest and largest national park. Excellent tiger sightings and ancient Tadoba temple.', 625.00, 1955, 20.2333, 79.3333, 'October to May', 'Bengal Tigers, Sloth Bears, Leopards, Marsh Crocodiles', 'Protected', 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=600', NOW()),
('Sariska Tiger Reserve', 'Rajasthan', 'Successfully reintroduced tigers after local extinction. Ancient Kankwari Fort and temples within the reserve.', 866.00, 1982, 27.3000, 76.4000, 'November to March', 'Bengal Tigers, Leopards, Nilgai, Sambar Deer', 'Protected', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Panna National Park', 'Madhya Pradesh', 'Successfully recovered from zero tigers through reintroduction program. Ken River flows through the park.', 542.67, 1981, 24.7167, 80.1833, 'November to May', 'Bengal Tigers, Gharials, Vultures, Ken River Waterfalls', 'Protected', 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', NOW()),

-- Unique Wildlife Sanctuaries
('Kaziranga National Park', 'Assam', 'UNESCO World Heritage Site. Home to two-thirds of world''s one-horned rhinoceros population. Elephant grass and wetlands.', 429.96, 1974, 26.5775, 93.1711, 'November to April', 'One-horned Rhinoceros, Wild Water Buffalo, Eastern Swamp Deer', 'UNESCO World Heritage', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW()),
('Gir National Park', 'Gujarat', 'Only natural habitat of Asiatic lions in the world. Successful conservation story with population recovery.', 1412.00, 1965, 21.1333, 70.7833, 'December to March', 'Asiatic Lions, Leopards, Marsh Crocodiles, 300+ bird species', 'Protected', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Hemis National Park', 'Ladakh', 'Largest national park in India. High-altitude habitat for endangered snow leopards in the Himalayas.', 4410.00, 1981, 34.0000, 77.6667, 'May to September', 'Snow Leopards, Tibetan Wolves, Bharal (Blue Sheep)', 'Protected', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', NOW()),
('Great Himalayan National Park', 'Himachal Pradesh', 'UNESCO World Heritage Site. Alpine meadows and temperate forests. Part of Western Himalayas biodiversity hotspot.', 754.00, 1984, 31.7000, 77.6000, 'April to June, September to November', 'Snow Leopards, Himalayan Tahr, Western Tragopan, Musk Deer', 'UNESCO World Heritage', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', NOW()),
('Nanda Devi National Park', 'Uttarakhand', 'UNESCO World Heritage Site. Surrounds India''s second highest peak. Pristine high-altitude ecosystem.', 630.33, 1982, 30.4167, 79.8833, 'May to October', 'Snow Leopards, Himalayan Musk Deer, Bharal, Alpine Flora', 'UNESCO World Heritage', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', NOW()),

-- Southern Parks
('Periyar National Park', 'Kerala', 'Famous for elephant and tiger sightings. Artificial lake created by Mullaperiyar Dam. Spice plantations nearby.', 777.00, 1982, 9.4647, 77.2350, 'September to March', 'Asian Elephants, Bengal Tigers, Nilgiri Tahr, Boat Safaris', 'Protected', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW()),
('Bandipur National Park', 'Karnataka', 'Part of Nilgiri Biosphere Reserve. Connects with Nagarhole, Mudumalai, and Wayanad to form largest protected area in South India.', 874.20, 1974, 11.6667, 76.5833, 'October to May', 'Bengal Tigers, Asian Elephants, Indian Gaur, Dholes', 'Protected', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Nagarhole National Park', 'Karnataka', 'Also known as Rajiv Gandhi National Park. Rich in wildlife with high density of herbivores and predators.', 643.39, 1988, 12.0000, 76.1167, 'October to May', 'Bengal Tigers, Asian Elephants, Leopards, Kabini River', 'Protected', 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', NOW()),
('Mudumalai National Park', 'Tamil Nadu', 'First wildlife sanctuary in South India. Part of Nilgiri Biosphere Reserve. Connects Tamil Nadu, Karnataka, and Kerala.', 321.00, 1940, 11.5833, 76.5333, 'October to May', 'Asian Elephants, Bengal Tigers, Indian Gaur, 266 bird species', 'Protected', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW()),
('Silent Valley National Park', 'Kerala', 'Last remaining rainforest in India. No cicadas, hence "silent". Part of Nilgiri Biosphere Reserve.', 89.52, 1984, 11.0833, 76.4500, 'December to April', 'Lion-tailed Macaques, Nilgiri Tahr, Malabar Giant Squirrel', 'Protected', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', NOW()),

-- Eastern and Northeastern Parks
('Sundarbans National Park', 'West Bengal', 'UNESCO World Heritage Site. Largest mangrove forest in the world. Royal Bengal tigers adapted to swimming.', 1330.10, 1984, 21.9497, 88.9019, 'September to March', 'Royal Bengal Tigers, Saltwater Crocodiles, Gangetic Dolphins', 'UNESCO World Heritage', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', NOW()),
('Manas National Park', 'Assam', 'UNESCO World Heritage Site. Project Tiger Reserve and Elephant Reserve. Foothills of Eastern Himalayas.', 500.00, 1990, 26.7167, 90.9667, 'November to April', 'Bengal Tigers, Indian Elephants, Pygmy Hogs, Golden Langurs', 'UNESCO World Heritage', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Nameri National Park', 'Assam', 'Located in foothills of Eastern Himalayas. Jia Bhoroli River flows through the park. White-water rafting destination.', 200.00, 1998, 27.0000, 92.8333, 'November to April', 'Bengal Tigers, Elephants, White-winged Wood Ducks, River Rafting', 'Protected', 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', NOW()),
('Dibru-Saikhowa National Park', 'Assam', 'Wetland ecosystem with semi-evergreen forests. Important for feral horses and water birds.', 340.00, 1999, 27.5833, 95.3333, 'November to April', 'Feral Horses, White-winged Wood Ducks, Gangetic Dolphins', 'Protected', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', NOW()),

-- Central Indian Parks
('Satpura National Park', 'Madhya Pradesh', 'Unique topography with deep valleys and high hills. Walking safaris and boat safaris available.', 585.00, 1981, 22.5000, 78.5000, 'October to June', 'Bengal Tigers, Leopards, Indian Giant Squirrels, Walking Safaris', 'Protected', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Panna National Park', 'Madhya Pradesh', 'Diamond mining region. Successfully recovered tiger population through reintroduction. Pandav Falls and caves.', 542.67, 1981, 24.7167, 80.1833, 'November to May', 'Bengal Tigers, Gharials, Vultures, Diamond Mines', 'Protected', 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', NOW()),

-- Desert and Arid Regions
('Desert National Park', 'Rajasthan', 'One of largest national parks in India. Thar Desert ecosystem. Important for Great Indian Bustard conservation.', 3162.00, 1981, 26.9167, 71.6000, 'November to January', 'Great Indian Bustard, Desert Fox, Blackbuck, Sand Dunes', 'Critical', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600', NOW()),
('Blackbuck National Park', 'Gujarat', 'Velavadar grasslands. Largest population of blackbucks in India. Winter home for harriers.', 34.08, 1976, 21.8833, 72.1333, 'October to March', 'Blackbucks, Lesser Florican, Harriers, Indian Wolves', 'Protected', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),

-- Marine and Coastal
('Gulf of Mannar Marine National Park', 'Tamil Nadu', 'First marine national park in India. 21 islands with coral reefs. Rich marine biodiversity.', 560.00, 1986, 9.0500, 79.1167, 'October to March', 'Coral Reefs, Dugongs, Sea Turtles, Dolphins, 450+ fish species', 'Protected', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600', NOW()),
('Sundarbans National Park', 'West Bengal', 'Largest tidal mangrove forest. Swimming tigers and saltwater crocodiles. UNESCO World Heritage Site.', 1330.10, 1984, 21.9497, 88.9019, 'September to March', 'Swimming Tigers, Saltwater Crocodiles, Fishing Cats', 'UNESCO World Heritage', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', NOW()),

-- Island Ecosystems
('Campbell Bay National Park', 'Andaman and Nicobar', 'Tropical rainforest on Great Nicobar Island. Megapode nesting grounds. Pristine beaches.', 426.23, 1992, 7.0000, 93.9167, 'November to April', 'Nicobar Megapode, Saltwater Crocodiles, Leatherback Turtles', 'Protected', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600', NOW()),
('Mahatma Gandhi Marine National Park', 'Andaman and Nicobar', 'Coral reefs and mangrove creeks. Glass-bottom boat rides. Snorkeling and scuba diving.', 281.50, 1983, 11.5833, 92.6333, 'November to April', 'Coral Reefs, Sea Turtles, Tropical Fish, Mangroves', 'Protected', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600', NOW()),

-- Unique Ecosystems
('Keibul Lamjao National Park', 'Manipur', 'World''s only floating national park. Phumdis (floating vegetation). Home to endangered Sangai deer.', 40.00, 1977, 24.5167, 93.8333, 'November to March', 'Sangai (Dancing Deer), Floating Biomass, Loktak Lake', 'Critical', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', NOW()),
('Valley of Flowers National Park', 'Uttarakhand', 'UNESCO World Heritage Site. Alpine flowers bloom in summer. Trekking destination with stunning landscapes.', 87.50, 1982, 30.7167, 79.6000, 'June to September', 'Alpine Flowers, Snow Leopards, Himalayan Black Bears, Trekking', 'UNESCO World Heritage', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600', NOW());

-- Verify data loaded
SELECT COUNT(*) as total_parks FROM parks;
SELECT name, state FROM parks ORDER BY name;
