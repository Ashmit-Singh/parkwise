package com.parkwise.repository;

import com.parkwise.entity.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SpeciesRepository extends JpaRepository<Species, Long> {
    List<Species> findByParkId(Long parkId);
    List<Species> findByType(Species.SpeciesType type);
    List<Species> findByConservationStatus(String status);
    List<Species> findByParkIdAndType(Long parkId, Species.SpeciesType type);
    
    @Query("SELECT s FROM Species s WHERE s.conservationStatus IN ('CRITICAL', 'ENDANGERED', 'VULNERABLE')")
    List<Species> findThreatenedSpecies();
}