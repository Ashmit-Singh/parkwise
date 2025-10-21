package com.parkwise.experiment.service;

import com.parkwise.experiment.dto.ExperimentAssignmentResponse;
import com.parkwise.experiment.dto.ExperimentMetricsResponse;
import com.parkwise.experiment.entity.*;
import com.parkwise.experiment.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ExperimentService {
    private final ExperimentRepository experimentRepository;
    private final ExperimentAssignmentRepository assignmentRepository;
    private final UserEventLogRepository eventLogRepository;
    private final DonationEventRepository donationEventRepository;

    /**
     * Assign a user to an experiment variant
     * Uses weighted random assignment based on allocation percentages
     */
    public ExperimentAssignmentResponse assignUserToExperiment(Long userId, Long experimentId) {
        log.info("Assigning user {} to experiment {}", userId, experimentId);

        // Check if user already assigned
        Optional<ExperimentAssignment> existingAssignment =
                assignmentRepository.findByUserIdAndExperimentId(userId, experimentId);

        if (existingAssignment.isPresent()) {
            ExperimentAssignment assignment = existingAssignment.get();
            return buildAssignmentResponse(assignment);
        }

        // Get experiment and variants
        Experiment experiment = experimentRepository.findById(experimentId)
                .orElseThrow(() -> new RuntimeException("Experiment not found: " + experimentId));

        if (experiment.getStatus() != Experiment.ExperimentStatus.ACTIVE) {
            throw new RuntimeException("Experiment is not active");
        }

        // Select variant based on allocation percentages
        ExperimentVariant selectedVariant = selectVariantByAllocation(experiment.getVariants());

        // Create and save assignment
        ExperimentAssignment assignment = ExperimentAssignment.builder()
                .userId(userId)
                .experiment(experiment)
                .variant(selectedVariant)
                .build();

        ExperimentAssignment saved = assignmentRepository.save(assignment);
        log.info("User {} assigned to variant {} in experiment {}", userId, selectedVariant.getVariantName(), experimentId);

        return buildAssignmentResponse(saved);
    }

    /**
     * Select variant based on weighted allocation percentages
     */
    private ExperimentVariant selectVariantByAllocation(List<ExperimentVariant> variants) {
        Random random = new Random();
        double randomValue = random.nextDouble() * 100;
        double cumulativePercentage = 0;

        for (ExperimentVariant variant : variants) {
            cumulativePercentage += variant.getAllocationPercentage().doubleValue();
            if (randomValue <= cumulativePercentage) {
                return variant;
            }
        }

        // Fallback to first variant
        return variants.get(0);
    }

    /**
     * Get experiment assignment for a user
     */
    public ExperimentAssignmentResponse getAssignment(Long userId, Long experimentId) {
        ExperimentAssignment assignment = assignmentRepository
                .findByUserIdAndExperimentId(userId, experimentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        return buildAssignmentResponse(assignment);
    }

    /**
     * Build response DTO from assignment entity
     */
    private ExperimentAssignmentResponse buildAssignmentResponse(ExperimentAssignment assignment) {
        return ExperimentAssignmentResponse.builder()
                .experimentId(assignment.getExperiment().getId())
                .experimentName(assignment.getExperiment().getName())
                .variantId(assignment.getVariant().getId())
                .variantName(assignment.getVariant().getVariantName())
                .description(assignment.getVariant().getDescription())
                .userId(assignment.getUserId())
                .build();
    }

    /**
     * Get metrics for an experiment
     */
    public List<ExperimentMetricsResponse> getExperimentMetrics(Long experimentId) {
        Experiment experiment = experimentRepository.findById(experimentId)
                .orElseThrow(() -> new RuntimeException("Experiment not found"));

        return experiment.getVariants().stream()
                .map(variant -> buildMetricsResponse(experiment, variant))
                .collect(Collectors.toList());
    }

    /**
     * Build metrics response for a variant
     */
    private ExperimentMetricsResponse buildMetricsResponse(Experiment experiment, ExperimentVariant variant) {
        Long sampleSize = assignmentRepository.countByExperimentAndVariant(experiment.getId(), variant.getId());
        Long completedDonations = donationEventRepository.countCompletedDonationsByVariant(experiment.getId(), variant.getId());
        Long uniqueDonors = donationEventRepository.countUniqueDonorsByVariant(experiment.getId(), variant.getId());
        BigDecimal avgDonation = donationEventRepository.getAverageDonationByVariant(experiment.getId(), variant.getId());
        BigDecimal totalDonations = donationEventRepository.getTotalDonationsByVariant(experiment.getId(), variant.getId());

        Double conversionRate = sampleSize > 0 ? (completedDonations.doubleValue() / sampleSize.doubleValue()) * 100 : 0.0;

        return ExperimentMetricsResponse.builder()
                .experimentName(experiment.getName())
                .variantName(variant.getVariantName())
                .sampleSize(sampleSize)
                .completedDonations(completedDonations)
                .uniqueDonors(uniqueDonors)
                .averageDonation(avgDonation != null ? avgDonation : BigDecimal.ZERO)
                .totalDonations(totalDonations != null ? totalDonations : BigDecimal.ZERO)
                .conversionRate(conversionRate)
                .build();
    }
}
