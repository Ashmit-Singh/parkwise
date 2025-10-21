package com.parkwise.experiment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventLogRequest {
    private Long userId;
    private Long experimentId;
    private Long variantId;
    private String eventType;
    private String eventValue;
    private Map<String, Object> metadata;
}
