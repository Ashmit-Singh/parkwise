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
public class DonationEventRequest {
    private Long userId;
    private Long campaignId;
    private Long experimentId;
    private Long variantId;
    private BigDecimal donationAmount;
    private String donationStatus;
}
