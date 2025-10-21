package com.parkwise.blockchain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donor_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonorRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String walletAddress;
    
    private Long userId;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal totalDonated;
    
    @Column(nullable = false)
    private Integer donationCount;
    
    @Column(nullable = false)
    private Integer reputationScore;
    
    @Column(nullable = false)
    private String blockchainNetwork; // ETHEREUM, POLYGON, etc.
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;
    
    private String kycHash; // Hash of KYC document on IPFS
    
    private LocalDateTime firstDonationDate;
    
    private LocalDateTime lastDonationDate;
    
    @Column(length = 2000)
    private String metadata;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
        if (totalDonated == null) {
            totalDonated = BigDecimal.ZERO;
        }
        if (donationCount == null) {
            donationCount = 0;
        }
        if (reputationScore == null) {
            reputationScore = 0;
        }
        if (verificationStatus == null) {
            verificationStatus = VerificationStatus.UNVERIFIED;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum VerificationStatus {
        UNVERIFIED,
        PENDING,
        VERIFIED,
        REJECTED
    }
    
    public void incrementDonation(BigDecimal amount) {
        this.totalDonated = this.totalDonated.add(amount);
        this.donationCount++;
        this.lastDonationDate = LocalDateTime.now();
        if (this.firstDonationDate == null) {
            this.firstDonationDate = LocalDateTime.now();
        }
    }
    
    public void addReputationPoints(Integer points) {
        this.reputationScore += points;
    }
}
