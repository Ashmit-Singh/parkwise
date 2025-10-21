package com.parkwise.experiment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experiment_id")
    private Experiment experiment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ExperimentVariant variant;

    @Column(name = "donation_amount", nullable = false)
    private BigDecimal donationAmount;

    @Column(name = "donation_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private DonationStatus donationStatus;

    @Column(name = "event_log_id")
    private Long eventLogId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (donationStatus == null) {
            donationStatus = DonationStatus.PENDING;
        }
    }

    public enum DonationStatus {
        PENDING, COMPLETED, FAILED
    }
}
