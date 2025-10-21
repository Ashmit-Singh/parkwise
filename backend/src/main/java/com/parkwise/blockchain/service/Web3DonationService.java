package com.parkwise.blockchain.service;

import com.parkwise.blockchain.dto.DonationRequest;
import com.parkwise.blockchain.dto.DonationResponse;
import com.parkwise.blockchain.dto.TransactionStatusResponse;
import com.parkwise.blockchain.entity.BlockchainTransaction;
import com.parkwise.blockchain.repository.BlockchainTransactionRepository;
import com.parkwise.integration.entity.User;
import com.parkwise.integration.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthBlock;
import org.web3j.protocol.core.methods.response.EthTransaction;
import org.web3j.protocol.core.methods.response.Transaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Web3 Donation Service
 * Handles blockchain donation processing, verification, and transaction monitoring
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class Web3DonationService {

    private final BlockchainTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    
    @Value("${blockchain.rpc-url:https://polygon-rpc.com}")
    private String rpcUrl;
    
    @Value("${blockchain.enabled:false}")
    private boolean blockchainEnabled;
    
    @Value("${blockchain.network:POLYGON}")
    private String network;
    
    @Value("${blockchain.explorer-url:https://polygonscan.com/tx/}")
    private String explorerUrl;
    
    private Web3j web3j;

    /**
     * Initialize Web3j connection lazily
     */
    private Web3j getWeb3j() {
        if (web3j == null && blockchainEnabled) {
            web3j = Web3j.build(new HttpService(rpcUrl));
            log.info("Connected to blockchain network: {}", network);
        }
        return web3j;
    }

    /**
     * Process donation transaction
     */
    @Transactional
    public DonationResponse processDonation(DonationRequest request, String userEmail) {
        log.info("Processing donation: txHash={}, amount={}", request.getTransactionHash(), request.getAmount());
        
        // Find user
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if transaction already exists
        Optional<BlockchainTransaction> existing = transactionRepository
            .findByTransactionHash(request.getTransactionHash());
        
        if (existing.isPresent()) {
            log.warn("Transaction already recorded: {}", request.getTransactionHash());
            return mapToResponse(existing.get());
        }
        
        // Verify transaction on blockchain
        TransactionReceipt receipt = null;
        if (blockchainEnabled) {
            try {
                receipt = verifyBlockchainTransaction(request.getTransactionHash());
            } catch (Exception e) {
                log.error("Failed to verify transaction: {}", e.getMessage());
                throw new RuntimeException("Transaction verification failed: " + e.getMessage());
            }
        }
        
        // Create transaction record
        BlockchainTransaction transaction = new BlockchainTransaction();
        transaction.setTransactionHash(request.getTransactionHash());
        transaction.setFromAddress(request.getWalletAddress());
        transaction.setToAddress(receipt != null ? receipt.getTo() : "0x0");
        transaction.setAmount(request.getAmount());
        transaction.setContractAddress(receipt != null ? receipt.getContractAddress() : "");
        transaction.setTransactionType(BlockchainTransaction.TransactionType.DONATION);
        transaction.setCampaignId(request.getCampaignId());
        transaction.setDonationId(null); // Will be set when donation is created
        transaction.setTimestamp(LocalDateTime.now());
        
        if (receipt != null) {
            transaction.setBlockNumber(receipt.getBlockNumber().toString());
            transaction.setStatus(receipt.isStatusOK() 
                ? BlockchainTransaction.TransactionStatus.CONFIRMED
                : BlockchainTransaction.TransactionStatus.FAILED);
            transaction.setConfirmedAt(LocalDateTime.now());
            transaction.setGasUsed(new BigDecimal(receipt.getGasUsed()));
        } else {
            transaction.setBlockNumber("0");
            transaction.setStatus(BlockchainTransaction.TransactionStatus.PENDING);
        }
        
        // Save transaction
        BlockchainTransaction saved = transactionRepository.save(transaction);
        log.info("Donation recorded: id={}, txHash={}", saved.getId(), saved.getTransactionHash());
        
        return mapToResponse(saved);
    }

    /**
     * Get transaction status
     */
    @Transactional(readOnly = true)
    public TransactionStatusResponse getTransactionStatus(String txHash) {
        Optional<BlockchainTransaction> transaction = transactionRepository.findByTransactionHash(txHash);
        
        if (transaction.isEmpty()) {
            // Try to fetch from blockchain
            if (blockchainEnabled) {
                try {
                    TransactionReceipt receipt = verifyBlockchainTransaction(txHash);
                    return TransactionStatusResponse.builder()
                        .transactionHash(txHash)
                        .status(receipt.isStatusOK() ? "CONFIRMED" : "FAILED")
                        .blockNumber(receipt.getBlockNumber().toString())
                        .confirmations(getConfirmations(receipt.getBlockNumber()))
                        .timestamp(LocalDateTime.now())
                        .verified(true)
                        .build();
                } catch (Exception e) {
                    log.error("Transaction not found: {}", txHash);
                    return TransactionStatusResponse.builder()
                        .transactionHash(txHash)
                        .status("NOT_FOUND")
                        .verified(false)
                        .errorMessage("Transaction not found on blockchain")
                        .build();
                }
            }
            
            return TransactionStatusResponse.builder()
                .transactionHash(txHash)
                .status("NOT_FOUND")
                .verified(false)
                .build();
        }
        
        BlockchainTransaction tx = transaction.get();
        return TransactionStatusResponse.builder()
            .transactionHash(tx.getTransactionHash())
            .status(tx.getStatus().name())
            .blockNumber(tx.getBlockNumber())
            .timestamp(tx.getTimestamp())
            .verified(tx.getStatus() == BlockchainTransaction.TransactionStatus.CONFIRMED)
            .build();
    }

    /**
     * Get user donations
     */
    @Transactional(readOnly = true)
    public List<DonationResponse> getUserDonations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getWalletAddress() == null) {
            return List.of();
        }
        
        List<BlockchainTransaction> transactions = transactionRepository
            .findByFromAddress(user.getWalletAddress());
        
        return transactions.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get campaign donations
     */
    @Transactional(readOnly = true)
    public List<DonationResponse> getCampaignDonations(Long campaignId) {
        List<BlockchainTransaction> transactions = transactionRepository.findByCampaignId(campaignId);
        
        return transactions.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get network statistics
     */
    public Map<String, Object> getNetworkStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            if (blockchainEnabled && getWeb3j() != null) {
                BigInteger blockNumber = web3j.ethBlockNumber().send().getBlockNumber();
                stats.put("latestBlock", blockNumber.toString());
                stats.put("network", network);
                stats.put("rpcUrl", rpcUrl);
                stats.put("enabled", true);
            } else {
                stats.put("enabled", false);
                stats.put("network", network);
            }
            
            // Add database stats
            long totalDonations = transactionRepository.count();
            stats.put("totalTransactions", totalDonations);
            
        } catch (Exception e) {
            log.error("Failed to fetch network stats", e);
            stats.put("error", e.getMessage());
        }
        
        return stats;
    }

    /**
     * Release escrow funds (NGO/ADMIN only)
     */
    @Transactional
    public Map<String, Object> releaseFunds(Long campaignId, String recipientAddress) {
        log.info("Releasing funds for campaign {} to {}", campaignId, recipientAddress);
        
        // TODO: Implement smart contract interaction for escrow release
        // For now, create a transaction record
        
        BlockchainTransaction transaction = new BlockchainTransaction();
        transaction.setTransactionHash("0x" + System.currentTimeMillis());
        transaction.setFromAddress("ESCROW_CONTRACT");
        transaction.setToAddress(recipientAddress);
        transaction.setAmount(BigDecimal.ZERO); // Get from campaign
        transaction.setContractAddress("");
        transaction.setTransactionType(BlockchainTransaction.TransactionType.ESCROW_RELEASE);
        transaction.setCampaignId(campaignId);
        transaction.setBlockNumber("0");
        transaction.setStatus(BlockchainTransaction.TransactionStatus.PENDING);
        transaction.setTimestamp(LocalDateTime.now());
        
        BlockchainTransaction saved = transactionRepository.save(transaction);
        
        return Map.of(
            "success", true,
            "transactionHash", saved.getTransactionHash(),
            "campaignId", campaignId,
            "recipient", recipientAddress
        );
    }

    /**
     * Verify transaction on blockchain
     */
    private TransactionReceipt verifyBlockchainTransaction(String txHash) throws Exception {
        if (!blockchainEnabled || getWeb3j() == null) {
            throw new RuntimeException("Blockchain not enabled");
        }
        
        Optional<TransactionReceipt> receipt = web3j.ethGetTransactionReceipt(txHash)
            .send()
            .getTransactionReceipt();
        
        if (receipt.isEmpty()) {
            throw new RuntimeException("Transaction not found on blockchain");
        }
        
        return receipt.get();
    }

    /**
     * Get confirmation count
     */
    private Integer getConfirmations(BigInteger txBlockNumber) {
        try {
            if (blockchainEnabled && getWeb3j() != null) {
                BigInteger latestBlock = web3j.ethBlockNumber().send().getBlockNumber();
                return latestBlock.subtract(txBlockNumber).intValue();
            }
        } catch (Exception e) {
            log.error("Failed to get confirmations", e);
        }
        return 0;
    }

    /**
     * Map entity to response DTO
     */
    private DonationResponse mapToResponse(BlockchainTransaction tx) {
        return DonationResponse.builder()
            .id(tx.getId())
            .transactionHash(tx.getTransactionHash())
            .blockNumber(tx.getBlockNumber())
            .donorAddress(tx.getFromAddress())
            .amount(tx.getAmount())
            .status(tx.getStatus().name())
            .campaignId(tx.getCampaignId())
            .timestamp(tx.getTimestamp())
            .explorerUrl(explorerUrl + tx.getTransactionHash())
            .gasFee(tx.getGasUsed())
            .build();
    }
}
