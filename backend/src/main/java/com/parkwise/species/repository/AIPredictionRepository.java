package com.parkwise.species.repository;

import com.parkwise.species.entity.AIPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AIPredictionRepository extends JpaRepository<AIPrediction, Long> {
    Optional<AIPrediction> findBySubmissionId(Long submissionId);
}
