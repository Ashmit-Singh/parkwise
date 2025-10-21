package com.parkwise.experiment.service;

import com.parkwise.experiment.dto.ExperimentAnalyticsResponse;
import com.parkwise.experiment.dto.VariantStatistics;
import com.parkwise.experiment.entity.Experiment;
import com.parkwise.experiment.entity.ExperimentVariant;
import com.parkwise.experiment.repository.ExperimentRepository;
import com.parkwise.experiment.repository.ExperimentVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Advanced Analytics Service for A/B Testing
 * Provides statistical analysis, confidence intervals, and significance testing
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ExperimentAnalyticsService {

    private final ExperimentRepository experimentRepository;
    private final ExperimentVariantRepository variantRepository;
    private final ThompsonSamplingService thompsonSamplingService;

    /**
     * Get comprehensive analytics for an experiment
     */
    @Transactional(readOnly = true)
    public ExperimentAnalyticsResponse getAnalytics(Long experimentId) {
        Experiment experiment = experimentRepository.findById(experimentId)
            .orElseThrow(() -> new IllegalArgumentException("Experiment not found: " + experimentId));

        List<ExperimentVariant> variants = variantRepository.findByExperimentId(experimentId);

        // Calculate statistics for each variant
        List<VariantStatistics> variantStats = variants.stream()
            .map(this::calculateVariantStatistics)
            .collect(Collectors.toList());

        // Find control and best performing variant
        ExperimentVariant control = variants.stream()
            .filter(v -> "CONTROL".equalsIgnoreCase(v.getVariantName()))
            .findFirst()
            .orElse(variants.get(0));

        ExperimentVariant bestVariant = findBestVariant(variants);

        // Calculate statistical significance
        boolean isSignificant = false;
        Double probabilityBetter = null;

        if (!control.equals(bestVariant)) {
            probabilityBetter = thompsonSamplingService.calculateProbabilityBetter(
                bestVariant, control, 10000
            );
            isSignificant = probabilityBetter >= 0.95;
        }

        return ExperimentAnalyticsResponse.builder()
            .experimentId(experimentId)
            .experimentName(experiment.getName())
            .status(experiment.getStatus().name())
            .variants(variantStats)
            .controlVariantName(control.getVariantName())
            .bestVariantName(bestVariant.getVariantName())
            .isStatisticallySignificant(isSignificant)
            .probabilityBetter(probabilityBetter)
            .totalImpressions(variants.stream().mapToInt(v -> v.getImpressionCount() != null ? v.getImpressionCount() : 0).sum())
            .totalConversions(variants.stream().mapToInt(v -> v.getConversionCount() != null ? v.getConversionCount() : 0).sum())
            .build();
    }

    /**
     * Calculate statistics for a single variant
     */
    private VariantStatistics calculateVariantStatistics(ExperimentVariant variant) {
        int impressions = variant.getImpressionCount() != null ? variant.getImpressionCount() : 0;
        int conversions = variant.getConversionCount() != null ? variant.getConversionCount() : 0;

        double conversionRate = impressions > 0 ? (double) conversions / impressions : 0.0;
        
        // Calculate 95% confidence interval using Wilson score interval
        double[] confidenceInterval = calculateWilsonConfidenceInterval(conversions, impressions, 0.95);

        // Calculate standard error
        double standardError = impressions > 0 ? 
            Math.sqrt(conversionRate * (1 - conversionRate) / impressions) : 0.0;

        return VariantStatistics.builder()
            .variantId(variant.getId())
            .variantName(variant.getVariantName())
            .impressions(impressions)
            .conversions(conversions)
            .conversionRate(conversionRate)
            .confidenceIntervalLower(confidenceInterval[0])
            .confidenceIntervalUpper(confidenceInterval[1])
            .standardError(standardError)
            .sampleSize(impressions)
            .build();
    }

    /**
     * Calculate Wilson score confidence interval
     * More accurate than normal approximation for small sample sizes
     */
    private double[] calculateWilsonConfidenceInterval(int successes, int total, double confidence) {
        if (total == 0) {
            return new double[]{0.0, 0.0};
        }

        double p = (double) successes / total;
        double z = getZScore(confidence); // 1.96 for 95% confidence
        
        double denominator = 1 + (z * z) / total;
        double center = p + (z * z) / (2 * total);
        double offset = z * Math.sqrt((p * (1 - p) / total) + (z * z) / (4 * total * total));

        double lower = (center - offset) / denominator;
        double upper = (center + offset) / denominator;

        return new double[]{
            Math.max(0.0, lower),
            Math.min(1.0, upper)
        };
    }

    /**
     * Get z-score for confidence level
     */
    private double getZScore(double confidence) {
        // Common confidence levels
        if (confidence == 0.90) return 1.645;
        if (confidence == 0.95) return 1.96;
        if (confidence == 0.99) return 2.576;
        return 1.96; // Default to 95%
    }

    /**
     * Find best performing variant by conversion rate
     */
    private ExperimentVariant findBestVariant(List<ExperimentVariant> variants) {
        return variants.stream()
            .max((v1, v2) -> {
                double rate1 = calculateConversionRate(v1);
                double rate2 = calculateConversionRate(v2);
                return Double.compare(rate1, rate2);
            })
            .orElse(variants.get(0));
    }

    /**
     * Calculate conversion rate for a variant
     */
    private double calculateConversionRate(ExperimentVariant variant) {
        int impressions = variant.getImpressionCount() != null ? variant.getImpressionCount() : 0;
        int conversions = variant.getConversionCount() != null ? variant.getConversionCount() : 0;
        return impressions > 0 ? (double) conversions / impressions : 0.0;
    }
}
