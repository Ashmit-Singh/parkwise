package com.parkwise.species.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "expert_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private SpeciesSubmission submission;

    @Column(name = "reviewer_id", nullable = false)
    private Long reviewerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id")
    private Species species;

    @Column(name = "review_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReviewStatus reviewStatus;

    @Column(name = "confidence_level")
    @Enumerated(EnumType.STRING)
    private ConfidenceLevel confidenceLevel;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "flagged_reason")
    private String flaggedReason;

    @Column(name = "review_date", nullable = false)
    private LocalDateTime reviewDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (reviewDate == null) {
            reviewDate = LocalDateTime.now();
        }
    }

    public enum ReviewStatus {
        APPROVED,
        REJECTED,
        NEEDS_MORE_INFO
    }

    public enum ConfidenceLevel {
        HIGH,
        MEDIUM,
        LOW
    }
}
