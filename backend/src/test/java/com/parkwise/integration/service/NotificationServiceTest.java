package com.parkwise.integration.service;

import com.parkwise.integration.entity.Notification;
import com.parkwise.integration.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class NotificationServiceTest {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    private Long userId = 1L;

    @BeforeEach
    public void setUp() {
        notificationRepository.deleteAll();
    }

    @Test
    public void testNotifySpeciesSubmission() {
        // Act
        Notification notification = notificationService.notifySpeciesSubmission(userId, 1L);

        // Assert
        assertNotNull(notification);
        assertEquals(userId, notification.getUserId());
        assertEquals("SPECIES_SUBMISSION", notification.getNotificationType());
        assertFalse(notification.getIsRead());
    }

    @Test
    public void testNotifyDonation() {
        // Act
        Notification notification = notificationService.notifyDonation(userId, 1L, 500.0);

        // Assert
        assertNotNull(notification);
        assertEquals(userId, notification.getUserId());
        assertEquals("DONATION", notification.getNotificationType());
        assertTrue(notification.getMessage().contains("500"));
    }

    @Test
    public void testNotifyLeaderboardUpdate() {
        // Act
        Notification notification = notificationService.notifyLeaderboardUpdate(userId, "EXPLORER", 100);

        // Assert
        assertNotNull(notification);
        assertEquals(userId, notification.getUserId());
        assertEquals("RANK_UPDATE", notification.getNotificationType());
        assertTrue(notification.getMessage().contains("EXPLORER"));
    }

    @Test
    public void testNotifySpeciesApproved() {
        // Act
        Notification notification = notificationService.notifySpeciesApproved(userId, 1L, "Great Hornbill");

        // Assert
        assertNotNull(notification);
        assertEquals(userId, notification.getUserId());
        assertEquals("SPECIES_APPROVED", notification.getNotificationType());
        assertTrue(notification.getMessage().contains("Great Hornbill"));
    }

    @Test
    public void testGetUserNotifications() {
        // Arrange
        notificationService.notifySpeciesSubmission(userId, 1L);
        notificationService.notifyDonation(userId, 1L, 500.0);

        // Act
        List<Notification> notifications = notificationService.getUserNotifications(userId);

        // Assert
        assertNotNull(notifications);
        assertEquals(2, notifications.size());
    }

    @Test
    public void testGetUnreadNotifications() {
        // Arrange
        Notification n1 = notificationService.notifySpeciesSubmission(userId, 1L);
        Notification n2 = notificationService.notifyDonation(userId, 1L, 500.0);
        notificationService.markAsRead(n1.getId());

        // Act
        List<Notification> unread = notificationService.getUnreadNotifications(userId);

        // Assert
        assertNotNull(unread);
        assertEquals(1, unread.size());
        assertEquals(n2.getId(), unread.get(0).getId());
    }

    @Test
    public void testMarkAsRead() {
        // Arrange
        Notification notification = notificationService.notifySpeciesSubmission(userId, 1L);

        // Act
        notificationService.markAsRead(notification.getId());

        // Assert
        Notification updated = notificationRepository.findById(notification.getId()).orElseThrow();
        assertTrue(updated.getIsRead());
        assertNotNull(updated.getReadAt());
    }

    @Test
    public void testDeleteNotification() {
        // Arrange
        Notification notification = notificationService.notifySpeciesSubmission(userId, 1L);

        // Act
        notificationService.deleteNotification(notification.getId());

        // Assert
        assertTrue(notificationRepository.findById(notification.getId()).isEmpty());
    }

    @Test
    public void testClearAllNotifications() {
        // Arrange
        notificationService.notifySpeciesSubmission(userId, 1L);
        notificationService.notifyDonation(userId, 1L, 500.0);

        // Act
        notificationService.clearAllNotifications(userId);

        // Assert
        List<Notification> remaining = notificationService.getUserNotifications(userId);
        assertEquals(0, remaining.size());
    }
}
