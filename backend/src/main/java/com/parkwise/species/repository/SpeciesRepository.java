package com.parkwise.species.repository;

import com.parkwise.species.entity.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpeciesRepository extends JpaRepository<Species, Long> {
    Optional<Species> findByScientificName(String scientificName);

    Optional<Species> findByCommonNameIgnoreCase(String commonName);

    List<Species> findByCommonNameContainingIgnoreCase(String commonName);

    List<Species> findByCategory(Species.SpeciesCategory category);

    List<Species> findByConservationStatus(Species.ConservationStatus status);

    @Query("SELECT s FROM Species s WHERE s.conservationStatus IN ('CRITICALLY_ENDANGERED', 'ENDANGERED', 'VULNERABLE')")
    List<Species> findThreatenedSpecies();
}
