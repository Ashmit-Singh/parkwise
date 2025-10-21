package com.parkwise.blockchain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String transactionHash;
    
    @Column(nullable = false)
    private String blockNumber;
    
    @Column(nullable = false)
    private String fromAddress;
    
    @Column(nullable = false)
    private String toAddress;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal amount;
    
    @Column(nullable = false)
    private String contractAddress;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;
    
    private Long donationId;
    
    private Long campaignId;
    
    @Column(length = 2000)
    private String metadata;
    
    private BigDecimal gasUsed;
    
    private BigDecimal gasPrice;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    private LocalDateTime confirmedAt;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (status == null) {
            status = TransactionStatus.PENDING;
        }
    }
    
    public enum TransactionType {
        DONATION,
        FUND_DISTRIBUTION,
        REPUTATION_REWARD,
        IMPACT_VERIFICATION,
        ESCROW_RELEASE
    }
    
    public enum TransactionStatus {
        PENDING,
        CONFIRMED,
        FAILED,
        REVERTED
    }
}
