-- Quick Test: Add 10 Parks (Copy and paste this entire script into pgAdmin)

INSERT INTO parks (name, state, description, area, established_year, latitude, longitude, created_at) VALUES
('Jim Corbett National Park', 'Uttarakhand', 'India''s oldest national park, famous for Bengal tigers and diverse wildlife', 520.82, 1936, 29.5317, 78.7750, NOW()),
('Ranthambore National Park', 'Rajasthan', 'One of the largest national parks known for tiger sightings', 392.00, 1980, 26.0173, 76.5026, NOW()),
('Kaziranga National Park', 'Assam', 'UNESCO World Heritage Site, home to one-horned rhinoceros', 429.96, 1974, 26.5775, 93.1711, NOW()),
('Kanha National Park', 'Madhya Pradesh', 'Inspiration for Rudyard Kipling''s The Jungle Book', 940.00, 1955, 22.3344, 80.6114, NOW()),
('Gir National Park', 'Gujarat', 'Only natural habitat of Asiatic lions in the world', 1412.00, 1965, 21.1333, 70.7833, NOW()),
('Periyar National Park', 'Kerala', 'Famous elephant and tiger reserve around Periyar Lake', 777.00, 1982, 9.4647, 77.2350, NOW()),
('Sundarbans National Park', 'West Bengal', 'Largest mangrove forest and home to Bengal tigers', 1330.10, 1984, 21.9497, 88.9019, NOW()),
('Bandipur National Park', 'Karnataka', 'Part of Nilgiri Biosphere Reserve with rich biodiversity', 874.20, 1974, 11.6667, 76.5833, NOW()),
('Hemis National Park', 'Ladakh', 'Largest national park in India, habitat for snow leopards', 4410.00, 1981, 34.0000, 77.6667, NOW()),
('Tadoba National Park', 'Maharashtra', 'Maharashtra''s oldest and largest park with excellent tiger sightings', 625.00, 1955, 20.2333, 79.3333, NOW());

-- Verify the data was inserted
SELECT COUNT(*) as total_parks FROM parks;
SELECT name, state FROM parks ORDER BY name LIMIT 10;
