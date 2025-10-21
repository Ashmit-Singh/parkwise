package com.parkwise.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonorScoreResponse {
    
    private Long userId;
    private Double score; // 0-100
    private String classification; // CHAMPION, LOYAL, PROSPECT, etc.
    private String recommendation;
}
