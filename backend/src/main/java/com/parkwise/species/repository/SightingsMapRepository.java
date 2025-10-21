package com.parkwise.species.repository;

import com.parkwise.species.entity.SightingsMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SightingsMapRepository extends JpaRepository<SightingsMap, Long> {
    List<SightingsMap> findBySpeciesIdOrderByCreatedAtDesc(Long speciesId);

    @Query("SELECT s FROM SightingsMap s WHERE s.speciesId = :speciesId AND s.latitude = :lat AND s.longitude = :lon AND s.sightingDate = :date")
    Optional<SightingsMap> findBySpeciesIdAndLocationAndDate(
            @Param("speciesId") Long speciesId,
            @Param("lat") BigDecimal latitude,
            @Param("lon") BigDecimal longitude,
            @Param("date") LocalDate date
    );

    @Query("SELECT s FROM SightingsMap s WHERE s.latitude BETWEEN :minLat AND :maxLat AND s.longitude BETWEEN :minLon AND :maxLon")
    List<SightingsMap> findSightingsInArea(
            @Param("minLat") BigDecimal minLat,
            @Param("maxLat") BigDecimal maxLat,
            @Param("minLon") BigDecimal minLon,
            @Param("maxLon") BigDecimal maxLon
    );

    List<SightingsMap> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date);

    @Query("SELECT s FROM SightingsMap s WHERE s.confidenceScore >= 0.75 ORDER BY s.createdAt DESC")
    List<SightingsMap> findValidatedSightings();
}
