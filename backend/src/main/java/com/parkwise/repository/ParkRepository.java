package com.parkwise.repository;

import com.parkwise.entity.Park;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ParkRepository extends JpaRepository<Park, Long> {
    List<Park> findByState(String state);
    List<Park> findByNameContainingIgnoreCase(String name);
    List<Park> findByConservationStatus(String status);
    
    @Query("SELECT DISTINCT p.state FROM Park p ORDER BY p.state")
    List<String> findDistinctStates();
}