package com.parkwise.species.service;

import com.parkwise.species.dto.SubmissionResponse;
import com.parkwise.species.entity.*;
import com.parkwise.species.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SpeciesSubmissionService {
    private final SpeciesSubmissionRepository submissionRepository;
    private final AIPredictionRepository aiPredictionRepository;
    private final ExpertReviewRepository expertReviewRepository;
    private final CitizenScientistStatsRepository statsRepository;
    private final AISpeciesIdentificationService aiService;
    private final SightingsMapService sightingsMapService;

    @Value("${upload.dir:uploads/species}")
    private String uploadDir;

    /**
     * Create new species submission with image upload
     */
    public SubmissionResponse submitSpeciesSighting(
            Long userId,
            Long campaignId,
            MultipartFile imageFile,
            BigDecimal latitude,
            BigDecimal longitude,
            String locationName,
            String notes) throws IOException {

        log.info("Creating species submission for user: {}", userId);

        // Save image file
        String imageStorageKey = saveImageFile(imageFile);
        String imageUrl = "/api/species/images/" + imageStorageKey;

        // Create submission
        SpeciesSubmission submission = SpeciesSubmission.builder()
                .userId(userId)
                .campaignId(campaignId)
                .imageUrl(imageUrl)
                .imageStorageKey(imageStorageKey)
                .latitude(latitude)
                .longitude(longitude)
                .locationName(locationName)
                .notes(notes)
                .submissionStatus(SpeciesSubmission.SubmissionStatus.PENDING)
                .build();

        SpeciesSubmission savedSubmission = submissionRepository.save(submission);
        log.info("Submission created with ID: {}", savedSubmission.getId());

        // Queue for AI processing
        queueForAIProcessing(savedSubmission, imageFile.getOriginalFilename());

        // Update user stats
        updateUserStats(userId);

        return SubmissionResponse.builder()
                .submissionId(savedSubmission.getId())
                .status("PENDING")
                .message("Submission received. AI processing in progress...")
                .imageUrl(imageUrl)
                .build();
    }

    /**
     * Save uploaded image file
     */
    private String saveImageFile(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(filename);
        Files.write(filePath, file.getBytes());

        log.info("Image saved: {}", filename);
        return filename;
    }

    /**
     * Queue submission for AI processing
     */
    private void queueForAIProcessing(SpeciesSubmission submission, String originalFilename) {
        try {
            String imagePath = Paths.get(uploadDir, submission.getImageStorageKey()).toString();
            
            // Call AI service
            var aiResult = aiService.identifySpeciesFromImage(submission, imagePath);

            if (aiResult.isSuccess() && aiResult.getTopPrediction() != null) {
                log.info("AI identification successful for submission: {}", submission.getId());
                // Submission will be updated with AI prediction
            } else {
                log.warn("AI identification failed: {}", aiResult.getError());
            }
        } catch (Exception e) {
            log.error("Error queuing AI processing", e);
        }
    }

    /**
     * Approve submission (by expert reviewer)
     */
    public void approveSubmission(Long submissionId, Long reviewerId, Long speciesId, String comments) {
        log.info("Approving submission: {} by reviewer: {}", submissionId, reviewerId);

        SpeciesSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        Species species = null;
        if (speciesId != null) {
            species = new Species();
            species.setId(speciesId);
        }

        // Create expert review
        ExpertReview review = ExpertReview.builder()
                .submission(submission)
                .reviewerId(reviewerId)
                .species(species)
                .reviewStatus(ExpertReview.ReviewStatus.APPROVED)
                .confidenceLevel(ExpertReview.ConfidenceLevel.HIGH)
                .comments(comments)
                .reviewDate(LocalDateTime.now())
                .build();

        expertReviewRepository.save(review);

        // Update submission status
        submission.setSubmissionStatus(SpeciesSubmission.SubmissionStatus.APPROVED);
        submission.setSpecies(species);
        submissionRepository.save(submission);

        // Add to sightings map
        if (species != null && submission.getLatitude() != null && submission.getLongitude() != null) {
            sightingsMapService.addSighting(species.getId(), submission);
        }

        // Update user stats
        updateUserStats(submission.getUserId());

        log.info("Submission approved: {}", submissionId);
    }

    /**
     * Reject submission (by expert reviewer)
     */
    public void rejectSubmission(Long submissionId, Long reviewerId, String reason) {
        log.info("Rejecting submission: {} by reviewer: {}", submissionId, reviewerId);

        SpeciesSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        // Create expert review
        ExpertReview review = ExpertReview.builder()
                .submission(submission)
                .reviewerId(reviewerId)
                .reviewStatus(ExpertReview.ReviewStatus.REJECTED)
                .confidenceLevel(ExpertReview.ConfidenceLevel.HIGH)
                .comments(reason)
                .reviewDate(LocalDateTime.now())
                .build();

        expertReviewRepository.save(review);

        // Update submission status
        submission.setSubmissionStatus(SpeciesSubmission.SubmissionStatus.REJECTED);
        submissionRepository.save(submission);

        log.info("Submission rejected: {}", submissionId);
    }

    /**
     * Flag submission for review
     */
    public void flagSubmission(Long submissionId, String reason) {
        log.info("Flagging submission: {} - Reason: {}", submissionId, reason);

        SpeciesSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setSubmissionStatus(SpeciesSubmission.SubmissionStatus.FLAGGED);
        submissionRepository.save(submission);

        log.info("Submission flagged: {}", submissionId);
    }

    /**
     * Update user citizen scientist stats
     */
    private void updateUserStats(Long userId) {
        CitizenScientistStats stats = statsRepository.findByUserId(userId)
                .orElse(CitizenScientistStats.builder()
                        .userId(userId)
                        .totalSubmissions(0)
                        .approvedSubmissions(0)
                        .speciesIdentified(0)
                        .points(0)
                        .build());

        // Update counts
        long totalSubmissions = submissionRepository.countByUserId(userId);
        long approvedSubmissions = submissionRepository.countByUserIdAndSubmissionStatus(
                userId, SpeciesSubmission.SubmissionStatus.APPROVED);
        long uniqueSpecies = submissionRepository.countDistinctSpeciesByUserId(userId);

        stats.setTotalSubmissions((int) totalSubmissions);
        stats.setApprovedSubmissions((int) approvedSubmissions);
        stats.setSpeciesIdentified((int) uniqueSpecies);
        stats.setPoints((int) (approvedSubmissions * 10)); // 10 points per approved submission
        stats.setLastSubmissionDate(LocalDateTime.now());

        statsRepository.save(stats);
        log.info("User stats updated for user: {}", userId);
    }

    /**
     * Get submission with AI prediction
     */
    public SubmissionResponse getSubmissionWithPrediction(Long submissionId) {
        SpeciesSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        var aiPrediction = aiPredictionRepository.findBySubmissionId(submissionId);

        return SubmissionResponse.builder()
                .submissionId(submission.getId())
                .status(submission.getSubmissionStatus().toString())
                .imageUrl(submission.getImageUrl())
                .latitude(submission.getLatitude())
                .longitude(submission.getLongitude())
                .locationName(submission.getLocationName())
                .aiPrediction(aiPrediction.orElse(null))
                .build();
    }
}
