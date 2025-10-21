package com.parkwise.experiment.controller;

import com.parkwise.experiment.dto.ExperimentAnalyticsResponse;
import com.parkwise.experiment.service.ExperimentAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Experiment Analytics Controller
 * Advanced analytics and statistical analysis for A/B tests
 */
@RestController
@RequestMapping("/api/experiments/analytics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Experiment Analytics", description = "Advanced A/B testing analytics")
public class ExperimentAnalyticsController {

    private final ExperimentAnalyticsService analyticsService;

    @GetMapping("/{experimentId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'ADMIN')")
    @Operation(summary = "Get experiment analytics", description = "Comprehensive statistical analysis with confidence intervals")
    public ResponseEntity<ExperimentAnalyticsResponse> getAnalytics(@PathVariable Long experimentId) {
        log.info("Fetching analytics for experiment: {}", experimentId);
        ExperimentAnalyticsResponse analytics = analyticsService.getAnalytics(experimentId);
        return ResponseEntity.ok(analytics);
    }
}
