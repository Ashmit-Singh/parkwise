package com.parkwise.blockchain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionStatusResponse {

    private String transactionHash;
    private String status; // PENDING, CONFIRMED, FAILED
    private String blockNumber;
    private Integer confirmations;
    private LocalDateTime timestamp;
    private Boolean verified;
    private String errorMessage;
}
