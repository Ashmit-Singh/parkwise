package com.parkwise.experiment.service;

import com.parkwise.experiment.dto.DonationEventRequest;
import com.parkwise.experiment.dto.EventLogRequest;
import com.parkwise.experiment.entity.*;
import com.parkwise.experiment.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AnalyticsService {
    private final UserEventLogRepository eventLogRepository;
    private final DonationEventRepository donationEventRepository;
    private final ExperimentRepository experimentRepository;
    private final ExperimentVariantRepository variantRepository;

    /**
     * Log a user event
     */
    public void logEvent(EventLogRequest request) {
        log.debug("Logging event: userId={}, eventType={}, experimentId={}", 
                request.getUserId(), request.getEventType(), request.getExperimentId());

        Experiment experiment = null;
        ExperimentVariant variant = null;

        if (request.getExperimentId() != null) {
            experiment = experimentRepository.findById(request.getExperimentId()).orElse(null);
        }

        if (request.getVariantId() != null) {
            variant = variantRepository.findById(request.getVariantId()).orElse(null);
        }

        UserEventLog eventLog = UserEventLog.builder()
                .userId(request.getUserId())
                .experiment(experiment)
                .variant(variant)
                .eventType(request.getEventType())
                .eventValue(request.getEventValue())
                .metadata(request.getMetadata())
                .build();

        eventLogRepository.save(eventLog);
        log.info("Event logged successfully: {}", request.getEventType());
    }

    /**
     * Log a donation event
     */
    public void logDonationEvent(DonationEventRequest request) {
        log.info("Logging donation event: userId={}, campaignId={}, amount={}, experimentId={}", 
                request.getUserId(), request.getCampaignId(), request.getDonationAmount(), request.getExperimentId());

        Experiment experiment = null;
        ExperimentVariant variant = null;

        if (request.getExperimentId() != null) {
            experiment = experimentRepository.findById(request.getExperimentId()).orElse(null);
        }

        if (request.getVariantId() != null) {
            variant = variantRepository.findById(request.getVariantId()).orElse(null);
        }

        DonationEvent.DonationStatus status = DonationEvent.DonationStatus.valueOf(
                request.getDonationStatus() != null ? request.getDonationStatus() : "PENDING"
        );

        DonationEvent donationEvent = DonationEvent.builder()
                .userId(request.getUserId())
                .campaignId(request.getCampaignId())
                .experiment(experiment)
                .variant(variant)
                .donationAmount(request.getDonationAmount())
                .donationStatus(status)
                .build();

        DonationEvent saved = donationEventRepository.save(donationEvent);
        log.info("Donation event logged: id={}, status={}", saved.getId(), status);
    }

    /**
     * Mark donation as completed
     */
    public void completeDonation(Long donationEventId) {
        log.info("Marking donation as completed: {}", donationEventId);

        DonationEvent donationEvent = donationEventRepository.findById(donationEventId)
                .orElseThrow(() -> new RuntimeException("Donation event not found"));

        donationEvent.setDonationStatus(DonationEvent.DonationStatus.COMPLETED);
        donationEvent.setCompletedAt(java.time.LocalDateTime.now());
        donationEventRepository.save(donationEvent);

        log.info("Donation completed: {}", donationEventId);
    }

    /**
     * Mark donation as failed
     */
    public void failDonation(Long donationEventId) {
        log.info("Marking donation as failed: {}", donationEventId);

        DonationEvent donationEvent = donationEventRepository.findById(donationEventId)
                .orElseThrow(() -> new RuntimeException("Donation event not found"));

        donationEvent.setDonationStatus(DonationEvent.DonationStatus.FAILED);
        donationEventRepository.save(donationEvent);

        log.info("Donation failed: {}", donationEventId);
    }
}
