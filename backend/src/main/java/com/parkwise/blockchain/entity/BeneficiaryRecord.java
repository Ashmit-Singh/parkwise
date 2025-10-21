package com.parkwise.blockchain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "beneficiary_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String walletAddress;
    
    private Long organizationId;
    
    @Column(nullable = false)
    private String organizationName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BeneficiaryType beneficiaryType;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal totalReceived;
    
    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal totalDisbursed;
    
    @Column(nullable = false)
    private Integer projectCount;
    
    @Column(nullable = false)
    private Integer impactScore;
    
    @Column(nullable = false)
    private String blockchainNetwork;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;
    
    private String registrationHash; // Hash of registration document on IPFS
    
    private String taxIdHash; // Hash of tax ID on IPFS
    
    @Column(length = 2000)
    private String metadata;
    
    private LocalDateTime lastFundingDate;
    
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
        if (totalReceived == null) {
            totalReceived = BigDecimal.ZERO;
        }
        if (totalDisbursed == null) {
            totalDisbursed = BigDecimal.ZERO;
        }
        if (projectCount == null) {
            projectCount = 0;
        }
        if (impactScore == null) {
            impactScore = 0;
        }
        if (verificationStatus == null) {
            verificationStatus = VerificationStatus.UNVERIFIED;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum BeneficiaryType {
        NGO,
        GOVERNMENT_AGENCY,
        RESEARCH_INSTITUTION,
        CONSERVATION_TRUST,
        COMMUNITY_ORGANIZATION
    }
    
    public enum VerificationStatus {
        UNVERIFIED,
        PENDING,
        VERIFIED,
        SUSPENDED,
        REJECTED
    }
    
    public void receiveFunds(BigDecimal amount) {
        this.totalReceived = this.totalReceived.add(amount);
        this.lastFundingDate = LocalDateTime.now();
    }
    
    public void disburseFunds(BigDecimal amount) {
        this.totalDisbursed = this.totalDisbursed.add(amount);
    }
    
    public void addImpactPoints(Integer points) {
        this.impactScore += points;
    }
    
    public BigDecimal getAvailableBalance() {
        return totalReceived.subtract(totalDisbursed);
    }
}
