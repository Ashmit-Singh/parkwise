package com.parkwise.blockchain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonationResponse {

    private Long id;
    private String transactionHash;
    private String blockNumber;
    private String donorAddress;
    private BigDecimal amount;
    private String status;
    private Long campaignId;
    private String campaignName;
    private LocalDateTime timestamp;
    private String explorerUrl;
    private BigDecimal gasFee;
}
