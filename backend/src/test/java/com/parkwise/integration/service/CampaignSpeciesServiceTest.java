package com.parkwise.integration.service;

import com.parkwise.integration.entity.CampaignSpecies;
import com.parkwise.integration.repository.CampaignSpeciesRepository;
import com.parkwise.species.entity.Species;
import com.parkwise.species.repository.SpeciesRepository;
import com.parkwise.species.repository.SightingsMapRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class CampaignSpeciesServiceTest {
    @Autowired
    private CampaignSpeciesService campaignSpeciesService;

    @Autowired
    private CampaignSpeciesRepository campaignSpeciesRepository;

    @Autowired
    private SpeciesRepository speciesRepository;

    private Long campaignId = 1L;
    private Long speciesId = 1L;

    @BeforeEach
    public void setUp() {
        campaignSpeciesRepository.deleteAll();
        speciesRepository.deleteAll();

        // Create test species
        Species species = Species.builder()
                .commonName("Great Hornbill")
                .scientificName("Buceros bicornis")
                .conservationStatus(Species.ConservationStatus.VULNERABLE)
                .category(Species.SpeciesCategory.BIRD)
                .build();
        speciesRepository.save(species);
    }

    @Test
    public void testLinkSpeciesToCampaign() {
        // Act
        CampaignSpecies mapping = campaignSpeciesService.linkSpeciesToCampaign(
                campaignId, speciesId, "Protect Great Hornbill habitat"
        );

        // Assert
        assertNotNull(mapping);
        assertEquals(campaignId, mapping.getCampaignId());
        assertEquals(speciesId, mapping.getSpeciesId());
        assertEquals("Protect Great Hornbill habitat", mapping.getDescription());
    }

    @Test
    public void testGetSpeciesForCampaign() {
        // Arrange
        campaignSpeciesService.linkSpeciesToCampaign(campaignId, speciesId, "Test");

        // Act
        List<Species> species = campaignSpeciesService.getSpeciesForCampaign(campaignId);

        // Assert
        assertNotNull(species);
        assertEquals(1, species.size());
        assertEquals("Great Hornbill", species.get(0).getCommonName());
    }

    @Test
    public void testCalculateCampaignImpact() {
        // Arrange
        campaignSpeciesService.linkSpeciesToCampaign(campaignId, speciesId, "Test");

        // Act
        CampaignSpeciesService.CampaignImpactDTO impact = campaignSpeciesService.calculateCampaignImpact(campaignId);

        // Assert
        assertNotNull(impact);
        assertEquals(campaignId, impact.getCampaignId());
        assertEquals(1, impact.getTotalSpecies());
    }

    @Test
    public void testRemoveSpeciesFromCampaign() {
        // Arrange
        campaignSpeciesService.linkSpeciesToCampaign(campaignId, speciesId, "Test");

        // Act
        campaignSpeciesService.removeSpeciesFromCampaign(campaignId, speciesId);

        // Assert
        List<CampaignSpecies> remaining = campaignSpeciesRepository.findByCampaignId(campaignId);
        assertEquals(0, remaining.size());
    }

    @Test
    public void testMultipleSpeciesPerCampaign() {
        // Arrange
        Species species2 = Species.builder()
                .commonName("Bengal Tiger")
                .scientificName("Panthera tigris tigris")
                .conservationStatus(Species.ConservationStatus.ENDANGERED)
                .category(Species.SpeciesCategory.MAMMAL)
                .build();
        speciesRepository.save(species2);

        // Act
        campaignSpeciesService.linkSpeciesToCampaign(campaignId, speciesId, "Test 1");
        campaignSpeciesService.linkSpeciesToCampaign(campaignId, species2.getId(), "Test 2");

        // Assert
        List<Species> species = campaignSpeciesService.getSpeciesForCampaign(campaignId);
        assertEquals(2, species.size());
    }
}
