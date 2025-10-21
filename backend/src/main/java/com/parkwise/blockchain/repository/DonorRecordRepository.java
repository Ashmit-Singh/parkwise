package com.parkwise.blockchain.repository;

import com.parkwise.blockchain.entity.DonorRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRecordRepository extends JpaRepository<DonorRecord, Long> {
    
    Optional<DonorRecord> findByWalletAddress(String walletAddress);
    
    Optional<DonorRecord> findByUserId(Long userId);
    
    List<DonorRecord> findByBlockchainNetwork(String blockchainNetwork);
    
    List<DonorRecord> findByVerificationStatus(DonorRecord.VerificationStatus verificationStatus);
    
    List<DonorRecord> findByIsActive(Boolean isActive);
    
    @Query("SELECT dr FROM DonorRecord dr WHERE dr.reputationScore >= :minScore ORDER BY dr.reputationScore DESC")
    List<DonorRecord> findTopDonorsByReputation(Integer minScore);
    
    @Query("SELECT dr FROM DonorRecord dr WHERE dr.totalDonated >= :minAmount ORDER BY dr.totalDonated DESC")
    List<DonorRecord> findTopDonorsByAmount(java.math.BigDecimal minAmount);
    
    @Query("SELECT COUNT(dr) FROM DonorRecord dr WHERE dr.verificationStatus = :status")
    Long countByVerificationStatus(DonorRecord.VerificationStatus status);
    
    @Query("SELECT SUM(dr.totalDonated) FROM DonorRecord dr WHERE dr.isActive = true")
    java.math.BigDecimal getTotalDonatedAmount();
}
