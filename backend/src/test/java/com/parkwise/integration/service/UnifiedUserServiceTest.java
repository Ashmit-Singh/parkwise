package com.parkwise.integration.service;

import com.parkwise.integration.entity.User;
import com.parkwise.integration.repository.UserRepository;
import com.parkwise.integration.dto.UserDashboardDTO;
import com.parkwise.integration.dto.UserProfileDTO;
import com.parkwise.species.repository.CitizenScientistStatsRepository;
import com.parkwise.experiment.repository.DonationEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class UnifiedUserServiceTest {
    @Autowired
    private UnifiedUserService userService;

    @Autowired
    private UserRepository userRepository;

    private String testEmail = "test@example.com";
    private String testName = "Test User";

    @BeforeEach
    public void setUp() {
        userRepository.deleteAll();
    }

    @Test
    public void testCreateUserProfile() {
        // Act
        User user = userService.createUserProfile(testEmail, testName);

        // Assert
        assertNotNull(user);
        assertEquals(testEmail, user.getEmail());
        assertEquals(testName, user.getName());
        assertEquals(0, user.getTotalPoints());
        assertEquals("NOVICE", user.getOverallRank());
    }

    @Test
    public void testCreateUserProfileDuplicate() {
        // Arrange
        userService.createUserProfile(testEmail, testName);

        // Act
        User user2 = userService.createUserProfile(testEmail, testName);

        // Assert
        assertNotNull(user2);
        assertEquals(testEmail, user2.getEmail());
    }

    @Test
    public void testGetUserDashboard() {
        // Arrange
        User user = userService.createUserProfile(testEmail, testName);

        // Act
        UserDashboardDTO dashboard = userService.getUserDashboard(user.getId());

        // Assert
        assertNotNull(dashboard);
        assertEquals(testEmail, dashboard.getEmail());
        assertEquals(testName, dashboard.getName());
        assertEquals(0, dashboard.getTotalPoints());
    }

    @Test
    public void testUpdateUserProfile() {
        // Arrange
        User user = userService.createUserProfile(testEmail, testName);
        UserProfileDTO updateRequest = UserProfileDTO.builder()
                .name("Updated Name")
                .bio("New bio")
                .build();

        // Act
        User updated = userService.updateUserProfile(user.getId(), updateRequest);

        // Assert
        assertNotNull(updated);
        assertEquals("Updated Name", updated.getName());
        assertEquals("New bio", updated.getBio());
    }

    @Test
    public void testGetUserProfile() {
        // Arrange
        User user = userService.createUserProfile(testEmail, testName);

        // Act
        UserProfileDTO profile = userService.getUserProfile(user.getId());

        // Assert
        assertNotNull(profile);
        assertEquals(testEmail, profile.getEmail());
        assertEquals(testName, profile.getName());
    }

    @Test
    public void testUpdateUserPoints() {
        // Arrange
        User user = userService.createUserProfile(testEmail, testName);

        // Act
        userService.updateUserPoints(user.getId(), 100);

        // Assert
        User updated = userRepository.findById(user.getId()).orElseThrow();
        assertEquals(100, updated.getTotalPoints());
    }

    @Test
    public void testUpdateUserRankProgression() {
        // Arrange
        User user = userService.createUserProfile(testEmail, testName);

        // Act & Assert - NOVICE
        assertEquals("NOVICE", user.getOverallRank());

        // EXPLORER (100+ points)
        userService.updateUserPoints(user.getId(), 100);
        User explorer = userRepository.findById(user.getId()).orElseThrow();
        assertEquals("EXPLORER", explorer.getOverallRank());

        // NATURALIST (500+ points)
        userService.updateUserPoints(user.getId(), 400);
        User naturalist = userRepository.findById(user.getId()).orElseThrow();
        assertEquals("NATURALIST", naturalist.getOverallRank());

        // EXPERT (1000+ points)
        userService.updateUserPoints(user.getId(), 500);
        User expert = userRepository.findById(user.getId()).orElseThrow();
        assertEquals("EXPERT", expert.getOverallRank());
    }

    @Test
    public void testRecordLastLogin() {
        // Arrange
        User user = userService.createUserProfile(testEmail, testName);

        // Act
        userService.recordLastLogin(user.getId());

        // Assert
        User updated = userRepository.findById(user.getId()).orElseThrow();
        assertNotNull(updated.getLastLogin());
    }

    @Test
    public void testGetNonExistentUser() {
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.getUserProfile(999L);
        });
    }
}
