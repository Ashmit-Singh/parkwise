package com.parkwise.security.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Web3LoginRequest {

    @NotBlank(message = "Wallet address is required")
    private String walletAddress;

    @NotBlank(message = "Message is required")
    private String message;

    @NotBlank(message = "Signature is required")
    private String signature;

    private String name; // Optional for registration
}
