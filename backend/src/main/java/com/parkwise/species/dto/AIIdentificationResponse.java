package com.parkwise.species.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIIdentificationResponse {
    private Long submissionId;
    private boolean success;
    private String error;
    private Prediction topPrediction;
    private List<Prediction> allPredictions;
    private long processingTimeMs;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Prediction {
        private String commonName;
        private String scientificName;
        private double confidence;
        private String category;
        private String conservationStatus;
    }
}
