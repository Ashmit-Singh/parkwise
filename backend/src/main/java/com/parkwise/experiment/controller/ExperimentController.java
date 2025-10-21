package com.parkwise.experiment.controller;

import com.parkwise.experiment.dto.ExperimentAssignmentResponse;
import com.parkwise.experiment.dto.ExperimentMetricsResponse;
import com.parkwise.experiment.service.ExperimentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiments")
@RequiredArgsConstructor
@Slf4j
public class ExperimentController {
    private final ExperimentService experimentService;

    /**
     * Assign a user to an experiment variant
     * GET /api/experiments/assign?userId=123&experimentId=1
     */
    @GetMapping("/assign")
    public ResponseEntity<ExperimentAssignmentResponse> assignUserToExperiment(
            @RequestParam Long userId,
            @RequestParam Long experimentId) {
        log.info("Assigning user {} to experiment {}", userId, experimentId);
        ExperimentAssignmentResponse response = experimentService.assignUserToExperiment(userId, experimentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get user's assignment for an experiment
     * GET /api/experiments/assignment?userId=123&experimentId=1
     */
    @GetMapping("/assignment")
    public ResponseEntity<ExperimentAssignmentResponse> getAssignment(
            @RequestParam Long userId,
            @RequestParam Long experimentId) {
        log.info("Getting assignment for user {} in experiment {}", userId, experimentId);
        ExperimentAssignmentResponse response = experimentService.getAssignment(userId, experimentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get metrics for an experiment
     * GET /api/experiments/1/metrics
     */
    @GetMapping("/{experimentId}/metrics")
    public ResponseEntity<List<ExperimentMetricsResponse>> getExperimentMetrics(
            @PathVariable Long experimentId) {
        log.info("Getting metrics for experiment {}", experimentId);
        List<ExperimentMetricsResponse> metrics = experimentService.getExperimentMetrics(experimentId);
        return ResponseEntity.ok(metrics);
    }
}
