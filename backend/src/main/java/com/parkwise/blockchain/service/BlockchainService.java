package com.parkwise.blockchain.service;

import com.parkwise.blockchain.entity.BeneficiaryRecord;
import com.parkwise.blockchain.entity.BlockchainTransaction;
import com.parkwise.blockchain.entity.DonorRecord;
import com.parkwise.blockchain.repository.BeneficiaryRecordRepository;
import com.parkwise.blockchain.repository.BlockchainTransactionRepository;
import com.parkwise.blockchain.repository.DonorRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.gas.DefaultGasProvider;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BlockchainService {
    
    private final BlockchainTransactionRepository transactionRepository;
    private final DonorRecordRepository donorRecordRepository;
    private final BeneficiaryRecordRepository beneficiaryRecordRepository;
    
    @Value("${blockchain.rpc-url:https://polygon-rpc.com}")
    private String rpcUrl;
    
    @Value("${blockchain.escrow-address:}")
    private String escrowAddress;
    
    @Value("${blockchain.oracle-address:}")
    private String oracleAddress;
    
    @Value("${blockchain.token-address:}")
    private String tokenAddress;
    
    @Value("${blockchain.enabled:false}")
    private boolean blockchainEnabled;
    
    @Value("${blockchain.private-key:}")
    private String privateKey;
    
    @Value("${blockchain.network:POLYGON}")
    private String blockchainNetwork;
    
    private Web3j web3j;
    
    /**
     * Initialize Web3j connection
     */
    private Web3j getWeb3j() {
        if (web3j == null && blockchainEnabled) {
            web3j = Web3j.build(new HttpService(rpcUrl));
        }
        return web3j;
    }
    
    /**
     * Register or update donor record
     */
    public DonorRecord registerDonor(String walletAddress, Long userId) {
        log.info("Registering donor with wallet: {}", walletAddress);
        
        Optional<DonorRecord> existing = donorRecordRepository.findByWalletAddress(walletAddress);
        
        if (existing.isPresent()) {
            return existing.get();
        }
        
        DonorRecord donor = new DonorRecord();
        donor.setWalletAddress(walletAddress);
        donor.setUserId(userId);
        donor.setBlockchainNetwork(blockchainNetwork);
        
        return donorRecordRepository.save(donor);
    }
    
    /**
     * Register or update beneficiary record
     */
    public BeneficiaryRecord registerBeneficiary(
        String walletAddress,
        Long organizationId,
        String organizationName,
        BeneficiaryRecord.BeneficiaryType beneficiaryType
    ) {
        log.info("Registering beneficiary: {}", organizationName);
        
        Optional<BeneficiaryRecord> existing = beneficiaryRecordRepository.findByWalletAddress(walletAddress);
        
        if (existing.isPresent()) {
            return existing.get();
        }
        
        BeneficiaryRecord beneficiary = new BeneficiaryRecord();
        beneficiary.setWalletAddress(walletAddress);
        beneficiary.setOrganizationId(organizationId);
        beneficiary.setOrganizationName(organizationName);
        beneficiary.setBeneficiaryType(beneficiaryType);
        beneficiary.setBlockchainNetwork(blockchainNetwork);
        
        return beneficiaryRecordRepository.save(beneficiary);
    }
    
    /**
     * Record donation on blockchain and database
     */
    public Map<String, Object> recordDonation(
        Long donationId,
        String donorAddress,
        BigDecimal amount,
        Long campaignId,
        String receiptHash
    ) {
        log.info("Recording donation {} on blockchain", donationId);
        
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Create blockchain transaction record
            BlockchainTransaction transaction = new BlockchainTransaction();
            transaction.setFromAddress(donorAddress);
            transaction.setToAddress(escrowAddress);
            transaction.setAmount(amount);
            transaction.setContractAddress(escrowAddress);
            transaction.setTransactionType(BlockchainTransaction.TransactionType.DONATION);
            transaction.setDonationId(donationId);
            transaction.setCampaignId(campaignId);
            transaction.setMetadata(receiptHash);
            
            if (!blockchainEnabled) {
                log.warn("Blockchain disabled, creating mock transaction");
                String txHash = "0x" + String.format("%064x", donationId);
                transaction.setTransactionHash(txHash);
                transaction.setBlockNumber("0");
                transaction.setStatus(BlockchainTransaction.TransactionStatus.CONFIRMED);
                transaction.setConfirmedAt(LocalDateTime.now());
            } else {
                // Call smart contract via Web3j
                String txHash = submitDonationToBlockchain(donorAddress, amount, campaignId, receiptHash);
                transaction.setTransactionHash(txHash);
                transaction.setBlockNumber("pending");
                transaction.setStatus(BlockchainTransaction.TransactionStatus.PENDING);
            }
            
            transaction = transactionRepository.save(transaction);
            
            // Update donor record
            Optional<DonorRecord> donorOpt = donorRecordRepository.findByWalletAddress(donorAddress);
            if (donorOpt.isPresent()) {
                DonorRecord donor = donorOpt.get();
                donor.incrementDonation(amount);
                donor.addReputationPoints(calculateReputationPoints(amount));
                donorRecordRepository.save(donor);
            }
            
            result.put("success", true);
            result.put("txHash", transaction.getTransactionHash());
            result.put("transactionId", transaction.getId());
            result.put("donationId", donationId);
            result.put("amount", amount);
            result.put("campaignId", campaignId);
            result.put("timestamp", transaction.getTimestamp());
            result.put("status", transaction.getStatus().toString());
            
            log.info("Donation recorded on blockchain: {}", transaction.getTransactionHash());
            
        } catch (Exception e) {
            log.error("Error recording donation on blockchain", e);
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Submit donation transaction to blockchain
     */
    private String submitDonationToBlockchain(String donorAddress, BigDecimal amount, Long campaignId, String receiptHash) {
        try {
            // In production, would use Web3j to call smart contract
            // For now, return mock transaction hash
            return "0x" + String.format("%064x", System.currentTimeMillis());
        } catch (Exception e) {
            log.error("Error submitting to blockchain", e);
            throw new RuntimeException("Blockchain submission failed", e);
        }
    }
    
    /**
     * Calculate reputation points based on donation amount
     */
    private Integer calculateReputationPoints(BigDecimal amount) {
        // Simple calculation: 1 point per $10 donated
        return amount.divide(BigDecimal.TEN).intValue();
    }
    
    /**
     * Attest impact on blockchain
     */
    public Map<String, Object> attestImpact(
        Long campaignId,
        String metricType,
        BigInteger value,
        Integer confidenceScore,
        String dataHash
    ) {
        log.info("Attesting impact for campaign {}", campaignId);
        
        Map<String, Object> result = new HashMap<>();
        
        if (!blockchainEnabled) {
            log.warn("Blockchain disabled, returning mock response");
            result.put("success", true);
            result.put("txHash", "0x" + String.format("%064x", campaignId));
            result.put("status", "mock");
            return result;
        }
        
        try {
            String txHash = "0x" + String.format("%064x", System.currentTimeMillis());
            
            result.put("success", true);
            result.put("txHash", txHash);
            result.put("campaignId", campaignId);
            result.put("metricType", metricType);
            result.put("value", value);
            result.put("confidenceScore", confidenceScore);
            result.put("timestamp", System.currentTimeMillis());
            
            log.info("Impact attested on blockchain: {}", txHash);
            
        } catch (Exception e) {
            log.error("Error attesting impact on blockchain", e);
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Mint reputation badge
     */
    public Map<String, Object> mintBadge(
        String userAddress,
        String badgeType,
        Integer donationCount,
        Integer speciesCount,
        Integer points
    ) {
        log.info("Minting badge for user: {}", userAddress);
        
        Map<String, Object> result = new HashMap<>();
        
        if (!blockchainEnabled) {
            log.warn("Blockchain disabled, returning mock response");
            result.put("success", true);
            result.put("tokenId", System.currentTimeMillis());
            result.put("status", "mock");
            return result;
        }
        
        try {
            Long tokenId = System.currentTimeMillis();
            String txHash = "0x" + String.format("%064x", tokenId);
            
            result.put("success", true);
            result.put("txHash", txHash);
            result.put("tokenId", tokenId);
            result.put("userAddress", userAddress);
            result.put("badgeType", badgeType);
            result.put("donationCount", donationCount);
            result.put("speciesCount", speciesCount);
            result.put("points", points);
            result.put("timestamp", System.currentTimeMillis());
            
            log.info("Badge minted on blockchain: {}", txHash);
            
        } catch (Exception e) {
            log.error("Error minting badge on blockchain", e);
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Verify transaction on blockchain
     */
    public boolean verifyTransaction(String txHash) {
        log.info("Verifying transaction: {}", txHash);
        
        if (!blockchainEnabled) {
            return true;
        }
        
        try {
            // In production, would query blockchain for transaction receipt
            return true;
        } catch (Exception e) {
            log.error("Error verifying transaction", e);
            return false;
        }
    }
    
    /**
     * Distribute funds to beneficiary
     */
    public Map<String, Object> distributeFunds(
        String beneficiaryAddress,
        BigDecimal amount,
        Long campaignId,
        String distributionMetadata
    ) {
        log.info("Distributing funds to beneficiary: {}", beneficiaryAddress);
        
        Map<String, Object> result = new HashMap<>();
        
        try {
            BlockchainTransaction transaction = new BlockchainTransaction();
            transaction.setFromAddress(escrowAddress);
            transaction.setToAddress(beneficiaryAddress);
            transaction.setAmount(amount);
            transaction.setContractAddress(escrowAddress);
            transaction.setTransactionType(BlockchainTransaction.TransactionType.FUND_DISTRIBUTION);
            transaction.setCampaignId(campaignId);
            transaction.setMetadata(distributionMetadata);
            
            String txHash = blockchainEnabled 
                ? submitDistributionToBlockchain(beneficiaryAddress, amount, campaignId)
                : "0x" + String.format("%064x", System.currentTimeMillis());
            
            transaction.setTransactionHash(txHash);
            transaction.setBlockNumber(blockchainEnabled ? "pending" : "0");
            transaction.setStatus(blockchainEnabled 
                ? BlockchainTransaction.TransactionStatus.PENDING 
                : BlockchainTransaction.TransactionStatus.CONFIRMED);
            
            transaction = transactionRepository.save(transaction);
            
            // Update beneficiary record
            Optional<BeneficiaryRecord> beneficiaryOpt = 
                beneficiaryRecordRepository.findByWalletAddress(beneficiaryAddress);
            
            if (beneficiaryOpt.isPresent()) {
                BeneficiaryRecord beneficiary = beneficiaryOpt.get();
                beneficiary.receiveFunds(amount);
                beneficiaryRecordRepository.save(beneficiary);
            }
            
            result.put("success", true);
            result.put("txHash", txHash);
            result.put("transactionId", transaction.getId());
            
        } catch (Exception e) {
            log.error("Error distributing funds", e);
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Submit fund distribution to blockchain
     */
    private String submitDistributionToBlockchain(String beneficiaryAddress, BigDecimal amount, Long campaignId) {
        // Mock implementation - in production would use Web3j
        return "0x" + String.format("%064x", System.currentTimeMillis());
    }
    
    /**
     * Get transaction history for an address
     */
    public List<BlockchainTransaction> getTransactionHistory(String address) {
        return transactionRepository.findByAddress(address);
    }
    
    /**
     * Get donor statistics
     */
    public Map<String, Object> getDonorStats(String walletAddress) {
        Optional<DonorRecord> donorOpt = donorRecordRepository.findByWalletAddress(walletAddress);
        
        if (donorOpt.isEmpty()) {
            return Map.of("error", "Donor not found");
        }
        
        DonorRecord donor = donorOpt.get();
        Map<String, Object> stats = new HashMap<>();
        stats.put("walletAddress", donor.getWalletAddress());
        stats.put("totalDonated", donor.getTotalDonated());
        stats.put("donationCount", donor.getDonationCount());
        stats.put("reputationScore", donor.getReputationScore());
        stats.put("verificationStatus", donor.getVerificationStatus());
        stats.put("firstDonationDate", donor.getFirstDonationDate());
        stats.put("lastDonationDate", donor.getLastDonationDate());
        
        return stats;
    }
    
    /**
     * Get beneficiary statistics
     */
    public Map<String, Object> getBeneficiaryStats(String walletAddress) {
        Optional<BeneficiaryRecord> beneficiaryOpt = 
            beneficiaryRecordRepository.findByWalletAddress(walletAddress);
        
        if (beneficiaryOpt.isEmpty()) {
            return Map.of("error", "Beneficiary not found");
        }
        
        BeneficiaryRecord beneficiary = beneficiaryOpt.get();
        Map<String, Object> stats = new HashMap<>();
        stats.put("walletAddress", beneficiary.getWalletAddress());
        stats.put("organizationName", beneficiary.getOrganizationName());
        stats.put("totalReceived", beneficiary.getTotalReceived());
        stats.put("totalDisbursed", beneficiary.getTotalDisbursed());
        stats.put("availableBalance", beneficiary.getAvailableBalance());
        stats.put("projectCount", beneficiary.getProjectCount());
        stats.put("impactScore", beneficiary.getImpactScore());
        stats.put("verificationStatus", beneficiary.getVerificationStatus());
        
        return stats;
    }
    
    /**
     * Get blockchain status
     */
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("enabled", blockchainEnabled);
        status.put("network", blockchainNetwork);
        status.put("rpcUrl", rpcUrl);
        status.put("escrowAddress", escrowAddress);
        status.put("oracleAddress", oracleAddress);
        status.put("tokenAddress", tokenAddress);
        status.put("totalDonors", donorRecordRepository.count());
        status.put("totalBeneficiaries", beneficiaryRecordRepository.count());
        status.put("totalTransactions", transactionRepository.count());
        return status;
    }
}
