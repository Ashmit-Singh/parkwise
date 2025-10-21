package com.parkwise.species.repository;

import com.parkwise.species.entity.CitizenScientistStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CitizenScientistStatsRepository extends JpaRepository<CitizenScientistStats, Long> {
    Optional<CitizenScientistStats> findByUserId(Long userId);

    @Query("SELECT c FROM CitizenScientistStats c ORDER BY c.points DESC LIMIT 100")
    List<CitizenScientistStats> findTopContributors();

    List<CitizenScientistStats> findByRankOrderByPointsDesc(CitizenScientistStats.UserRank rank);
}
