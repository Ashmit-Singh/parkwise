package com.parkwise.blockchain.controller;

import com.parkwise.blockchain.dto.DonationRequest;
import com.parkwise.blockchain.dto.DonationResponse;
import com.parkwise.blockchain.dto.TransactionStatusResponse;
import com.parkwise.blockchain.service.Web3DonationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Blockchain Donation Controller
 * Handles Web3 donations, transaction verification, and blockchain interactions
 */
@RestController
@RequestMapping("/api/blockchain")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Blockchain", description = "Web3 donation and blockchain verification endpoints")
public class Web3DonationController {

    private final Web3DonationService donationService;

    @PostMapping("/donate")
    @PreAuthorize("hasAnyRole('DONOR', 'ADMIN')")
    @Operation(summary = "Submit blockchain donation", description = "Record a donation made via Web3 wallet")
    public ResponseEntity<DonationResponse> submitDonation(
            @Valid @RequestBody DonationRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        log.info("Processing donation from wallet: {}", request.getWalletAddress());
        DonationResponse response = donationService.processDonation(request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify/{txHash}")
    @Operation(summary = "Verify transaction", description = "Verify blockchain transaction status")
    public ResponseEntity<TransactionStatusResponse> verifyTransaction(
            @PathVariable String txHash
    ) {
        log.info("Verifying transaction: {}", txHash);
        TransactionStatusResponse status = donationService.getTransactionStatus(txHash);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/donations/user")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user donations", description = "Retrieve all donations for authenticated user")
    public ResponseEntity<List<DonationResponse>> getUserDonations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        log.info("Fetching donations for user: {}", userDetails.getUsername());
        List<DonationResponse> donations = donationService.getUserDonations(userDetails.getUsername());
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/donations/campaign/{campaignId}")
    @Operation(summary = "Get campaign donations", description = "Retrieve all donations for a campaign")
    public ResponseEntity<List<DonationResponse>> getCampaignDonations(
            @PathVariable Long campaignId
    ) {
        log.info("Fetching donations for campaign: {}", campaignId);
        List<DonationResponse> donations = donationService.getCampaignDonations(campaignId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/stats/network")
    @Operation(summary = "Get network stats", description = "Retrieve blockchain network statistics")
    public ResponseEntity<Map<String, Object>> getNetworkStats() {
        Map<String, Object> stats = donationService.getNetworkStatistics();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/release-funds")
    @PreAuthorize("hasAnyRole('NGO', 'ADMIN')")
    @Operation(summary = "Release escrow funds", description = "Release funds from escrow contract")
    public ResponseEntity<Map<String, Object>> releaseFunds(
            @RequestParam Long campaignId,
            @RequestParam String recipientAddress
    ) {
        log.info("Releasing funds for campaign {} to {}", campaignId, recipientAddress);
        Map<String, Object> result = donationService.releaseFunds(campaignId, recipientAddress);
        return ResponseEntity.ok(result);
    }
}
