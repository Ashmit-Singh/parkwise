package com.parkwise.experiment.repository;

import com.parkwise.experiment.entity.Experiment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExperimentRepository extends JpaRepository<Experiment, Long> {
    Optional<Experiment> findByName(String name);

    @Query("SELECT e FROM Experiment e WHERE e.status = 'ACTIVE'")
    List<Experiment> findActiveExperiments();

    @Query("SELECT e FROM Experiment e WHERE e.status = :status")
    List<Experiment> findByStatus(@Param("status") Experiment.ExperimentStatus status);
}
