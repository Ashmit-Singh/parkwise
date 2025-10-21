package com.parkwise.ai.controller;

import com.parkwise.ai.dto.DonorScoreResponse;
import com.parkwise.ai.dto.ProjectRecommendation;
import com.parkwise.ai.service.DonorScoringService;
import com.parkwise.ai.service.RecommendationEngine;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AI Insights Controller
 * Donor scoring and project recommendations
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "AI Insights", description = "Donor scoring and recommendation APIs")
public class AIInsightsController {

    private final DonorScoringService donorScoringService;
    private final RecommendationEngine recommendationEngine;

    @GetMapping("/donor-score/{userId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'ADMIN')")
    @Operation(summary = "Get donor likelihood score", description = "Calculate donor score based on behavioral patterns")
    public ResponseEntity<DonorScoreResponse> getDonorScore(@PathVariable Long userId) {
        log.info("Calculating donor score for user: {}", userId);
        
        Double score = donorScoringService.calculateDonorScore(userId);
        String classification = classifyDonor(score);
        String recommendation = getRecommendation(classification);

        DonorScoreResponse response = DonorScoreResponse.builder()
            .userId(userId)
            .score(score)
            .classification(classification)
            .recommendation(recommendation)
            .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendations/{userId}")
    @Operation(summary = "Get personalized recommendations", description = "AI-powered project recommendations")
    public ResponseEntity<List<ProjectRecommendation>> getRecommendations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "5") int limit
    ) {
        log.info("Generating recommendations for user: {}", userId);
        List<ProjectRecommendation> recommendations = recommendationEngine.getRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending projects", description = "Most popular projects in last 30 days")
    public ResponseEntity<List<ProjectRecommendation>> getTrendingProjects(
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("Fetching trending projects");
        List<ProjectRecommendation> trending = recommendationEngine.getTrendingProjects(limit);
        return ResponseEntity.ok(trending);
    }

    /**
     * Classify donor based on score
     */
    private String classifyDonor(Double score) {
        if (score >= 80) return "CHAMPION";
        if (score >= 60) return "LOYAL";
        if (score >= 40) return "POTENTIAL";
        return "PROSPECT";
    }

    /**
     * Get recommendation based on classification
     */
    private String getRecommendation(String classification) {
        return switch (classification) {
            case "CHAMPION" -> "VIP treatment: exclusive updates, thank you gifts, recognition";
            case "LOYAL" -> "Engagement: monthly newsletters, impact reports, community events";
            case "POTENTIAL" -> "Nurture: personalized project recommendations, success stories";
            case "PROSPECT" -> "Onboard: welcome email series, first donation incentive";
            default -> "Monitor and engage";
        };
    }
}
