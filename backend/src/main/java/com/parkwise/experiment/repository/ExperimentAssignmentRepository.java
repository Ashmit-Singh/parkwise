package com.parkwise.experiment.repository;

import com.parkwise.experiment.entity.ExperimentAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExperimentAssignmentRepository extends JpaRepository<ExperimentAssignment, Long> {
    @Query("SELECT ea FROM ExperimentAssignment ea WHERE ea.userId = :userId AND ea.experiment.id = :experimentId")
    Optional<ExperimentAssignment> findByUserIdAndExperimentId(
            @Param("userId") Long userId,
            @Param("experimentId") Long experimentId
    );

    @Query("SELECT COUNT(ea) FROM ExperimentAssignment ea WHERE ea.experiment.id = :experimentId AND ea.variant.id = :variantId")
    Long countByExperimentAndVariant(
            @Param("experimentId") Long experimentId,
            @Param("variantId") Long variantId
    );
}
