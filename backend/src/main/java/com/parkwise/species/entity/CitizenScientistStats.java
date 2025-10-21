package com.parkwise.species.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "citizen_scientist_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitizenScientistStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "total_submissions")
    private Integer totalSubmissions;

    @Column(name = "approved_submissions")
    private Integer approvedSubmissions;

    @Column(name = "species_identified")
    private Integer speciesIdentified;

    @Column(name = "points")
    private Integer points;

    @Column(name = "badges", columnDefinition = "TEXT")
    private String badges;

    @Column(name = "rank")
    @Enumerated(EnumType.STRING)
    private UserRank rank;

    @Column(name = "last_submission_date")
    private LocalDateTime lastSubmissionDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (totalSubmissions == null) totalSubmissions = 0;
        if (approvedSubmissions == null) approvedSubmissions = 0;
        if (speciesIdentified == null) speciesIdentified = 0;
        if (points == null) points = 0;
        if (rank == null) rank = UserRank.NOVICE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        updateRank();
    }

    private void updateRank() {
        if (approvedSubmissions >= 100) {
            this.rank = UserRank.EXPERT;
        } else if (approvedSubmissions >= 50) {
            this.rank = UserRank.NATURALIST;
        } else if (approvedSubmissions >= 10) {
            this.rank = UserRank.EXPLORER;
        } else {
            this.rank = UserRank.NOVICE;
        }
    }

    public enum UserRank {
        NOVICE,
        EXPLORER,
        NATURALIST,
        EXPERT
    }
}
