package com.parkwise.blockchain.repository;

import com.parkwise.blockchain.entity.BlockchainTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BlockchainTransactionRepository extends JpaRepository<BlockchainTransaction, Long> {
    
    Optional<BlockchainTransaction> findByTransactionHash(String transactionHash);
    
    List<BlockchainTransaction> findByFromAddress(String fromAddress);
    
    List<BlockchainTransaction> findByToAddress(String toAddress);
    
    List<BlockchainTransaction> findByDonationId(Long donationId);
    
    List<BlockchainTransaction> findByCampaignId(Long campaignId);
    
    List<BlockchainTransaction> findByTransactionType(BlockchainTransaction.TransactionType transactionType);
    
    List<BlockchainTransaction> findByStatus(BlockchainTransaction.TransactionStatus status);
    
    @Query("SELECT bt FROM BlockchainTransaction bt WHERE bt.fromAddress = :address OR bt.toAddress = :address")
    List<BlockchainTransaction> findByAddress(String address);
    
    @Query("SELECT bt FROM BlockchainTransaction bt WHERE bt.timestamp BETWEEN :startDate AND :endDate")
    List<BlockchainTransaction> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT bt FROM BlockchainTransaction bt WHERE bt.status = :status AND bt.transactionType = :type")
    List<BlockchainTransaction> findByStatusAndType(
        BlockchainTransaction.TransactionStatus status, 
        BlockchainTransaction.TransactionType type
    );
}
