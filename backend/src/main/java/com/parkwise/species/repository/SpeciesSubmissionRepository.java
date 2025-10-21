package com.parkwise.species.repository;

import com.parkwise.species.entity.SpeciesSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpeciesSubmissionRepository extends JpaRepository<SpeciesSubmission, Long> {
    List<SpeciesSubmission> findByUserId(Long userId);

    List<SpeciesSubmission> findBySubmissionStatus(SpeciesSubmission.SubmissionStatus status);

    List<SpeciesSubmission> findByUserIdAndSubmissionStatus(Long userId, SpeciesSubmission.SubmissionStatus status);

    Long countByUserId(Long userId);

    Long countByUserIdAndSubmissionStatus(Long userId, SpeciesSubmission.SubmissionStatus status);

    @Query("SELECT COUNT(DISTINCT ss.species.id) FROM SpeciesSubmission ss WHERE ss.userId = :userId AND ss.submissionStatus = 'APPROVED'")
    Long countDistinctSpeciesByUserId(@Param("userId") Long userId);

    List<SpeciesSubmission> findByCampaignId(Long campaignId);

    @Query("SELECT ss FROM SpeciesSubmission ss WHERE ss.submissionStatus = 'PENDING' ORDER BY ss.createdAt ASC")
    List<SpeciesSubmission> findPendingSubmissions();
}
