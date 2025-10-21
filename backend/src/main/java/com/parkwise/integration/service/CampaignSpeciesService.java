package com.parkwise.integration.service;

import com.parkwise.integration.entity.CampaignSpecies;
import com.parkwise.integration.repository.CampaignSpeciesRepository;
import com.parkwise.species.entity.Species;
import com.parkwise.species.repository.SpeciesRepository;
import com.parkwise.species.repository.SightingsMapRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CampaignSpeciesService {
    private final CampaignSpeciesRepository campaignSpeciesRepository;
    private final SpeciesRepository speciesRepository;
    private final SightingsMapRepository sightingsMapRepository;

    /**
     * Link species to campaign
     */
    public CampaignSpecies linkSpeciesToCampaign(Long campaignId, Long speciesId, String description) {
        log.info("Linking species {} to campaign {}", speciesId, campaignId);

        CampaignSpecies mapping = CampaignSpecies.builder()
                .campaignId(campaignId)
                .speciesId(speciesId)
                .description(description)
                .build();

        CampaignSpecies saved = campaignSpeciesRepository.save(mapping);
        log.info("Species linked to campaign: {}", saved.getId());

        return saved;
    }

    /**
     * Get species for campaign
     */
    public List<Species> getSpeciesForCampaign(Long campaignId) {
        log.info("Fetching species for campaign: {}", campaignId);

        List<Long> speciesIds = campaignSpeciesRepository.findByCampaignId(campaignId)
                .stream()
                .map(CampaignSpecies::getSpeciesId)
                .collect(Collectors.toList());

        return speciesRepository.findAllById(speciesIds);
    }

    /**
     * Get campaign impact metrics
     */
    public CampaignImpactDTO calculateCampaignImpact(Long campaignId) {
        log.info("Calculating impact for campaign: {}", campaignId);

        List<CampaignSpecies> mappings = campaignSpeciesRepository.findByCampaignId(campaignId);

        int totalSpecies = mappings.size();
        long totalSightings = 0;
        int uniqueLocations = 0;

        for (CampaignSpecies mapping : mappings) {
            var sightings = sightingsMapRepository.findBySpeciesIdOrderByCreatedAtDesc(mapping.getSpeciesId());
            totalSightings += sightings.size();
            uniqueLocations += sightings.stream().map(s -> s.getLatitude().toString() + s.getLongitude().toString()).distinct().count();
        }

        return CampaignImpactDTO.builder()
                .campaignId(campaignId)
                .totalSpecies(totalSpecies)
                .totalSightings(totalSightings)
                .uniqueLocations(uniqueLocations)
                .build();
    }

    /**
     * Remove species from campaign
     */
    public void removeSpeciesFromCampaign(Long campaignId, Long speciesId) {
        log.info("Removing species {} from campaign {}", speciesId, campaignId);

        campaignSpeciesRepository.deleteByCampaignIdAndSpeciesId(campaignId, speciesId);

        log.info("Species removed from campaign");
    }

    /**
     * Campaign Impact DTO
     */
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    @lombok.Builder
    public static class CampaignImpactDTO {
        private Long campaignId;
        private Integer totalSpecies;
        private Long totalSightings;
        private Integer uniqueLocations;
    }
}
