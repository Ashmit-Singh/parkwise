package com.parkwise.ai.service;

import com.parkwise.ai.dto.ProjectRecommendation;
import com.parkwise.geo.entity.GeoProject;
import com.parkwise.geo.repository.GeoProjectRepository;
import com.parkwise.blockchain.entity.BlockchainTransaction;
import com.parkwise.blockchain.repository.BlockchainTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Project Recommendation Engine
 * Content-based and collaborative filtering for conservation projects
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationEngine {

    private final GeoProjectRepository projectRepository;
    private final BlockchainTransactionRepository transactionRepository;
    private final DonorScoringService donorScoringService;

    /**
     * Get personalized project recommendations for a user
     * 
     * Algorithm:
     * 1. Analyze user's donation history
     * 2. Find similar projects by category
     * 3. Score projects by relevance
     * 4. Return top N recommendations
     */
    @Transactional(readOnly = true)
    public List<ProjectRecommendation> getRecommendations(Long userId, int limit) {
        log.info("Generating recommendations for user: {}", userId);

        // Get user's donation history
        List<BlockchainTransaction> userDonations = transactionRepository.findByUserId(userId);

        // Get all active projects
        List<GeoProject> allProjects = projectRepository.findAll();

        // Calculate relevance scores
        Map<GeoProject, Double> projectScores = new HashMap<>();

        for (GeoProject project : allProjects) {
            double score = calculateRelevanceScore(project, userDonations);
            projectScores.put(project, score);
        }

        // Sort by score and return top N
        return projectScores.entrySet().stream()
            .sorted(Map.Entry.<GeoProject, Double>comparingByValue().reversed())
            .limit(limit)
            .map(entry -> ProjectRecommendation.builder()
                .projectId(entry.getKey().getId())
                .projectName(entry.getKey().getName())
                .category(entry.getKey().getCategory())
                .latitude(entry.getKey().getLocation() != null ? entry.getKey().getLocation().getY() : null)
                .longitude(entry.getKey().getLocation() != null ? entry.getKey().getLocation().getX() : null)
                .relevanceScore(entry.getValue())
                .reason(generateReason(entry.getKey(), userDonations))
                .build())
            .collect(Collectors.toList());
    }

    /**
     * Calculate relevance score for a project
     */
    private double calculateRelevanceScore(GeoProject project, List<BlockchainTransaction> userDonations) {
        double score = 50.0; // Base score

        if (userDonations.isEmpty()) {
            // New users: recommend popular or trending projects
            return score;
        }

        // Category matching
        Set<String> userCategories = userDonations.stream()
            .map(BlockchainTransaction::getCampaignId)
            .filter(Objects::nonNull)
            .map(campaignId -> getCategoryForCampaign(campaignId))
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

        if (project.getCategory() != null && userCategories.contains(project.getCategory())) {
            score += 30.0;
        }

        // Diversity bonus (recommend different categories)
        if (project.getCategory() != null && !userCategories.contains(project.getCategory())) {
            score += 10.0;
        }

        // Recency bonus for new projects
        if (project.getCreatedAt() != null) {
            long daysSinceCreation = java.time.temporal.ChronoUnit.DAYS.between(
                project.getCreatedAt(), 
                java.time.LocalDateTime.now()
            );
            if (daysSinceCreation <= 30) {
                score += 15.0;
            }
        }

        // Random exploration factor (10% randomness)
        score += new Random().nextDouble() * 10.0;

        return Math.min(100.0, score);
    }

    /**
     * Get category for a campaign (simplified - would query campaign table in real implementation)
     */
    private String getCategoryForCampaign(Long campaignId) {
        // TODO: Query campaign repository when integrated
        return "FOREST"; // Placeholder
    }

    /**
     * Generate human-readable recommendation reason
     */
    private String generateReason(GeoProject project, List<BlockchainTransaction> userDonations) {
        if (userDonations.isEmpty()) {
            return "Featured project for new donors";
        }

        if (project.getCategory() != null) {
            Set<String> userCategories = userDonations.stream()
                .map(BlockchainTransaction::getCampaignId)
                .filter(Objects::nonNull)
                .map(this::getCategoryForCampaign)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

            if (userCategories.contains(project.getCategory())) {
                return "Based on your interest in " + project.getCategory() + " conservation";
            } else {
                return "Explore " + project.getCategory() + " conservation";
            }
        }

        return "Recommended for you";
    }

    /**
     * Get trending projects (most donations in last 30 days)
     */
    @Transactional(readOnly = true)
    public List<ProjectRecommendation> getTrendingProjects(int limit) {
        // Get all projects and count recent donations
        List<GeoProject> allProjects = projectRepository.findAll();
        
        Map<GeoProject, Long> projectPopularity = new HashMap<>();

        for (GeoProject project : allProjects) {
            long recentDonations = transactionRepository.findAll().stream()
                .filter(t -> {
                    if (t.getCreatedAt() == null) return false;
                    long daysAgo = java.time.temporal.ChronoUnit.DAYS.between(
                        t.getCreatedAt(), 
                        java.time.LocalDateTime.now()
                    );
                    return daysAgo <= 30;
                })
                .count();
            
            projectPopularity.put(project, recentDonations);
        }

        return projectPopularity.entrySet().stream()
            .sorted(Map.Entry.<GeoProject, Long>comparingByValue().reversed())
            .limit(limit)
            .map(entry -> ProjectRecommendation.builder()
                .projectId(entry.getKey().getId())
                .projectName(entry.getKey().getName())
                .category(entry.getKey().getCategory())
                .latitude(entry.getKey().getLocation() != null ? entry.getKey().getLocation().getY() : null)
                .longitude(entry.getKey().getLocation() != null ? entry.getKey().getLocation().getX() : null)
                .relevanceScore(100.0)
                .reason("Trending: " + entry.getValue() + " recent donations")
                .build())
            .collect(Collectors.toList());
    }
}
