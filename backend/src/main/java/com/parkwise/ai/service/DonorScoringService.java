package com.parkwise.ai.service;

import com.parkwise.integration.entity.User;
import com.parkwise.integration.repository.UserRepository;
import com.parkwise.blockchain.entity.BlockchainTransaction;
import com.parkwise.blockchain.repository.BlockchainTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Donor Scoring Service
 * Predicts donor likelihood based on behavioral patterns
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DonorScoringService {

    private final UserRepository userRepository;
    private final BlockchainTransactionRepository transactionRepository;

    /**
     * Calculate donor likelihood score (0-100)
     * 
     * Factors:
     * - Donation frequency
     * - Total donation amount
     * - Recency of last donation
     * - Average donation size
     * - Engagement patterns
     */
    @Transactional(readOnly = true)
    public Double calculateDonorScore(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        List<BlockchainTransaction> donations = transactionRepository.findByUserId(userId);

        if (donations.isEmpty()) {
            return calculateProspectScore(user);
        }

        double frequencyScore = calculateFrequencyScore(donations);
        double recencyScore = calculateRecencyScore(donations);
        double amountScore = calculateAmountScore(donations);
        double consistencyScore = calculateConsistencyScore(donations);

        // Weighted average
        double totalScore = (frequencyScore * 0.3) +
                           (recencyScore * 0.25) +
                           (amountScore * 0.25) +
                           (consistencyScore * 0.20);

        log.info("Donor score for user {}: {}", userId, totalScore);
        return Math.min(100.0, totalScore);
    }

    /**
     * Calculate frequency score (how often user donates)
     */
    private double calculateFrequencyScore(List<BlockchainTransaction> donations) {
        int donationCount = donations.size();

        if (donationCount >= 20) return 100.0;
        if (donationCount >= 10) return 80.0;
        if (donationCount >= 5) return 60.0;
        if (donationCount >= 2) return 40.0;
        return 20.0;
    }

    /**
     * Calculate recency score (how recent was last donation)
     */
    private double calculateRecencyScore(List<BlockchainTransaction> donations) {
        LocalDateTime lastDonation = donations.stream()
            .map(BlockchainTransaction::getCreatedAt)
            .max(LocalDateTime::compareTo)
            .orElse(LocalDateTime.now().minusYears(10));

        long daysSinceLastDonation = ChronoUnit.DAYS.between(lastDonation, LocalDateTime.now());

        if (daysSinceLastDonation <= 7) return 100.0;
        if (daysSinceLastDonation <= 30) return 80.0;
        if (daysSinceLastDonation <= 90) return 60.0;
        if (daysSinceLastDonation <= 180) return 40.0;
        if (daysSinceLastDonation <= 365) return 20.0;
        return 10.0;
    }

    /**
     * Calculate amount score (total donation value)
     */
    private double calculateAmountScore(List<BlockchainTransaction> donations) {
        BigDecimal totalAmount = donations.stream()
            .map(d -> d.getAmount() != null ? d.getAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        double total = totalAmount.doubleValue();

        if (total >= 1000) return 100.0;
        if (total >= 500) return 80.0;
        if (total >= 100) return 60.0;
        if (total >= 50) return 40.0;
        if (total >= 10) return 20.0;
        return 10.0;
    }

    /**
     * Calculate consistency score (regular donation pattern)
     */
    private double calculateConsistencyScore(List<BlockchainTransaction> donations) {
        if (donations.size() < 2) {
            return 20.0;
        }

        // Calculate coefficient of variation for donation amounts
        double avgAmount = donations.stream()
            .mapToDouble(d -> d.getAmount() != null ? d.getAmount().doubleValue() : 0.0)
            .average()
            .orElse(0.0);

        double variance = donations.stream()
            .mapToDouble(d -> {
                double amt = d.getAmount() != null ? d.getAmount().doubleValue() : 0.0;
                return Math.pow(amt - avgAmount, 2);
            })
            .average()
            .orElse(0.0);

        double stdDev = Math.sqrt(variance);
        double cv = avgAmount > 0 ? (stdDev / avgAmount) : 1.0;

        // Lower CV = more consistent = higher score
        if (cv < 0.2) return 100.0;
        if (cv < 0.4) return 80.0;
        if (cv < 0.6) return 60.0;
        if (cv < 0.8) return 40.0;
        return 20.0;
    }

    /**
     * Calculate score for prospects (users with no donations)
     */
    private double calculateProspectScore(User user) {
        double baseScore = 30.0;

        // Bonus if user has wallet connected
        if (user.getWalletAddress() != null && !user.getWalletAddress().isEmpty()) {
            baseScore += 20.0;
        }

        // Bonus if user registered recently (more engaged)
        if (user.getCreatedAt() != null) {
            long daysSinceRegistration = ChronoUnit.DAYS.between(user.getCreatedAt(), LocalDateTime.now());
            if (daysSinceRegistration <= 7) {
                baseScore += 15.0;
            } else if (daysSinceRegistration <= 30) {
                baseScore += 10.0;
            }
        }

        return baseScore;
    }
}
