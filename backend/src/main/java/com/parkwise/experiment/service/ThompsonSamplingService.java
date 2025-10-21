package com.parkwise.experiment.service;

import com.parkwise.experiment.entity.Experiment;
import com.parkwise.experiment.entity.ExperimentVariant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

/**
 * Thompson Sampling Service
 * Implements Bayesian A/B testing with dynamic variant selection
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ThompsonSamplingService {

    private final Random random = new Random();

    /**
     * Select variant using Thompson Sampling (Beta distribution)
     * 
     * Algorithm:
     * 1. For each variant, sample from Beta(successes + 1, failures + 1)
     * 2. Select variant with highest sample
     * 
     * @param variants List of experiment variants
     * @return Selected variant based on Thompson Sampling
     */
    public ExperimentVariant selectVariant(List<ExperimentVariant> variants) {
        if (variants == null || variants.isEmpty()) {
            throw new IllegalArgumentException("Variants list cannot be empty");
        }

        if (variants.size() == 1) {
            return variants.get(0);
        }

        double maxSample = Double.NEGATIVE_INFINITY;
        ExperimentVariant selectedVariant = null;

        for (ExperimentVariant variant : variants) {
            // Beta distribution parameters (adding 1 for Bayesian prior)
            int successes = variant.getConversionCount() != null ? variant.getConversionCount() : 0;
            int failures = variant.getImpressionCount() != null ? 
                (variant.getImpressionCount() - successes) : 0;

            // Sample from Beta(alpha, beta) where alpha = successes + 1, beta = failures + 1
            double sample = sampleBeta(successes + 1, failures + 1);

            log.debug("Variant {}: successes={}, failures={}, sample={}", 
                variant.getVariantName(), successes, failures, sample);

            if (sample > maxSample) {
                maxSample = sample;
                selectedVariant = variant;
            }
        }

        log.info("Selected variant: {} with sample: {}", 
            selectedVariant.getVariantName(), maxSample);

        return selectedVariant;
    }

    /**
     * Sample from Beta distribution using acceptance-rejection method
     * For small alpha and beta, we use a simple approximation
     */
    private double sampleBeta(int alpha, int beta) {
        // For efficiency, use approximation for small values
        if (alpha == 1 && beta == 1) {
            return random.nextDouble(); // Uniform distribution
        }

        // Use Gamma distribution to generate Beta samples
        double gammaAlpha = sampleGamma(alpha, 1.0);
        double gammaBeta = sampleGamma(beta, 1.0);

        return gammaAlpha / (gammaAlpha + gammaBeta);
    }

    /**
     * Sample from Gamma distribution using Marsaglia and Tsang's method
     */
    private double sampleGamma(double shape, double scale) {
        if (shape < 1) {
            // Use Johnk's generator for shape < 1
            return sampleGamma(shape + 1, scale) * Math.pow(random.nextDouble(), 1.0 / shape);
        }

        double d = shape - 1.0 / 3.0;
        double c = 1.0 / Math.sqrt(9.0 * d);

        while (true) {
            double x, v, u;

            do {
                x = random.nextGaussian();
                v = 1.0 + c * x;
            } while (v <= 0);

            v = v * v * v;
            u = random.nextDouble();

            double x2 = x * x;
            if (u < 1 - 0.0331 * x2 * x2) {
                return d * v * scale;
            }

            if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) {
                return d * v * scale;
            }
        }
    }

    /**
     * Calculate probability that variant A is better than variant B
     * Uses Monte Carlo simulation
     */
    public double calculateProbabilityBetter(ExperimentVariant variantA, ExperimentVariant variantB, int samples) {
        int aBetterCount = 0;

        for (int i = 0; i < samples; i++) {
            double sampleA = sampleBeta(
                variantA.getConversionCount() + 1,
                variantA.getImpressionCount() - variantA.getConversionCount() + 1
            );
            double sampleB = sampleBeta(
                variantB.getConversionCount() + 1,
                variantB.getImpressionCount() - variantB.getConversionCount() + 1
            );

            if (sampleA > sampleB) {
                aBetterCount++;
            }
        }

        return (double) aBetterCount / samples;
    }

    /**
     * Check if experiment has reached statistical significance
     * Uses 95% confidence threshold
     */
    public boolean hasReachedSignificance(ExperimentVariant control, ExperimentVariant treatment) {
        double probability = calculateProbabilityBetter(treatment, control, 10000);
        return probability >= 0.95 || probability <= 0.05;
    }
}
