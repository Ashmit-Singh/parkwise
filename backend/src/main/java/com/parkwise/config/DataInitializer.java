package com.parkwise.config;

import com.parkwise.entity.Park;
import com.parkwise.entity.Species;
import com.parkwise.entity.Campaign;
import com.parkwise.repository.ParkRepository;
import com.parkwise.repository.SpeciesRepository;
import com.parkwise.repository.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ParkRepository parkRepository;

    @Autowired
    private SpeciesRepository speciesRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data and initialize fresh
        campaignRepository.deleteAll();
        speciesRepository.deleteAll();
        parkRepository.deleteAll();
        
        initializeData();
    }

    private void initializeData() {
        System.out.println("Initializing sample data...");

        try {
            // Create Parks first
            Park kaziranga = createPark(
                "Kaziranga National Park", 
                "Assam",
                "Home to the world's largest population of one-horned rhinoceroses, this UNESCO World Heritage Site spans the floodplains of the Brahmaputra River.",
                "Protected",
                1974,
                430.0,
                "November to April",
                "Rhino Safari, Elephant Rides, Bird Watching",
                26.5735,
                93.1715
            );

            Park panna = createPark(
                "Panna Tiger Reserve",
                "Madhya Pradesh", 
                "Known for its successful tiger conservation program, Panna lost its entire tiger population in 2009 but has since made a remarkable recovery.",
                "Critical",
                1981,
                542.0,
                "October to June", 
                "Tiger Safari, Ken River, Ancient Temples",
                24.7136,
                80.1889
            );

            // Save parks first
            Park savedKaziranga = parkRepository.save(kaziranga);
            Park savedPanna = parkRepository.save(panna);

            System.out.println("Saved parks with IDs: " + savedKaziranga.getId() + ", " + savedPanna.getId());

            // Create Species
            Species rhino = createSpecies(
                "Indian Rhinoceros",
                "Rhinoceros unicornis", 
                Species.SpeciesType.FAUNA,
                "VULNERABLE",
                "The great one-horned rhinoceros is the largest of the three Asian rhinos.",
                "Floodplain grasslands and forests",
                "Herbivore", 
                "35-45 years",
                savedKaziranga
            );

            Species tiger = createSpecies(
                "Royal Bengal Tiger",
                "Panthera tigris tigris",
                Species.SpeciesType.FAUNA,
                "ENDANGERED", 
                "The Bengal tiger is the most numerous tiger subspecies and the national animal of India.",
                "Tropical forests, mangroves, grasslands",
                "Carnivore",
                "8-10 years in wild", 
                savedKaziranga
            );

            Species sandalwood = createSpecies(
                "Sandalwood Tree",
                "Santalum album",
                Species.SpeciesType.FLORA,
                "VULNERABLE",
                "Indian sandalwood is a small tropical tree known for its fragrant heartwood.",
                "Dry deciduous forests",
                "Photosynthesis",
                "30-60 years",
                savedPanna
            );

            // Save species
            speciesRepository.save(rhino);
            speciesRepository.save(tiger);
            speciesRepository.save(sandalwood);

            // Create Campaigns
            Campaign tigerCampaign = createCampaign(
                "Save the Bengal Tiger",
                "Protect the remaining Bengal tiger population through anti-poaching efforts and habitat restoration.",
                5000000.0,
                3250000.0,
                LocalDate.of(2024, 1, 1),
                LocalDate.of(2024, 12, 31),
                Campaign.CampaignStatus.ACTIVE,
                1247,
                savedKaziranga
            );

            Campaign rhinoCampaign = createCampaign(
                "Rhino Conservation Fund", 
                "Support Kaziranga's rhino protection units and community engagement programs.",
                2500000.0,
                1800000.0,
                LocalDate.of(2024, 1, 15),
                LocalDate.of(2024, 10, 15),
                Campaign.CampaignStatus.ACTIVE,
                892,
                savedKaziranga
            );

            Campaign pannaCampaign = createCampaign(
                "Panna Tiger Recovery",
                "Support the ongoing tiger conservation and habitat restoration in Panna Tiger Reserve.",
                3000000.0,
                1500000.0,
                LocalDate.of(2024, 2, 1),
                LocalDate.of(2024, 11, 30),
                Campaign.CampaignStatus.ACTIVE,
                543,
                savedPanna
            );

            // Save campaigns
            campaignRepository.save(tigerCampaign);
            campaignRepository.save(rhinoCampaign);
            campaignRepository.save(pannaCampaign);

            System.out.println("Sample data initialized successfully!");
            System.out.println("Created " + parkRepository.count() + " parks");
            System.out.println("Created " + speciesRepository.count() + " species"); 
            System.out.println("Created " + campaignRepository.count() + " campaigns");

        } catch (Exception e) {
            System.err.println("Error initializing data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Park createPark(String name, String state, String description, String conservationStatus,
                           int establishedYear, double area, String bestTimeToVisit, String keyAttractions,
                           double latitude, double longitude) {
        Park park = new Park();
        park.setName(name);
        park.setState(state);
        park.setDescription(description);
        park.setConservationStatus(conservationStatus);
        park.setEstablishedYear(establishedYear);
        park.setArea(area);
        park.setBestTimeToVisit(bestTimeToVisit);
        park.setKeyAttractions(keyAttractions);
        park.setLatitude(latitude);
        park.setLongitude(longitude);
        return park;
    }

    private Species createSpecies(String name, String scientificName, Species.SpeciesType type,
                                 String conservationStatus, String description, String habitat,
                                 String diet, String lifespan, Park park) {
        Species species = new Species();
        species.setName(name);
        species.setScientificName(scientificName);
        species.setType(type);
        species.setConservationStatus(conservationStatus);
        species.setDescription(description);
        species.setHabitat(habitat);
        species.setDiet(diet);
        species.setLifespan(lifespan);
        species.setPark(park);
        return species;
    }

    private Campaign createCampaign(String title, String description, double targetAmount,
                                   double currentAmount, LocalDate startDate, LocalDate endDate,
                                   Campaign.CampaignStatus status, int supporters, Park park) {
        Campaign campaign = new Campaign();
        campaign.setTitle(title);
        campaign.setDescription(description);
        campaign.setTargetAmount(targetAmount);
        campaign.setCurrentAmount(currentAmount);
        campaign.setStartDate(startDate);
        campaign.setEndDate(endDate);
        campaign.setStatus(status);
        campaign.setSupporters(supporters);
        campaign.setPark(park);
        return campaign;
    }
}