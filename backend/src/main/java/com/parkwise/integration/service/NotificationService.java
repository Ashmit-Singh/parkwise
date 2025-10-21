package com.parkwise.integration.service;

import com.parkwise.integration.entity.Notification;
import com.parkwise.integration.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;

    /**
     * Send notification for species submission
     */
    public Notification notifySpeciesSubmission(Long userId, Long submissionId) {
        log.info("Sending species submission notification to user: {}", userId);

        Notification notification = Notification.builder()
                .userId(userId)
                .title("Species Submission Received")
                .message("Your species sighting has been submitted for review")
                .notificationType("SPECIES_SUBMISSION")
                .relatedId(submissionId)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Send notification for donation
     */
    public Notification notifyDonation(Long userId, Long donationId, Double amount) {
        log.info("Sending donation notification to user: {}", userId);

        Notification notification = Notification.builder()
                .userId(userId)
                .title("Thank You for Your Donation!")
                .message("Your donation of ₹" + amount + " will help protect biodiversity")
                .notificationType("DONATION")
                .relatedId(donationId)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Send notification for leaderboard update
     */
    public Notification notifyLeaderboardUpdate(Long userId, String newRank, Integer points) {
        log.info("Sending leaderboard update notification to user: {}", userId);

        Notification notification = Notification.builder()
                .userId(userId)
                .title("Rank Update: " + newRank)
                .message("Congratulations! You've reached " + newRank + " rank with " + points + " points")
                .notificationType("RANK_UPDATE")
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Send notification for species approval
     */
    public Notification notifySpeciesApproved(Long userId, Long submissionId, String speciesName) {
        log.info("Sending species approval notification to user: {}", userId);

        Notification notification = Notification.builder()
                .userId(userId)
                .title("Species Approved: " + speciesName)
                .message("Your sighting of " + speciesName + " has been approved by experts!")
                .notificationType("SPECIES_APPROVED")
                .relatedId(submissionId)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Get user notifications
     */
    public List<Notification> getUserNotifications(Long userId) {
        log.info("Fetching notifications for user: {}", userId);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get unread notifications
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        log.info("Fetching unread notifications for user: {}", userId);
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    /**
     * Mark notification as read
     */
    public void markAsRead(Long notificationId) {
        log.info("Marking notification as read: {}", notificationId);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    /**
     * Delete notification
     */
    public void deleteNotification(Long notificationId) {
        log.info("Deleting notification: {}", notificationId);
        notificationRepository.deleteById(notificationId);
    }

    /**
     * Clear all notifications for user
     */
    public void clearAllNotifications(Long userId) {
        log.info("Clearing all notifications for user: {}", userId);
        notificationRepository.deleteByUserId(userId);
    }
}
