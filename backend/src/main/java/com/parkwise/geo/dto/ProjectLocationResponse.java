package com.parkwise.geo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectLocationResponse {

    private Long id;
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private Double radiusMeters;
    private String category;
    private LocalDateTime createdAt;
    private String geoJsonGeometry; // GeoJSON representation
}
