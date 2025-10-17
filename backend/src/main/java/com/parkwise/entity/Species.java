package com.parkwise.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "species")
public class Species {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String scientificName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SpeciesType type;
    
    private String conservationStatus;
    
    @Column(length = 1500)
    private String description;
    
    private String imageUrl;
    private String habitat;
    private String diet;
    private String lifespan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "park_id")
    @JsonIgnore  // Add this line
    private Park park;
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum SpeciesType {
        FLORA, FAUNA
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }
    
    public SpeciesType getType() { return type; }
    public void setType(SpeciesType type) { this.type = type; }
    
    public String getConservationStatus() { return conservationStatus; }
    public void setConservationStatus(String conservationStatus) { this.conservationStatus = conservationStatus; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getHabitat() { return habitat; }
    public void setHabitat(String habitat) { this.habitat = habitat; }
    
    public String getDiet() { return diet; }
    public void setDiet(String diet) { this.diet = diet; }
    
    public String getLifespan() { return lifespan; }
    public void setLifespan(String lifespan) { this.lifespan = lifespan; }
    
    public Park getPark() { return park; }
    public void setPark(Park park) { this.park = park; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}