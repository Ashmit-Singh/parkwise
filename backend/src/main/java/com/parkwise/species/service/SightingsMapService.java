package com.parkwise.species.service;

import com.parkwise.species.entity.SpeciesSubmission;
import com.parkwise.species.entity.SightingsMap;
import com.parkwise.species.repository.SightingsMapRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SightingsMapService {
    private final SightingsMapRepository sightingsMapRepository;

    /**
     * Add sighting to public map (anonymized location)
     */
    public void addSighting(Long speciesId, SpeciesSubmission submission) {
        log.info("Adding sighting to map - Species: {}, Location: {},{}", 
                speciesId, submission.getLatitude(), submission.getLongitude());

        // Check if sighting already exists at this location for this species
        Optional<SightingsMap> existingSighting = sightingsMapRepository.findBySpeciesIdAndLocationAndDate(
                speciesId,
                submission.getLatitude(),
                submission.getLongitude(),
                submission.getObservationDate() != null ? submission.getObservationDate() : LocalDate.now()
        );

        if (existingSighting.isPresent()) {
            // Increment count
            SightingsMap sighting = existingSighting.get();
            sighting.setSightingCount(sighting.getSightingCount() + 1);
            sightingsMapRepository.save(sighting);
            log.info("Updated existing sighting count");
        } else {
            // Create new sighting
            SightingsMap newSighting = SightingsMap.builder()
                    .speciesId(speciesId)
                    .latitude(submission.getLatitude())
                    .longitude(submission.getLongitude())
                    .sightingDate(submission.getObservationDate() != null ? submission.getObservationDate() : LocalDate.now())
                    .sightingCount(1)
                    .submissionId(submission.getId())
                    .build();

            sightingsMapRepository.save(newSighting);
            log.info("Created new sighting entry");
        }
    }

    /**
     * Get sightings for a species
     */
    public java.util.List<SightingsMap> getSpeciesSightings(Long speciesId) {
        return sightingsMapRepository.findBySpeciesIdOrderByCreatedAtDesc(speciesId);
    }

    /**
     * Get sightings in geographic area
     */
    public java.util.List<SightingsMap> getSightingsInArea(
            BigDecimal minLat, BigDecimal maxLat,
            BigDecimal minLon, BigDecimal maxLon) {
        return sightingsMapRepository.findSightingsInArea(minLat, maxLat, minLon, maxLon);
    }

    /**
     * Get recent sightings
     */
    public java.util.List<SightingsMap> getRecentSightings(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return sightingsMapRepository.findByCreatedAtAfterOrderByCreatedAtDesc(
                startDate.atStartOfDay()
        );
    }
}
