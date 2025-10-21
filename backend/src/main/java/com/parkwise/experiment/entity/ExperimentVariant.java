package com.parkwise.experiment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "experiment_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExperimentVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experiment_id", nullable = false)
    private Experiment experiment;

    @Column(name = "variant_name", nullable = false)
    private String variantName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "allocation_percentage", nullable = false)
    private BigDecimal allocationPercentage;

    @Column(name = "impression_count", nullable = false)
    private Integer impressionCount = 0;

    @Column(name = "conversion_count", nullable = false)
    private Integer conversionCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (allocationPercentage == null) {
            allocationPercentage = new BigDecimal("50.00");
        }
    }
}
