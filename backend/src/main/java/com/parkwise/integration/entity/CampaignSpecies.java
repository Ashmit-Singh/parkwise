package com.parkwise.integration.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaign_species_mapping")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignSpecies {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "species_id", nullable = false)
    private Long speciesId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "conservation_focus")
    private String conservationFocus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
