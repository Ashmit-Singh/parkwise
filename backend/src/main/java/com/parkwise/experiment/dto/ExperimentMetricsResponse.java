package com.parkwise.experiment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExperimentMetricsResponse {
    private String experimentName;
    private String variantName;
    private Long sampleSize;
    private Long completedDonations;
    private Long uniqueDonors;
    private BigDecimal averageDonation;
    private BigDecimal totalDonations;
    private Double conversionRate;
}
