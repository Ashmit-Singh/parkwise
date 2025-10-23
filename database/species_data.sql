-- Species Data for ParkWise Platform
-- Comprehensive list of Indian wildlife species

-- Create species table if not exists
CREATE TABLE IF NOT EXISTS species (
    id BIGSERIAL PRIMARY KEY,
    common_name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255) NOT NULL,
    conservation_status VARCHAR(100),
    description TEXT,
    habitat TEXT,
    population_estimate INTEGER,
    threats TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Major Indian Wildlife Species
INSERT INTO species (common_name, scientific_name, conservation_status, description, habitat, population_estimate, threats, category, image_url, created_at) VALUES

-- Big Cats
('Bengal Tiger', 'Panthera tigris tigris', 'Endangered', 'The Bengal tiger is the most numerous tiger subspecies in India. Known for its distinctive orange coat with black stripes.', 'Tropical forests, grasslands, and mangroves', 2967, 'Habitat loss, poaching, human-wildlife conflict', 'Mammal', 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600', NOW()),
('Asiatic Lion', 'Panthera leo persica', 'Endangered', 'Once widespread across Asia, now found only in Gir Forest, Gujarat. Smaller than African lions with distinctive belly fold.', 'Dry deciduous forests and grasslands', 674, 'Limited habitat, disease, inbreeding', 'Mammal', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Indian Leopard', 'Panthera pardus fusca', 'Vulnerable', 'Highly adaptable big cat found across India. Known for its rosette-patterned coat and ability to live near human settlements.', 'Forests, grasslands, rocky terrains', 12000, 'Habitat fragmentation, poaching, human-wildlife conflict', 'Mammal', 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=600', NOW()),
('Snow Leopard', 'Panthera uncia', 'Vulnerable', 'Elusive high-altitude predator of the Himalayas. Thick fur and long tail for balance on rocky terrain.', 'Alpine and subalpine zones (3000-5400m)', 450, 'Climate change, poaching, prey depletion', 'Mammal', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', NOW()),
('Clouded Leopard', 'Neofelis nebulosa', 'Vulnerable', 'Medium-sized wild cat with distinctive cloud-like markings. Excellent climber with longest canine teeth relative to body size.', 'Dense tropical forests of Northeast India', 10000, 'Deforestation, poaching for fur and bones', 'Mammal', 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=600', NOW()),

-- Herbivores
('Indian Elephant', 'Elephas maximus indicus', 'Endangered', 'Largest land animal in Asia. Highly intelligent with complex social structures. Keystone species in forest ecosystems.', 'Tropical forests, grasslands, and scrublands', 27000, 'Habitat loss, human-elephant conflict, poaching', 'Mammal', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW()),
('One-horned Rhinoceros', 'Rhinoceros unicornis', 'Vulnerable', 'Largest of the three Asian rhino species. Single black horn and thick, folded skin. Conservation success story.', 'Tall grasslands and riverine forests', 3700, 'Poaching for horn, habitat loss, flooding', 'Mammal', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Gaur (Indian Bison)', 'Bos gaurus', 'Vulnerable', 'Largest extant bovine species. Muscular build with distinctive white stockings. Important prey for tigers.', 'Evergreen and deciduous forests', 13000, 'Habitat loss, disease from domestic cattle', 'Mammal', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW()),
('Barasingha (Swamp Deer)', 'Rucervus duvaucelii', 'Vulnerable', 'Wetland deer with antlers having 12 or more tines. Name means "twelve-horned" in Hindi.', 'Swamps and grasslands', 5000, 'Habitat loss, hunting, disease', 'Mammal', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Nilgiri Tahr', 'Nilgiritragus hylocrius', 'Endangered', 'Mountain goat endemic to Western Ghats. Males have distinctive curved horns and dark coat.', 'Montane grasslands (1200-2600m)', 3000, 'Habitat loss, poaching, competition with livestock', 'Mammal', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', NOW()),

-- Primates
('Lion-tailed Macaque', 'Macaca silenus', 'Endangered', 'Endemic to Western Ghats rainforests. Distinctive silver mane around face. Arboreal lifestyle.', 'Tropical rainforests', 4000, 'Habitat fragmentation, hunting', 'Mammal', 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600', NOW()),
('Golden Langur', 'Trachypithecus geei', 'Endangered', 'Rare primate found in Assam and Bhutan. Golden to cream-colored fur. Lives in small family groups.', 'Moist evergreen and semi-evergreen forests', 6000, 'Habitat loss, hunting, fragmentation', 'Mammal', 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600', NOW()),
('Hoolock Gibbon', 'Hoolock hoolock', 'Endangered', 'Only ape species found in India. Lives in canopy, rarely descends to ground. Monogamous pairs.', 'Tropical rainforests of Northeast India', 5000, 'Deforestation, hunting, pet trade', 'Mammal', 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600', NOW()),

-- Birds
('Great Indian Bustard', 'Ardeotis nigriceps', 'Critically Endangered', 'One of heaviest flying birds. Grassland specialist. Flagship species for grassland conservation.', 'Arid and semi-arid grasslands', 150, 'Habitat loss, power line collisions, hunting', 'Bird', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600', NOW()),
('Bengal Florican', 'Houbaropsis bengalensis', 'Critically Endangered', 'Small bustard found in grasslands. Males perform spectacular display flights during breeding.', 'Tall grasslands and floodplains', 1000, 'Grassland conversion, hunting', 'Bird', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600', NOW()),
('Indian Vulture', 'Gyps indicus', 'Critically Endangered', 'Scavenger that plays crucial role in ecosystem. Population crashed due to veterinary drug diclofenac.', 'Open country and human settlements', 12000, 'Diclofenac poisoning, habitat loss', 'Bird', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600', NOW()),
('Himalayan Quail', 'Ophrysia superciliosa', 'Critically Endangered', 'Possibly extinct. Last confirmed sighting in 1876. Small quail from Western Himalayas.', 'Steep hillsides with long grass', 0, 'Habitat loss, possibly extinct', 'Bird', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600', NOW()),
('Forest Owlet', 'Heteroglaux blewitti', 'Endangered', 'Small owl rediscovered in 1997 after 113 years. Endemic to central India.', 'Dry deciduous forests', 1000, 'Habitat loss, fragmentation', 'Bird', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600', NOW()),

-- Reptiles
('Gharial', 'Gavialis gangeticus', 'Critically Endangered', 'Fish-eating crocodile with distinctive long, thin snout. Males have bulbous growth on snout tip.', 'Rivers with sandy banks', 650, 'River pollution, fishing nets, sand mining', 'Reptile', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Saltwater Crocodile', 'Crocodylus porosus', 'Least Concern', 'Largest living reptile. Found in Sundarbans and Andaman & Nicobar Islands. Excellent swimmers.', 'Mangroves, estuaries, and coastal waters', 5000, 'Habitat loss, human conflict', 'Reptile', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Indian Star Tortoise', 'Geochelone elegans', 'Vulnerable', 'Beautiful tortoise with star-patterned shell. Popular in illegal pet trade.', 'Dry scrublands and grasslands', 50000, 'Pet trade, habitat loss', 'Reptile', 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600', NOW()),
('King Cobra', 'Ophiophagus hannah', 'Vulnerable', 'World''s longest venomous snake. Feeds primarily on other snakes. Builds nest for eggs.', 'Dense forests and bamboo thickets', 10000, 'Habitat loss, persecution, pet trade', 'Reptile', 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600', NOW()),

-- Marine Species
('Dugong', 'Dugong dugon', 'Vulnerable', 'Marine mammal, only herbivorous marine mammal. Found in Gulf of Mannar and Andaman waters.', 'Shallow coastal waters with seagrass', 200, 'Fishing nets, boat strikes, habitat degradation', 'Mammal', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600', NOW()),
('Olive Ridley Turtle', 'Lepidochelys olivacea', 'Vulnerable', 'Smallest sea turtle. Mass nesting (arribada) on Odisha coast. Thousands nest together.', 'Tropical and warm oceans', 800000, 'Fishing nets, beach development, pollution', 'Reptile', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600', NOW()),
('Gangetic Dolphin', 'Platanista gangetica', 'Endangered', 'Freshwater dolphin, essentially blind, uses echolocation. National aquatic animal of India.', 'Ganges, Brahmaputra river systems', 3500, 'River pollution, dams, fishing nets', 'Mammal', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600', NOW()),

-- Small Mammals
('Rusty-spotted Cat', 'Prionailurus rubiginosus', 'Near Threatened', 'One of world''s smallest wild cats. Excellent climber, hunts birds and rodents.', 'Dry deciduous forests and grasslands', 10000, 'Habitat loss, persecution', 'Mammal', 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=600', NOW()),
('Red Panda', 'Ailurus fulgens', 'Endangered', 'Arboreal mammal, not closely related to giant panda. Bamboo specialist in Eastern Himalayas.', 'Temperate forests with bamboo (2200-4800m)', 10000, 'Habitat loss, poaching, climate change', 'Mammal', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW()),
('Indian Pangolin', 'Manis crassicaudata', 'Endangered', 'Scaly anteater, only mammal with scales. Nocturnal, feeds on ants and termites.', 'Grasslands and forests', 100000, 'Poaching for scales and meat, habitat loss', 'Mammal', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW()),
('Malabar Giant Squirrel', 'Ratufa indica', 'Least Concern', 'Large, colorful squirrel endemic to Western Ghats. Vibrant purple, orange, and black fur.', 'Tropical evergreen forests', 10000, 'Habitat loss, hunting', 'Mammal', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW()),

-- Unique Species
('Sangai (Brow-antlered Deer)', 'Rucervus eldii eldii', 'Endangered', 'Endemic to Manipur, found only in Keibul Lamjao floating national park. State animal of Manipur.', 'Floating biomass (phumdis) on Loktak Lake', 260, 'Habitat loss, hunting, habitat degradation', 'Mammal', 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600', NOW()),
('Pygmy Hog', 'Porcula salvania', 'Critically Endangered', 'World''s smallest wild pig. Builds elaborate nests. Found only in Assam grasslands.', 'Tall grasslands', 250, 'Grassland burning, habitat loss', 'Mammal', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW()),
('Namdapha Flying Squirrel', 'Biswamoyopterus biswasi', 'Critically Endangered', 'Known from single specimen collected in 1981. One of rarest mammals in the world.', 'Tropical forests of Arunachal Pradesh', 0, 'Habitat loss, possibly extinct', 'Mammal', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', NOW());

-- Verify data loaded
SELECT COUNT(*) as total_species FROM species;
SELECT common_name, conservation_status FROM species ORDER BY conservation_status, common_name;
