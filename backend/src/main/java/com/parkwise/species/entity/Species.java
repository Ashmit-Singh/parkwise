package com.parkwise.species.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "species")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Species {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String commonName;

    @Column(nullable = false, unique = true)
    private String scientificName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "conservation_status")
    @Enumerated(EnumType.STRING)
    private ConservationStatus conservationStatus;

    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private SpeciesCategory category;

    @Column(columnDefinition = "TEXT")
    private String habitatTypes;

    @Column(columnDefinition = "TEXT")
    private String geographicRange;

    @Column(name = "iucn_id")
    private String iucnId;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ConservationStatus {
        EXTINCT,
        EXTINCT_IN_WILD,
        CRITICALLY_ENDANGERED,
        ENDANGERED,
        VULNERABLE,
        NEAR_THREATENED,
        LEAST_CONCERN,
        DATA_DEFICIENT
    }

    public enum SpeciesCategory {
        BIRD,
        MAMMAL,
        REPTILE,
        AMPHIBIAN,
        FISH,
        INSECT,
        PLANT,
        OTHER
    }
}
