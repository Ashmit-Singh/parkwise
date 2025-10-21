package com.parkwise.species.controller;

import com.parkwise.species.dto.SubmissionResponse;
import com.parkwise.species.entity.CitizenScientistStats;
import com.parkwise.species.entity.SightingsMap;
import com.parkwise.species.entity.Species;
import com.parkwise.species.repository.CitizenScientistStatsRepository;
import com.parkwise.species.repository.SightingsMapRepository;
import com.parkwise.species.repository.SpeciesRepository;
import com.parkwise.species.service.SpeciesSubmissionService;
import com.parkwise.species.service.SightingsMapService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/species")
@RequiredArgsConstructor
@Slf4j
public class SpeciesIdentificationController {
    private final SpeciesSubmissionService submissionService;
    private final SightingsMapService sightingsMapService;
    private final SpeciesRepository speciesRepository;
    private final SightingsMapRepository sightingsMapRepository;
    private final CitizenScientistStatsRepository statsRepository;

    /**
     * Submit species sighting with image
     * POST /api/species/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<SubmissionResponse> submitSpeciesSighting(
            @RequestParam Long userId,
            @RequestParam(required = false) Long campaignId,
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam(required = false) BigDecimal latitude,
            @RequestParam(required = false) BigDecimal longitude,
            @RequestParam(required = false) String locationName,
            @RequestParam(required = false) String notes) throws IOException {

        log.info("Receiving species submission from user: {}", userId);
        SubmissionResponse response = submissionService.submitSpeciesSighting(
                userId, campaignId, imageFile, latitude, longitude, locationName, notes
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Get submission with AI prediction
     * GET /api/species/submission/{submissionId}
     */
    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<SubmissionResponse> getSubmission(@PathVariable Long submissionId) {
        log.info("Fetching submission: {}", submissionId);
        SubmissionResponse response = submissionService.getSubmissionWithPrediction(submissionId);
        return ResponseEntity.ok(response);
    }

    /**
     * Approve submission (expert only)
     * PUT /api/species/submission/{submissionId}/approve
     */
    @PutMapping("/submission/{submissionId}/approve")
    public ResponseEntity<Void> approveSubmission(
            @PathVariable Long submissionId,
            @RequestParam Long reviewerId,
            @RequestParam Long speciesId,
            @RequestParam(required = false) String comments) {

        log.info("Approving submission: {}", submissionId);
        submissionService.approveSubmission(submissionId, reviewerId, speciesId, comments);
        return ResponseEntity.ok().build();
    }

    /**
     * Reject submission (expert only)
     * PUT /api/species/submission/{submissionId}/reject
     */
    @PutMapping("/submission/{submissionId}/reject")
    public ResponseEntity<Void> rejectSubmission(
            @PathVariable Long submissionId,
            @RequestParam Long reviewerId,
            @RequestParam String reason) {

        log.info("Rejecting submission: {}", submissionId);
        submissionService.rejectSubmission(submissionId, reviewerId, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * Get public sightings map
     * GET /api/species/sightings/map
     */
    @GetMapping("/sightings/map")
    public ResponseEntity<List<SightingsMap>> getSightingsMap() {
        log.info("Fetching sightings map");
        List<SightingsMap> sightings = sightingsMapRepository.findValidatedSightings();
        return ResponseEntity.ok(sightings);
    }

    /**
     * Get sightings for specific species
     * GET /api/species/{speciesId}/sightings
     */
    @GetMapping("/{speciesId}/sightings")
    public ResponseEntity<List<SightingsMap>> getSpeciesSightings(@PathVariable Long speciesId) {
        log.info("Fetching sightings for species: {}", speciesId);
        List<SightingsMap> sightings = sightingsMapService.getSpeciesSightings(speciesId);
        return ResponseEntity.ok(sightings);
    }

    /**
     * Get sightings in geographic area
     * GET /api/species/sightings/area?minLat=X&maxLat=Y&minLon=A&maxLon=B
     */
    @GetMapping("/sightings/area")
    public ResponseEntity<List<SightingsMap>> getSightingsInArea(
            @RequestParam BigDecimal minLat,
            @RequestParam BigDecimal maxLat,
            @RequestParam BigDecimal minLon,
            @RequestParam BigDecimal maxLon) {

        log.info("Fetching sightings in area");
        List<SightingsMap> sightings = sightingsMapService.getSightingsInArea(minLat, maxLat, minLon, maxLon);
        return ResponseEntity.ok(sightings);
    }

    /**
     * Get leaderboard
     * GET /api/species/leaderboard
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<CitizenScientistStats>> getLeaderboard() {
        log.info("Fetching leaderboard");
        List<CitizenScientistStats> leaderboard = statsRepository.findTopContributors();
        return ResponseEntity.ok(leaderboard);
    }

    /**
     * Get user stats
     * GET /api/species/user/{userId}/stats
     */
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<CitizenScientistStats> getUserStats(@PathVariable Long userId) {
        log.info("Fetching stats for user: {}", userId);
        CitizenScientistStats stats = statsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User stats not found"));
        return ResponseEntity.ok(stats);
    }

    /**
     * Get all species
     * GET /api/species/catalog
     */
    @GetMapping("/catalog")
    public ResponseEntity<List<Species>> getSpeciesCatalog() {
        log.info("Fetching species catalog");
        List<Species> species = speciesRepository.findAll();
        return ResponseEntity.ok(species);
    }

    /**
     * Get threatened species
     * GET /api/species/threatened
     */
    @GetMapping("/threatened")
    public ResponseEntity<List<Species>> getThreatenedSpecies() {
        log.info("Fetching threatened species");
        List<Species> species = speciesRepository.findThreatenedSpecies();
        return ResponseEntity.ok(species);
    }

    /**
     * Get recent sightings
     * GET /api/species/sightings/recent?days=7
     */
    @GetMapping("/sightings/recent")
    public ResponseEntity<List<SightingsMap>> getRecentSightings(
            @RequestParam(defaultValue = "7") int days) {

        log.info("Fetching recent sightings from last {} days", days);
        List<SightingsMap> sightings = sightingsMapService.getRecentSightings(days);
        return ResponseEntity.ok(sightings);
    }
}
