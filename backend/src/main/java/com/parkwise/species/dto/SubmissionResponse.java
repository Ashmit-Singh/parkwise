package com.parkwise.species.dto;

import com.parkwise.species.entity.AIPrediction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponse {
    private Long submissionId;
    private String status;
    private String message;
    private String imageUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String locationName;
    private AIPrediction aiPrediction;
}
