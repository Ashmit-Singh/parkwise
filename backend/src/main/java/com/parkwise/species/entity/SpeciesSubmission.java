package com.parkwise.species.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "species_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpeciesSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "campaign_id")
    private Long campaignId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id")
    private Species species;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "image_storage_key")
    private String imageStorageKey;

    @Column(name = "latitude")
    private BigDecimal latitude;

    @Column(name = "longitude")
    private BigDecimal longitude;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "submission_date", nullable = false)
    private LocalDateTime submissionDate;

    @Column(name = "observation_date")
    private LocalDate observationDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "submission_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private SubmissionStatus submissionStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (submissionStatus == null) {
            submissionStatus = SubmissionStatus.PENDING;
        }
        if (submissionDate == null) {
            submissionDate = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SubmissionStatus {
        PENDING,
        APPROVED,
        REJECTED,
        FLAGGED
    }
}
