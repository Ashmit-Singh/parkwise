package com.parkwise.experiment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExperimentAnalyticsResponse {
    
    private Long experimentId;
    private String experimentName;
    private String status;
    private List<VariantStatistics> variants;
    private String controlVariantName;
    private String bestVariantName;
    private Boolean isStatisticallySignificant;
    private Double probabilityBetter; // Probability best variant is better than control
    private Integer totalImpressions;
    private Integer totalConversions;
}
