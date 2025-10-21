package com.parkwise.experiment.controller;

import com.parkwise.experiment.dto.DonationEventRequest;
import com.parkwise.experiment.dto.EventLogRequest;
import com.parkwise.experiment.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    /**
     * Log a user event
     * POST /api/analytics/events
     */
    @PostMapping("/events")
    public ResponseEntity<Void> logEvent(@RequestBody EventLogRequest request) {
        log.info("Logging event: {}", request.getEventType());
        analyticsService.logEvent(request);
        return ResponseEntity.ok().build();
    }

    /**
     * Log a donation event
     * POST /api/analytics/donations
     */
    @PostMapping("/donations")
    public ResponseEntity<Void> logDonationEvent(@RequestBody DonationEventRequest request) {
        log.info("Logging donation event for user {}", request.getUserId());
        analyticsService.logDonationEvent(request);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark a donation as completed
     * PUT /api/analytics/donations/{donationEventId}/complete
     */
    @PutMapping("/donations/{donationEventId}/complete")
    public ResponseEntity<Void> completeDonation(@PathVariable Long donationEventId) {
        log.info("Completing donation: {}", donationEventId);
        analyticsService.completeDonation(donationEventId);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark a donation as failed
     * PUT /api/analytics/donations/{donationEventId}/fail
     */
    @PutMapping("/donations/{donationEventId}/fail")
    public ResponseEntity<Void> failDonation(@PathVariable Long donationEventId) {
        log.info("Failing donation: {}", donationEventId);
        analyticsService.failDonation(donationEventId);
        return ResponseEntity.ok().build();
    }
}
