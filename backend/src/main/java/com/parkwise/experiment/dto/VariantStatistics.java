package com.parkwise.experiment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VariantStatistics {
    
    private Long variantId;
    private String variantName;
    private Integer impressions;
    private Integer conversions;
    private Double conversionRate;
    private Double confidenceIntervalLower; // 95% CI lower bound
    private Double confidenceIntervalUpper; // 95% CI upper bound
    private Double standardError;
    private Integer sampleSize;
}
