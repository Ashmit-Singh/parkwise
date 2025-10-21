package com.parkwise.species.repository;

import com.parkwise.species.entity.ExpertReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpertReviewRepository extends JpaRepository<ExpertReview, Long> {
    Optional<ExpertReview> findBySubmissionId(Long submissionId);

    List<ExpertReview> findByReviewerId(Long reviewerId);

    List<ExpertReview> findByReviewStatus(ExpertReview.ReviewStatus status);
}
