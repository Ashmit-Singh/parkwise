-- Species Seed Data (100+ Species)
INSERT INTO species (common_name, scientific_name, category, conservation_status, description, habitat, created_at) VALUES
-- Mammals - Big Cats
('Bengal Tiger', 'Panthera tigris tigris', 'MAMMAL', 'ENDANGERED', 'Most numerous tiger subspecies with orange coat and black stripes', 'Tropical forests, grasslands, mangroves', NOW()),
('Asiatic Lion', 'Panthera leo persica', 'MAMMAL', 'ENDANGERED', 'Found only in Gir Forest, smaller than African lions', 'Dry deciduous forests', NOW()),
('Indian Leopard', 'Panthera pardus fusca', 'MAMMAL', 'VULNERABLE', 'Adaptable big cat with spotted coat', 'Forests, grasslands, rocky terrain', NOW()),
('Snow Leopard', 'Panthera uncia', 'MAMMAL', 'VULNERABLE', 'Mountain cat with thick fur adapted to high altitude', 'Alpine zones above 3000m', NOW()),
('Clouded Leopard', 'Neofelis nebulosa', 'MAMMAL', 'VULNERABLE', 'Medium cat with cloud-like markings, excellent climber', 'Tropical evergreen forests', NOW()),
-- Mammals - Elephants & Rhinos
('Indian Elephant', 'Elephas maximus indicus', 'MAMMAL', 'ENDANGERED', 'Smaller than African elephants, highly intelligent', 'Tropical forests, grasslands', NOW()),
('Indian Rhinoceros', 'Rhinoceros unicornis', 'MAMMAL', 'VULNERABLE', 'Greater one-horned rhino with thick folded skin', 'Grasslands, riverine forests', NOW()),
-- Mammals - Primates
('Lion-tailed Macaque', 'Macaca silenus', 'MAMMAL', 'ENDANGERED', 'Endemic to Western Ghats with silver-white mane', 'Tropical rainforests', NOW()),
('Nilgiri Langur', 'Trachypithecus johnii', 'MAMMAL', 'VULNERABLE', 'Black-furred monkey with orange-brown head', 'Evergreen forests', NOW()),
('Golden Langur', 'Trachypithecus geei', 'MAMMAL', 'ENDANGERED', 'Rare primate with golden fur', 'Tropical forests', NOW()),
('Hoolock Gibbon', 'Hoolock hoolock', 'MAMMAL', 'ENDANGERED', 'Only ape species in India', 'Tropical evergreen forests', NOW()),
-- Mammals - Deer & Antelope
('Barasingha', 'Rucervus duvaucelii', 'MAMMAL', 'VULNERABLE', 'Swamp deer with 12+ tine antlers', 'Swamps and grasslands', NOW()),
('Hangul', 'Cervus hanglu hanglu', 'MAMMAL', 'CRITICALLY_ENDANGERED', 'Kashmir stag, state animal of J&K', 'Dense riverine forests', NOW()),
('Nilgiri Tahr', 'Nilgiritragus hylocrius', 'MAMMAL', 'ENDANGERED', 'Mountain goat endemic to Nilgiri Hills', 'Mountain grasslands', NOW()),
('Blackbuck', 'Antilope cervicapra', 'MAMMAL', 'LEAST_CONCERN', 'Graceful antelope with spiral horns', 'Grasslands, open plains', NOW()),
('Chinkara', 'Gazella bennettii', 'MAMMAL', 'LEAST_CONCERN', 'Indian gazelle adapted to arid environments', 'Deserts, dry grasslands', NOW()),
('Sambar Deer', 'Rusa unicolor', 'MAMMAL', 'VULNERABLE', 'Largest Indian deer with shaggy coat', 'Tropical forests', NOW()),
('Spotted Deer', 'Axis axis', 'MAMMAL', 'LEAST_CONCERN', 'Chital with white spots on reddish coat', 'Forests and grasslands', NOW()),
-- Mammals - Bears
('Sloth Bear', 'Melursus ursinus', 'MAMMAL', 'VULNERABLE', 'Shaggy bear with long snout for eating termites', 'Forests and grasslands', NOW()),
('Himalayan Brown Bear', 'Ursus arctos isabellinus', 'MAMMAL', 'CRITICALLY_ENDANGERED', 'Large bear in high Himalayas', 'Alpine meadows', NOW()),
('Himalayan Black Bear', 'Ursus thibetanus', 'MAMMAL', 'VULNERABLE', 'Black bear with white chest V-mark', 'Himalayan forests', NOW()),
-- Mammals - Canids
('Red Panda', 'Ailurus fulgens', 'MAMMAL', 'ENDANGERED', 'Arboreal mammal with reddish-brown fur', 'Temperate forests with bamboo', NOW()),
('Indian Wild Dog', 'Cuon alpinus', 'MAMMAL', 'ENDANGERED', 'Dhole hunting in packs with whistling calls', 'Forests and grasslands', NOW()),
('Indian Wolf', 'Canis lupus pallipes', 'MAMMAL', 'ENDANGERED', 'Smaller wolf subspecies', 'Grasslands, scrublands', NOW()),
('Bengal Fox', 'Vulpes bengalensis', 'MAMMAL', 'LEAST_CONCERN', 'Small fox endemic to Indian subcontinent', 'Grasslands, semi-arid areas', NOW()),
-- Mammals - Small Carnivores
('Jungle Cat', 'Felis chaus', 'MAMMAL', 'LEAST_CONCERN', 'Medium-sized wild cat', 'Grasslands, wetlands', NOW()),
('Fishing Cat', 'Prionailurus viverrinus', 'MAMMAL', 'VULNERABLE', 'Cat adapted to catching fish', 'Wetlands, mangroves', NOW()),
('Rusty-spotted Cat', 'Prionailurus rubiginosus', 'MAMMAL', 'NEAR_THREATENED', 'One of smallest wild cats', 'Dry forests, grasslands', NOW()),
('Indian Grey Mongoose', 'Herpestes edwardsii', 'MAMMAL', 'LEAST_CONCERN', 'Snake-killing mongoose', 'Various habitats', NOW()),
-- Mammals - Ungulates
('Wild Boar', 'Sus scrofa', 'MAMMAL', 'LEAST_CONCERN', 'Adaptable pig species', 'Forests, grasslands', NOW()),
('Indian Gaur', 'Bos gaurus', 'MAMMAL', 'VULNERABLE', 'Largest wild cattle species', 'Forests and grasslands', NOW()),
('Wild Water Buffalo', 'Bubalus arnee', 'MAMMAL', 'ENDANGERED', 'Ancestor of domestic buffalo', 'Wetlands and grasslands', NOW()),
-- Birds - National & State Birds
('Indian Peafowl', 'Pavo cristatus', 'BIRD', 'LEAST_CONCERN', 'National bird with spectacular tail display', 'Forests, grasslands', NOW()),
('Great Indian Bustard', 'Ardeotis nigriceps', 'BIRD', 'CRITICALLY_ENDANGERED', 'One of heaviest flying birds, <150 left', 'Grasslands, semi-arid', NOW()),
-- Birds - Raptors
('Himalayan Griffon', 'Gyps himalayensis', 'BIRD', 'NEAR_THREATENED', 'Large vulture, 3m wingspan', 'Mountains, high plateaus', NOW()),
('White-rumped Vulture', 'Gyps bengalensis', 'BIRD', 'CRITICALLY_ENDANGERED', 'Critically endangered due to diclofenac', 'Open country', NOW()),
('Indian Vulture', 'Gyps indicus', 'BIRD', 'CRITICALLY_ENDANGERED', 'Long-billed vulture', 'Open and semi-open areas', NOW()),
('Steppe Eagle', 'Aquila nipalensis', 'BIRD', 'ENDANGERED', 'Large migratory eagle', 'Grasslands', NOW()),
('Greater Spotted Eagle', 'Clanga clanga', 'BIRD', 'VULNERABLE', 'Medium-sized eagle', 'Wetlands, grasslands', NOW()),
('Crested Serpent Eagle', 'Spilornis cheela', 'BIRD', 'LEAST_CONCERN', 'Forest raptor hunting reptiles', 'Forests', NOW()),
-- Birds - Cranes
('Siberian Crane', 'Leucogeranus leucogeranus', 'BIRD', 'CRITICALLY_ENDANGERED', 'White crane from Siberia', 'Wetlands', NOW()),
('Sarus Crane', 'Antigone antigone', 'BIRD', 'VULNERABLE', 'Tallest flying bird, mates for life', 'Wetlands, fields', NOW()),
('Demoiselle Crane', 'Grus virgo', 'BIRD', 'LEAST_CONCERN', 'Smallest crane species', 'Grasslands', NOW()),
('Common Crane', 'Grus grus', 'BIRD', 'LEAST_CONCERN', 'Large migratory crane', 'Wetlands', NOW()),
-- Birds - Bustards
('Lesser Florican', 'Sypheotides indicus', 'BIRD', 'ENDANGERED', 'Small bustard with breeding display', 'Grasslands', NOW()),
('Bengal Florican', 'Houbaropsis bengalensis', 'BIRD', 'CRITICALLY_ENDANGERED', 'Rare bustard in grasslands', 'Grasslands', NOW()),
-- Birds - Water Birds
('Spot-billed Pelican', 'Pelecanus philippensis', 'BIRD', 'NEAR_THREATENED', 'Large water bird with spotted bill', 'Lakes, rivers', NOW()),
('Greater Flamingo', 'Phoenicopterus roseus', 'BIRD', 'LEAST_CONCERN', 'Tall pink wading bird', 'Saline wetlands', NOW()),
('Lesser Flamingo', 'Phoeniconaias minor', 'BIRD', 'NEAR_THREATENED', 'Smaller flamingo species', 'Saline lakes', NOW()),
('Painted Stork', 'Mycteria leucocephala', 'BIRD', 'NEAR_THREATENED', 'Large wading bird', 'Wetlands', NOW()),
('Black-necked Stork', 'Ephippiorhynchus asiaticus', 'BIRD', 'NEAR_THREATENED', 'Large stork with black neck', 'Wetlands', NOW()),
-- Birds - Endemic
('Nilgiri Flycatcher', 'Eumyias albicaudatus', 'BIRD', 'VULNERABLE', 'Endemic to Western Ghats', 'Shola forests', NOW()),
('Malabar Grey Hornbill', 'Ocyceros griseus', 'BIRD', 'NEAR_THREATENED', 'Endemic hornbill of Western Ghats', 'Forests', NOW()),
('Great Indian Hornbill', 'Buceros bicornis', 'BIRD', 'VULNERABLE', 'Large hornbill with casque', 'Evergreen forests', NOW()),
-- Birds - Parrots
('Alexandrine Parakeet', 'Psittacula eupatria', 'BIRD', 'NEAR_THREATENED', 'Large green parrot', 'Forests, cultivated areas', NOW()),
('Rose-ringed Parakeet', 'Psittacula krameri', 'BIRD', 'LEAST_CONCERN', 'Common green parrot', 'Various habitats', NOW()),
-- Reptiles - Snakes
('Indian Cobra', 'Naja naja', 'REPTILE', 'LEAST_CONCERN', 'Venomous snake with hood marking', 'Forests, grasslands', NOW()),
('King Cobra', 'Ophiophagus hannah', 'REPTILE', 'VULNERABLE', 'World''s longest venomous snake, up to 5.5m', 'Dense forests', NOW()),
('Indian Python', 'Python molurus', 'REPTILE', 'LEAST_CONCERN', 'Large non-venomous constrictor', 'Forests, wetlands', NOW()),
('Russell''s Viper', 'Daboia russelii', 'REPTILE', 'LEAST_CONCERN', 'Highly venomous snake', 'Grasslands, scrublands', NOW()),
('Common Krait', 'Bungarus caeruleus', 'REPTILE', 'LEAST_CONCERN', 'Highly venomous nocturnal snake', 'Various habitats', NOW()),
('Indian Rock Python', 'Python molurus', 'REPTILE', 'NEAR_THREATENED', 'Large constrictor snake', 'Rocky areas, forests', NOW()),
-- Reptiles - Crocodilians
('Gharial', 'Gavialis gangeticus', 'REPTILE', 'CRITICALLY_ENDANGERED', 'Fish-eating crocodilian with long snout', 'Rivers with sandy banks', NOW()),
('Saltwater Crocodile', 'Crocodylus porosus', 'REPTILE', 'LEAST_CONCERN', 'Largest living reptile', 'Mangroves, coastal waters', NOW()),
('Mugger Crocodile', 'Crocodylus palustris', 'REPTILE', 'VULNERABLE', 'Marsh crocodile', 'Freshwater habitats', NOW()),
-- Reptiles - Turtles
('Indian Star Tortoise', 'Geochelone elegans', 'REPTILE', 'VULNERABLE', 'Beautiful star-patterned shell', 'Dry forests, scrublands', NOW()),
('Indian Tent Turtle', 'Pangshura tentoria', 'REPTILE', 'LEAST_CONCERN', 'Freshwater turtle', 'Rivers and ponds', NOW()),
('Olive Ridley Turtle', 'Lepidochelys olivacea', 'REPTILE', 'VULNERABLE', 'Sea turtle with mass nesting', 'Coastal waters', NOW()),
-- Reptiles - Lizards
('Bengal Monitor Lizard', 'Varanus bengalensis', 'REPTILE', 'LEAST_CONCERN', 'Large lizard', 'Various habitats', NOW()),
('Indian Chameleon', 'Chamaeleo zeylanicus', 'REPTILE', 'LEAST_CONCERN', 'Color-changing lizard', 'Forests, gardens', NOW()),
-- Amphibians
('Purple Frog', 'Nasikabatrachus sahyadrensis', 'AMPHIBIAN', 'ENDANGERED', 'Ancient frog endemic to Western Ghats', 'Forest leaf litter', NOW()),
('Malabar Gliding Frog', 'Rhacophorus malabaricus', 'AMPHIBIAN', 'LEAST_CONCERN', 'Tree frog that can glide', 'Tropical rainforests', NOW()),
('Indian Bullfrog', 'Hoplobatrachus tigerinus', 'AMPHIBIAN', 'LEAST_CONCERN', 'Large frog with loud call', 'Wetlands, rice fields', NOW()),
-- Insects & Butterflies
('Atlas Moth', 'Attacus atlas', 'INSECT', 'LEAST_CONCERN', 'One of largest moths, 30cm wingspan', 'Tropical forests', NOW()),
('Common Jezebel', 'Delias eucharis', 'INSECT', 'LEAST_CONCERN', 'White and yellow butterfly', 'Forests', NOW()),
('Blue Mormon', 'Papilio polymnestor', 'INSECT', 'LEAST_CONCERN', 'Large swallowtail butterfly', 'Forests', NOW()),
('Southern Birdwing', 'Troides minos', 'INSECT', 'NEAR_THREATENED', 'Largest butterfly in India', 'Western Ghats forests', NOW()),
('Common Rose', 'Pachliopta aristolochiae', 'INSECT', 'LEAST_CONCERN', 'Black and red butterfly', 'Gardens, forests', NOW()),
-- Fish
('Mahseer', 'Tor tor', 'FISH', 'ENDANGERED', 'Large game fish', 'Fast-flowing rivers', NOW()),
('Ganges Shark', 'Glyphis gangeticus', 'FISH', 'CRITICALLY_ENDANGERED', 'Rare freshwater shark', 'Ganges river system', NOW()),
('Hilsa', 'Tenualosa ilisha', 'FISH', 'LEAST_CONCERN', 'Important food fish', 'Rivers and coastal waters', NOW()),
-- Marine Mammals
('Ganges River Dolphin', 'Platanista gangetica', 'MAMMAL', 'ENDANGERED', 'Blind freshwater dolphin', 'Ganges river system', NOW()),
('Dugong', 'Dugong dugon', 'MAMMAL', 'VULNERABLE', 'Marine mammal, sea cow', 'Coastal waters with seagrass', NOW()),
-- Additional Species
('Indian Pangolin', 'Manis crassicaudata', 'MAMMAL', 'ENDANGERED', 'Scaly anteater', 'Forests and grasslands', NOW()),
('Indian Porcupine', 'Hystrix indica', 'MAMMAL', 'LEAST_CONCERN', 'Large rodent with quills', 'Forests, rocky areas', NOW()),
('Indian Hare', 'Lepus nigricollis', 'MAMMAL', 'LEAST_CONCERN', 'Common hare species', 'Grasslands, scrublands', NOW()),
('Indian Flying Fox', 'Pteropus giganteus', 'MAMMAL', 'LEAST_CONCERN', 'Large fruit bat', 'Forests, urban areas', NOW()),
('Smooth-coated Otter', 'Lutrogale perspicillata', 'MAMMAL', 'VULNERABLE', 'Social otter species', 'Rivers and wetlands', NOW()),
('Honey Badger', 'Mellivora capensis', 'MAMMAL', 'LEAST_CONCERN', 'Fearless carnivore', 'Forests and grasslands', NOW()),
('Striped Hyena', 'Hyaena hyaena', 'MAMMAL', 'NEAR_THREATENED', 'Scavenger with powerful jaws', 'Arid and semi-arid areas', NOW()),
('Indian Giant Squirrel', 'Ratufa indica', 'MAMMAL', 'LEAST_CONCERN', 'Large colorful squirrel', 'Western Ghats forests', NOW());
