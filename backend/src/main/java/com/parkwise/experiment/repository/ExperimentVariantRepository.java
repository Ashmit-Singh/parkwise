package com.parkwise.experiment.repository;

import com.parkwise.experiment.entity.ExperimentVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExperimentVariantRepository extends JpaRepository<ExperimentVariant, Long> {
}
