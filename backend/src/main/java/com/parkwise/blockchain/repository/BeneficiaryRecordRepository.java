package com.parkwise.blockchain.repository;

import com.parkwise.blockchain.entity.BeneficiaryRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BeneficiaryRecordRepository extends JpaRepository<BeneficiaryRecord, Long> {
    
    Optional<BeneficiaryRecord> findByWalletAddress(String walletAddress);
    
    Optional<BeneficiaryRecord> findByOrganizationId(Long organizationId);
    
    List<BeneficiaryRecord> findByBeneficiaryType(BeneficiaryRecord.BeneficiaryType beneficiaryType);
    
    List<BeneficiaryRecord> findByVerificationStatus(BeneficiaryRecord.VerificationStatus verificationStatus);
    
    List<BeneficiaryRecord> findByBlockchainNetwork(String blockchainNetwork);
    
    List<BeneficiaryRecord> findByIsActive(Boolean isActive);
    
    @Query("SELECT br FROM BeneficiaryRecord br WHERE br.impactScore >= :minScore ORDER BY br.impactScore DESC")
    List<BeneficiaryRecord> findTopBeneficiariesByImpact(Integer minScore);
    
    @Query("SELECT br FROM BeneficiaryRecord br WHERE br.totalReceived >= :minAmount ORDER BY br.totalReceived DESC")
    List<BeneficiaryRecord> findTopBeneficiariesByFunding(java.math.BigDecimal minAmount);
    
    @Query("SELECT COUNT(br) FROM BeneficiaryRecord br WHERE br.verificationStatus = :status")
    Long countByVerificationStatus(BeneficiaryRecord.VerificationStatus status);
    
    @Query("SELECT SUM(br.totalReceived) FROM BeneficiaryRecord br WHERE br.isActive = true")
    java.math.BigDecimal getTotalReceivedAmount();
    
    @Query("SELECT br FROM BeneficiaryRecord br WHERE (br.totalReceived - br.totalDisbursed) >= :minBalance")
    List<BeneficiaryRecord> findByMinimumBalance(java.math.BigDecimal minBalance);
}
