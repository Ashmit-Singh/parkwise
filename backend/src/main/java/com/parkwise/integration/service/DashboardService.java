package com.parkwise.integration.service;

import com.parkwise.integration.dto.UserDashboardDTO;
import com.parkwise.integration.repository.UserRepository;
import com.parkwise.species.repository.CitizenScientistStatsRepository;
import com.parkwise.species.repository.SpeciesSubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DashboardService {
    private final UserRepository userRepository;
    private final CitizenScientistStatsRepository citizenStatsRepository;
    private final SpeciesSubmissionRepository speciesSubmissionRepository;

    /**
     * Get unified dashboard data
     */
    public UserDashboardDTO getDashboard(Long userId) {
        log.info("Fetching unified dashboard for user: {}", userId);

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        var citizenStats = citizenStatsRepository.findByUserId(userId).orElse(null);

        int totalSubmissions = citizenStats != null ? citizenStats.getTotalSubmissions() : 0;
        int approvedSubmissions = citizenStats != null ? citizenStats.getApprovedSubmissions() : 0;
        int speciesIdentified = citizenStats != null ? citizenStats.getSpeciesIdentified() : 0;

        return UserDashboardDTO.builder()
                .userId(userId)
                .name(user.getName())
                .email(user.getEmail())
                .totalPoints(user.getTotalPoints())
                .overallRank(user.getOverallRank())
                .speciesSubmissions(totalSubmissions)
                .approvedSubmissions(approvedSubmissions)
                .speciesIdentified(speciesIdentified)
                .totalDonations(0L)
                .totalDonationAmount(0.0)
                .build();
    }

    /**
     * Get activity feed
     */
    public Map<String, Object> getActivityFeed(Long userId, int limit) {
        log.info("Fetching activity feed for user: {} (limit: {})", userId, limit);

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        var submissions = speciesSubmissionRepository.findByUserId(userId);

        Map<String, Object> feed = new HashMap<>();
        feed.put("userId", userId);
        feed.put("userName", user.getName());
        feed.put("recentSubmissions", submissions.stream().limit(limit).toList());
        feed.put("totalActivities", submissions.size());

        return feed;
    }

    /**
     * Get conservation impact
     */
    public Map<String, Object> getConservationImpact(Long userId) {
        log.info("Calculating conservation impact for user: {}", userId);

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        var citizenStats = citizenStatsRepository.findByUserId(userId).orElse(null);

        Map<String, Object> impact = new HashMap<>();
        impact.put("userId", userId);
        impact.put("userName", user.getName());
        impact.put("totalSubmissions", citizenStats != null ? citizenStats.getTotalSubmissions() : 0);
        impact.put("approvedSubmissions", citizenStats != null ? citizenStats.getApprovedSubmissions() : 0);
        impact.put("speciesIdentified", citizenStats != null ? citizenStats.getSpeciesIdentified() : 0);
        impact.put("totalPoints", user.getTotalPoints());
        impact.put("rank", user.getOverallRank());

        return impact;
    }

    /**
     * Get user statistics summary
     */
    public Map<String, Object> getUserStatsSummary(Long userId) {
        log.info("Fetching user stats summary for user: {}", userId);

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        var citizenStats = citizenStatsRepository.findByUserId(userId).orElse(null);

        Map<String, Object> stats = new HashMap<>();
        stats.put("userId", userId);
        stats.put("name", user.getName());
        stats.put("email", user.getEmail());
        stats.put("totalPoints", user.getTotalPoints());
        stats.put("rank", user.getOverallRank());
        stats.put("speciesSubmissions", citizenStats != null ? citizenStats.getTotalSubmissions() : 0);
        stats.put("approvedSubmissions", citizenStats != null ? citizenStats.getApprovedSubmissions() : 0);
        stats.put("speciesIdentified", citizenStats != null ? citizenStats.getSpeciesIdentified() : 0);
        stats.put("joinDate", user.getCreatedAt());
        stats.put("lastActive", user.getLastLogin());

        return stats;
    }
}
