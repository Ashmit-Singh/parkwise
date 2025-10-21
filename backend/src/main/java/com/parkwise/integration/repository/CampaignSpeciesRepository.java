package com.parkwise.integration.repository;

import com.parkwise.integration.entity.CampaignSpecies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignSpeciesRepository extends JpaRepository<CampaignSpecies, Long> {
    List<CampaignSpecies> findByCampaignId(Long campaignId);

    void deleteByCampaignIdAndSpeciesId(Long campaignId, Long speciesId);
}
