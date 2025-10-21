package com.parkwise.experiment.repository;

import com.parkwise.experiment.entity.UserEventLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserEventLogRepository extends JpaRepository<UserEventLog, Long> {
    @Query("SELECT el FROM UserEventLog el WHERE el.userId = :userId ORDER BY el.createdAt DESC")
    List<UserEventLog> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT el FROM UserEventLog el WHERE el.experiment.id = :experimentId AND el.variant.id = :variantId")
    List<UserEventLog> findByExperimentAndVariant(
            @Param("experimentId") Long experimentId,
            @Param("variantId") Long variantId
    );

    @Query("SELECT el FROM UserEventLog el WHERE el.eventType = :eventType AND el.createdAt >= :startTime")
    List<UserEventLog> findEventsSince(
            @Param("eventType") String eventType,
            @Param("startTime") LocalDateTime startTime
    );

    @Query("SELECT COUNT(DISTINCT el.userId) FROM UserEventLog el WHERE el.experiment.id = :experimentId")
    Long countUniqueUsersInExperiment(@Param("experimentId") Long experimentId);
}
