package com.parkwise.experiment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExperimentAssignmentResponse {
    private Long experimentId;
    private String experimentName;
    private Long variantId;
    private String variantName;
    private String description;
    private Long userId;
}
