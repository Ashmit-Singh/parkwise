package com.parkwise.analytics.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BanditService {
    
    /**
     * Thompson Sampling - Select best arm based on posterior distribution
     */
    public int thompsonSampling(List<ArmStats> arms) {
        log.debug("Running Thompson sampling with {} arms", arms.size());
        
        double maxSample = -1;
        int selectedArm = 0;
        
        for (int i = 0; i < arms.size(); i++) {
            ArmStats arm = arms.get(i);
            
            // Sample from Beta distribution: Beta(successes + 1, failures + 1)
            double sample = sampleBeta(
                arm.successes + 1,
                arm.failures + 1
            );
            
            log.debug("Arm {}: sample = {}", i, sample);
            
            if (sample > maxSample) {
                maxSample = sample;
                selectedArm = i;
            }
        }
        
        log.info("Thompson sampling selected arm: {}", selectedArm);
        return selectedArm;
    }
    
    /**
     * Sample from Beta distribution
     */
    private double sampleBeta(double alpha, double beta) {
        Random random = new Random();
        
        // Use Gamma distribution to sample Beta
        double x = sampleGamma(alpha, 1.0, random);
        double y = sampleGamma(beta, 1.0, random);
        
        return x / (x + y);
    }
    
    /**
     * Sample from Gamma distribution
     */
    private double sampleGamma(double shape, double scale, Random random) {
        if (shape < 1) {
            return sampleGamma(shape + 1, scale, random) * Math.pow(random.nextDouble(), 1 / shape);
        }
        
        double d = shape - 1.0 / 3.0;
        double c = 1.0 / Math.sqrt(9.0 * d);
        
        while (true) {
            double x = random.nextGaussian();
            double v = 1.0 + c * x;
            
            if (v <= 0) continue;
            
            v = v * v * v;
            double u = random.nextDouble();
            
            if (u < 1.0 - 0.0331 * x * x * x * x) {
                return scale * d * v;
            }
            
            if (Math.log(u) < 0.5 * x * x + d * (1.0 - v + Math.log(v))) {
                return scale * d * v;
            }
        }
    }
    
    /**
     * Update arm statistics with new observation
     */
    public void updateArm(ArmStats arm, boolean success) {
        log.debug("Updating arm: success = {}", success);
        
        if (success) {
            arm.successes++;
        } else {
            arm.failures++;
        }
        
        arm.trials++;
        arm.conversionRate = (double) arm.successes / arm.trials;
        
        log.debug("Arm updated: successes={}, failures={}, rate={}",
            arm.successes, arm.failures, arm.conversionRate);
    }
    
    /**
     * Calculate confidence interval for arm
     */
    public Map<String, Double> getConfidenceInterval(ArmStats arm, double confidence) {
        log.debug("Calculating CI for arm with {} trials", arm.trials);
        
        // Wilson score interval
        double p = arm.conversionRate;
        double n = arm.trials;
        double z = getZScore(confidence);
        
        double denominator = 1 + z * z / n;
        double center = (p + z * z / (2 * n)) / denominator;
        double margin = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denominator;
        
        Map<String, Double> ci = new HashMap<>();
        ci.put("lower", Math.max(0, center - margin));
        ci.put("upper", Math.min(1, center + margin));
        ci.put("center", center);
        
        return ci;
    }
    
    /**
     * Get Z-score for confidence level
     */
    private double getZScore(double confidence) {
        // Common Z-scores: 90% = 1.645, 95% = 1.96, 99% = 2.576
        if (confidence >= 0.99) return 2.576;
        if (confidence >= 0.95) return 1.96;
        if (confidence >= 0.90) return 1.645;
        return 1.645;
    }
    
    /**
     * Calculate regret (opportunity cost)
     */
    public double calculateRegret(List<ArmStats> arms) {
        log.debug("Calculating regret for {} arms", arms.size());
        
        // Find best arm
        double bestRate = arms.stream()
            .mapToDouble(a -> a.conversionRate)
            .max()
            .orElse(0);
        
        // Calculate total regret
        double totalRegret = 0;
        for (ArmStats arm : arms) {
            totalRegret += arm.trials * (bestRate - arm.conversionRate);
        }
        
        log.info("Total regret: {}", totalRegret);
        return totalRegret;
    }
    
    /**
     * Arm statistics class
     */
    public static class ArmStats {
        public long successes = 0;
        public long failures = 0;
        public long trials = 0;
        public double conversionRate = 0;
        public String name;
        
        public ArmStats(String name) {
            this.name = name;
        }
    }
}
