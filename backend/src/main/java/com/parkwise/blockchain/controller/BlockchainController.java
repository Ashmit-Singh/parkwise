package com.parkwise.blockchain.controller;

import com.parkwise.blockchain.service.BlockchainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Map;

@RestController
@RequestMapping("/api/v2/blockchain")
@RequiredArgsConstructor
@Slf4j
public class BlockchainController {
    
    private final BlockchainService blockchainService;
    
    /**
     * Record donation on blockchain
     * POST /api/v2/blockchain/donations
     */
    @PostMapping("/donations")
    public ResponseEntity<Map<String, Object>> recordDonation(
            @RequestParam Long donationId,
            @RequestParam String donorAddress,
            @RequestParam BigDecimal amount,
            @RequestParam Long campaignId,
            @RequestParam String receiptHash
    ) {
        log.info("Recording donation on blockchain: {}", donationId);
        
        Map<String, Object> result = blockchainService.recordDonation(
            donationId,
            donorAddress,
            amount,
            campaignId,
            receiptHash
        );
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * Verify donation receipt
     * GET /api/v2/blockchain/donations/{txHash}/verify
     */
    @GetMapping("/donations/{txHash}/verify")
    public ResponseEntity<Map<String, Object>> verifyDonation(
            @PathVariable String txHash
    ) {
        log.info("Verifying donation: {}", txHash);
        
        boolean verified = blockchainService.verifyTransaction(txHash);
        
        return ResponseEntity.ok(Map.of(
            "txHash", txHash,
            "verified", verified,
            "timestamp", System.currentTimeMillis()
        ));
    }
    
    /**
     * Attest impact on blockchain
     * POST /api/v2/blockchain/impact
     */
    @PostMapping("/impact")
    public ResponseEntity<Map<String, Object>> attestImpact(
            @RequestParam Long campaignId,
            @RequestParam String metricType,
            @RequestParam BigInteger value,
            @RequestParam Integer confidenceScore,
            @RequestParam String dataHash
    ) {
        log.info("Attesting impact for campaign: {}", campaignId);
        
        Map<String, Object> result = blockchainService.attestImpact(
            campaignId,
            metricType,
            value,
            confidenceScore,
            dataHash
        );
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * Mint reputation badge
     * POST /api/v2/blockchain/badges
     */
    @PostMapping("/badges")
    public ResponseEntity<Map<String, Object>> mintBadge(
            @RequestParam String userAddress,
            @RequestParam String badgeType,
            @RequestParam Integer donationCount,
            @RequestParam Integer speciesCount,
            @RequestParam Integer points
    ) {
        log.info("Minting badge for user: {}", userAddress);
        
        Map<String, Object> result = blockchainService.mintBadge(
            userAddress,
            badgeType,
            donationCount,
            speciesCount,
            points
        );
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * Get blockchain status
     * GET /api/v2/blockchain/status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        log.info("Getting blockchain status");
        
        Map<String, Object> status = blockchainService.getStatus();
        
        return ResponseEntity.ok(status);
    }
}
