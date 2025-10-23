-- Conservation Campaigns Data for ParkWise Platform
-- Real and realistic conservation campaigns across India

-- Create campaigns table if not exists
CREATE TABLE IF NOT EXISTS campaigns (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2),
    current_amount DECIMAL(12,2) DEFAULT 0,
    donors INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    image_url VARCHAR(500),
    impact_statement TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Conservation Campaigns
INSERT INTO campaigns (title, description, target_amount, current_amount, donors, start_date, end_date, location, category, status, image_url, impact_statement, created_at) VALUES

-- Tiger Conservation
('Save the Bengal Tigers', 'Help protect the majestic Bengal tigers in Sundarbans National Park through habitat restoration, anti-poaching initiatives, and community engagement programs.', 500000, 387500, 1247, '2024-01-15', '2025-06-30', 'Sundarbans, West Bengal', 'Wildlife Protection', 'active', 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600', '250+ tigers protected, 15 villages engaged', NOW()),

('Ranthambore Tiger Corridor', 'Create safe wildlife corridors connecting Ranthambore with surrounding forests to reduce human-tiger conflict and enable genetic diversity.', 750000, 520000, 892, '2024-02-01', '2025-08-31', 'Ranthambore, Rajasthan', 'Habitat Restoration', 'active', 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600', '50 km corridor established, 8 villages relocated', NOW()),

('Kanha Tiger Monitoring', 'Deploy advanced camera traps and GPS collars to monitor tiger movements and behavior in Kanha National Park for better conservation strategies.', 350000, 285000, 654, '2024-03-10', '2025-05-15', 'Kanha, Madhya Pradesh', 'Research & Monitoring', 'active', 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', '45 tigers monitored, 200+ camera traps deployed', NOW()),

-- Elephant Conservation
('Elephant Corridor Restoration', 'Create safe migration corridors for elephants in Karnataka to reduce human-wildlife conflict and protect elephant populations across fragmented habitats.', 850000, 680000, 1523, '2023-11-01', '2025-03-31', 'Karnataka', 'Habitat Restoration', 'active', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', '3 corridors restored, 500+ elephants benefited', NOW()),

('Assam Elephant Rescue', 'Establish rescue and rehabilitation centers for injured and orphaned elephants in Assam. Provide medical care and eventual release back to wild.', 450000, 320000, 876, '2024-01-20', '2025-07-20', 'Assam', 'Wildlife Rescue', 'active', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', '12 elephants rescued, 8 successfully released', NOW()),

-- Rhinoceros Conservation
('Kaziranga Rhino Protection', 'Strengthen anti-poaching measures in Kaziranga National Park with advanced surveillance technology and trained forest guards.', 600000, 450000, 1089, '2024-02-15', '2025-09-30', 'Kaziranga, Assam', 'Anti-Poaching', 'active', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', '100+ rhinos protected, zero poaching incidents', NOW()),

-- Lion Conservation
('Gir Lion Habitat Expansion', 'Expand protected habitat for Asiatic lions in Gujarat and establish satellite populations to reduce disease risk and genetic bottleneck.', 950000, 720000, 1456, '2023-12-01', '2025-11-30', 'Gir, Gujarat', 'Habitat Expansion', 'active', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', '200 sq km habitat added, 50+ lions relocated', NOW()),

-- Bird Conservation
('Save the Great Indian Bustard', 'Critical conservation program for critically endangered Great Indian Bustard. Install bird diverters on power lines and protect breeding sites.', 400000, 280000, 723, '2024-03-01', '2025-12-31', 'Rajasthan & Gujarat', 'Species Recovery', 'active', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600', '30 km power lines marked, 15 breeding sites protected', NOW()),

('Vulture Conservation Program', 'Establish vulture safe zones and breeding centers to recover critically endangered vulture populations affected by diclofenac poisoning.', 550000, 385000, 967, '2024-01-10', '2025-10-31', 'Multiple States', 'Species Recovery', 'active', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600', '500+ vultures bred, 20 safe zones created', NOW()),

-- Marine Conservation
('Gulf of Mannar Coral Restoration', 'Restore damaged coral reefs in Gulf of Mannar Marine National Park through coral transplantation and community-based conservation.', 650000, 480000, 1234, '2024-02-20', '2025-08-20', 'Tamil Nadu', 'Marine Conservation', 'active', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600', '5000 coral fragments planted, 10 reefs restored', NOW()),

('Olive Ridley Turtle Protection', 'Protect mass nesting sites of Olive Ridley turtles on Odisha coast. Monitor nesting, protect eggs, and reduce fishing net casualties.', 420000, 350000, 845, '2023-11-15', '2025-04-30', 'Odisha Coast', 'Marine Conservation', 'active', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600', '50,000+ hatchlings released, 15 km beach protected', NOW()),

-- Habitat Restoration
('Mangrove Reforestation', 'Plant 100,000 mangrove trees to restore coastal ecosystems and protect wildlife in the Sundarbans delta region.', 300000, 300000, 2341, '2023-06-01', '2024-12-31', 'Sundarbans, West Bengal', 'Habitat Restoration', 'completed', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', '100,000 trees planted, 50 sq km restored', NOW()),

('Western Ghats Forest Restoration', 'Restore degraded forest patches in Western Ghats biodiversity hotspot through native species plantation and invasive species removal.', 800000, 620000, 1567, '2024-01-05', '2025-12-31', 'Western Ghats', 'Habitat Restoration', 'active', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', '100 hectares restored, 50,000 native trees planted', NOW()),

('Grassland Conservation', 'Protect and restore grassland ecosystems critical for Great Indian Bustard, blackbucks, and other grassland species.', 450000, 310000, 789, '2024-02-10', '2025-09-30', 'Rajasthan & Gujarat', 'Habitat Restoration', 'active', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600', '5000 hectares protected, invasive species removed', NOW()),

-- Community-Based Conservation
('Tribal Communities Wildlife Guardians', 'Empower tribal communities living near forests to become wildlife guardians through training, equipment, and sustainable livelihood programs.', 550000, 420000, 1123, '2024-01-15', '2025-07-15', 'Multiple States', 'Community Engagement', 'active', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600', '500 guardians trained, 20 villages engaged', NOW()),

('Human-Wildlife Conflict Mitigation', 'Install solar fences, early warning systems, and compensation schemes to reduce human-wildlife conflict in high-risk areas.', 700000, 540000, 1345, '2024-02-01', '2025-11-30', 'Multiple States', 'Conflict Resolution', 'active', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600', '50 villages protected, 200 km fencing installed', NOW()),

-- Snow Leopard Conservation
('Himalayan Snow Leopard Project', 'Protect endangered snow leopards in high-altitude Himalayas through community-based conservation and livestock insurance programs.', 650000, 480000, 1089, '2024-03-01', '2025-12-31', 'Ladakh & Himachal Pradesh', 'Wildlife Protection', 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', '50+ snow leopards monitored, 30 villages engaged', NOW()),

-- Primate Conservation
('Lion-tailed Macaque Habitat', 'Protect remaining rainforest habitat of endangered lion-tailed macaques in Western Ghats through land acquisition and restoration.', 550000, 390000, 876, '2024-01-20', '2025-08-31', 'Kerala & Karnataka', 'Habitat Protection', 'active', 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600', '500 hectares protected, 200+ macaques benefited', NOW()),

-- Freshwater Conservation
('Gangetic Dolphin Recovery', 'Protect critically endangered Gangetic dolphins through river clean-up, fishing net regulation, and community awareness programs.', 480000, 340000, 923, '2024-02-15', '2025-10-31', 'Ganges River Basin', 'Aquatic Conservation', 'active', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600', '100+ dolphins monitored, 50 km river cleaned', NOW()),

('Gharial Breeding Program', 'Establish breeding centers and release programs for critically endangered gharials in major river systems.', 420000, 310000, 734, '2024-01-10', '2025-09-30', 'Multiple River Systems', 'Species Recovery', 'active', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', '200 gharials bred and released', NOW()),

-- Research & Education
('Wildlife Research Grants', 'Fund cutting-edge research on endangered species behavior, genetics, and conservation strategies across India.', 600000, 450000, 1234, '2024-01-01', '2025-12-31', 'Pan-India', 'Research & Monitoring', 'active', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600', '25 research projects funded, 50+ researchers supported', NOW()),

('Conservation Education Program', 'Develop and implement conservation education curriculum in schools near protected areas to create next generation of conservationists.', 350000, 280000, 1567, '2024-02-01', '2025-07-31', 'Multiple States', 'Education & Awareness', 'active', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600', '100 schools reached, 10,000+ students educated', NOW()),

-- Completed Campaigns
('Red Panda Conservation', 'Successfully protected red panda habitat in Sikkim and established monitoring network across Eastern Himalayas.', 400000, 400000, 1876, '2023-03-01', '2024-11-30', 'Sikkim & Arunachal Pradesh', 'Wildlife Protection', 'completed', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', '1000+ red pandas monitored, habitat secured', NOW()),

('Nilgiri Tahr Recovery', 'Completed habitat restoration and population monitoring of endangered Nilgiri tahr in Western Ghats.', 350000, 350000, 1234, '2023-01-15', '2024-10-31', 'Tamil Nadu & Kerala', 'Species Recovery', 'completed', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', 'Population increased by 15%, 500 hectares restored', NOW()),

('Sangai Deer Habitat Protection', 'Successfully protected floating biomass habitat of critically endangered Sangai deer in Manipur.', 300000, 300000, 987, '2023-02-01', '2024-09-30', 'Manipur', 'Habitat Protection', 'completed', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', 'Population stable at 260, habitat secured', NOW());

-- Verify data loaded
SELECT COUNT(*) as total_campaigns FROM campaigns;
SELECT title, status, current_amount, target_amount FROM campaigns ORDER BY status, created_at DESC;
