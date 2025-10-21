package com.parkwise.geo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "geo_projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeoProject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String projectName;
    
    @Column(length = 2000)
    private String description;
    
    private Long campaignId;
    
    private Long parkId;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    private Double radius; // in meters
    
    @Column(length = 500)
    private String address;
    
    @Column(length = 100)
    private String city;
    
    @Column(length = 100)
    private String state;
    
    @Column(length = 100)
    private String country;
    
    @Column(length = 20)
    private String postalCode;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectType projectType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;
    
    @Column(nullable = false)
    private Boolean isGeofenced;
    
    @Column(length = 4000)
    private String geofenceBoundary; // GeoJSON polygon
    
    @Column(length = 500)
    private String locationProofHash; // IPFS hash of location proof
    
    private LocalDateTime locationVerifiedAt;
    
    @Column(nullable = false)
    private Integer impactRadius; // in km
    
    private BigDecimal areaSize; // in hectares
    
    @Column(length = 1000)
    private String ecosystemType;
    
    @Column(length = 1000)
    private String conservationGoals;
    
    private Integer speciesCount;
    
    private Boolean hasWildlifeCameras;
    
    private Boolean hasSensorNetwork;
    
    @Column(length = 2000)
    private String metadata;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
        if (isGeofenced == null) {
            isGeofenced = false;
        }
        if (verificationStatus == null) {
            verificationStatus = VerificationStatus.PENDING;
        }
        if (hasWildlifeCameras == null) {
            hasWildlifeCameras = false;
        }
        if (hasSensorNetwork == null) {
            hasSensorNetwork = false;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum ProjectType {
        WILDLIFE_CONSERVATION,
        HABITAT_RESTORATION,
        REFORESTATION,
        WATER_CONSERVATION,
        SPECIES_PROTECTION,
        CLIMATE_ADAPTATION,
        COMMUNITY_EDUCATION
    }
    
    public enum VerificationStatus {
        PENDING,
        VERIFIED,
        REJECTED,
        REQUIRES_REVIEW
    }
    
    /**
     * Calculate distance to another location in kilometers
     */
    public double distanceTo(double otherLat, double otherLon) {
        final int R = 6371; // Earth radius in km
        
        double latDistance = Math.toRadians(otherLat - latitude);
        double lonDistance = Math.toRadians(otherLon - longitude);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(latitude)) * Math.cos(Math.toRadians(otherLat))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
    
    /**
     * Check if a point is within the project's impact radius
     */
    public boolean isWithinImpactRadius(double checkLat, double checkLon) {
        return distanceTo(checkLat, checkLon) <= impactRadius;
    }
}
