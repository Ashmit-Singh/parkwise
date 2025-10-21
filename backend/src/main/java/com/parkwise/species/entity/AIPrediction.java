package com.parkwise.species.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "ai_predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIPrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private SpeciesSubmission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id")
    private Species species;

    @Column(name = "common_name")
    private String commonName;

    @Column(name = "scientific_name")
    private String scientificName;

    @Column(name = "confidence_score")
    private BigDecimal confidenceScore;

    @Column(name = "ai_model_version")
    private String aiModelVersion;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "alternative_predictions", columnDefinition = "jsonb")
    private Map<String, Object> alternativePredictions;

    @Column(name = "processing_time_ms")
    private Integer processingTimeMs;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
