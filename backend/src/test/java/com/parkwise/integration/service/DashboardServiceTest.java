package com.parkwise.integration.service;

import com.parkwise.integration.dto.UserDashboardDTO;
import com.parkwise.integration.entity.User;
import com.parkwise.integration.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class DashboardServiceTest {
    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    private Long userId;

    @BeforeEach
    public void setUp() {
        userRepository.deleteAll();

        User user = User.builder()
                .email("test@example.com")
                .name("Test User")
                .totalPoints(0)
                .overallRank("NOVICE")
                .build();
        User saved = userRepository.save(user);
        userId = saved.getId();
    }

    @Test
    public void testGetDashboard() {
        // Act
        UserDashboardDTO dashboard = dashboardService.getDashboard(userId);

        // Assert
        assertNotNull(dashboard);
        assertEquals(userId, dashboard.getUserId());
        assertEquals("Test User", dashboard.getName());
        assertEquals("test@example.com", dashboard.getEmail());
        assertEquals(0, dashboard.getTotalPoints());
        assertEquals("NOVICE", dashboard.getOverallRank());
    }

    @Test
    public void testGetActivityFeed() {
        // Act
        Map<String, Object> feed = dashboardService.getActivityFeed(userId, 10);

        // Assert
        assertNotNull(feed);
        assertEquals(userId, feed.get("userId"));
        assertEquals("Test User", feed.get("userName"));
        assertNotNull(feed.get("recentSubmissions"));
        assertNotNull(feed.get("totalActivities"));
    }

    @Test
    public void testGetConservationImpact() {
        // Act
        Map<String, Object> impact = dashboardService.getConservationImpact(userId);

        // Assert
        assertNotNull(impact);
        assertEquals(userId, impact.get("userId"));
        assertEquals("Test User", impact.get("userName"));
        assertEquals(0, impact.get("totalSubmissions"));
        assertEquals(0, impact.get("approvedSubmissions"));
        assertEquals(0, impact.get("speciesIdentified"));
    }

    @Test
    public void testGetUserStatsSummary() {
        // Act
        Map<String, Object> stats = dashboardService.getUserStatsSummary(userId);

        // Assert
        assertNotNull(stats);
        assertEquals(userId, stats.get("userId"));
        assertEquals("Test User", stats.get("name"));
        assertEquals("test@example.com", stats.get("email"));
        assertEquals(0, stats.get("totalPoints"));
        assertEquals("NOVICE", stats.get("rank"));
        assertNotNull(stats.get("joinDate"));
    }

    @Test
    public void testGetDashboardNonExistentUser() {
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            dashboardService.getDashboard(999L);
        });
    }

    @Test
    public void testGetActivityFeedNonExistentUser() {
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            dashboardService.getActivityFeed(999L, 10);
        });
    }
}
