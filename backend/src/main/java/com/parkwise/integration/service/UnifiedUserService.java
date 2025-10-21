package com.parkwise.integration.service;

import com.parkwise.integration.entity.User;
import com.parkwise.integration.repository.UserRepository;
import com.parkwise.integration.dto.UserDashboardDTO;
import com.parkwise.integration.dto.UserProfileDTO;
import com.parkwise.species.repository.CitizenScientistStatsRepository;
import com.parkwise.experiment.repository.DonationEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UnifiedUserService {
    private final UserRepository userRepository;
    private final CitizenScientistStatsRepository citizenStatsRepository;
    private final DonationEventRepository donationRepository;

    /**
     * Create unified user profile
     */
    public User createUserProfile(String email, String name) {
        log.info("Creating user profile for: {}", email);

        // Check if user already exists
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            log.warn("User already exists: {}", email);
            return existing.get();
        }

        // Create new user
        User user = User.builder()
                .email(email)
                .name(name)
                .totalPoints(0)
                .overallRank("NOVICE")
                .build();

        User savedUser = userRepository.save(user);
        log.info("User profile created: {}", savedUser.getId());

        return savedUser;
    }

    /**
     * Get unified user dashboard
     */
    public UserDashboardDTO getUserDashboard(Long userId) {
        log.info("Fetching dashboard for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Get citizen scientist stats
        var citizenStats = citizenStatsRepository.findByUserId(userId).orElse(null);

        // Calculate total stats
        int totalSubmissions = citizenStats != null ? citizenStats.getTotalSubmissions() : 0;
        int approvedSubmissions = citizenStats != null ? citizenStats.getApprovedSubmissions() : 0;
        int speciesIdentified = citizenStats != null ? citizenStats.getSpeciesIdentified() : 0;

        // Get donation stats (placeholder - would query actual donations)
        long totalDonations = 0;
        double totalAmount = 0.0;

        return UserDashboardDTO.builder()
                .userId(userId)
                .name(user.getName())
                .email(user.getEmail())
                .totalPoints(user.getTotalPoints())
                .overallRank(user.getOverallRank())
                .speciesSubmissions(totalSubmissions)
                .approvedSubmissions(approvedSubmissions)
                .speciesIdentified(speciesIdentified)
                .totalDonations(totalDonations)
                .totalDonationAmount(totalAmount)
                .build();
    }

    /**
     * Update user profile
     */
    public User updateUserProfile(Long userId, UserProfileDTO request) {
        log.info("Updating user profile: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }

        User updated = userRepository.save(user);
        log.info("User profile updated: {}", userId);

        return updated;
    }

    /**
     * Get user profile
     */
    public UserProfileDTO getUserProfile(Long userId) {
        log.info("Fetching user profile: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return UserProfileDTO.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .totalPoints(user.getTotalPoints())
                .overallRank(user.getOverallRank())
                .createdAt(user.getCreatedAt())
                .build();
    }

    /**
     * Update user points and rank
     */
    public void updateUserPoints(Long userId, Integer pointsToAdd) {
        log.info("Adding {} points to user: {}", pointsToAdd, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setTotalPoints(user.getTotalPoints() + pointsToAdd);
        updateUserRank(user);

        userRepository.save(user);
        log.info("User points updated: {} total points", user.getTotalPoints());
    }

    /**
     * Update user rank based on points
     */
    private void updateUserRank(User user) {
        int points = user.getTotalPoints();

        if (points >= 1000) {
            user.setOverallRank("EXPERT");
        } else if (points >= 500) {
            user.setOverallRank("NATURALIST");
        } else if (points >= 100) {
            user.setOverallRank("EXPLORER");
        } else {
            user.setOverallRank("NOVICE");
        }
    }

    /**
     * Record last login
     */
    public void recordLastLogin(Long userId) {
        log.info("Recording last login for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }
}
