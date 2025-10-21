package com.parkwise.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectRecommendation {
    
    private Long projectId;
    private String projectName;
    private String category;
    private Double latitude;
    private Double longitude;
    private Double relevanceScore; // 0-100
    private String reason; // Why recommended
}
