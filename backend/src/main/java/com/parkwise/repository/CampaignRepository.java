package com.parkwise.repository;

import com.parkwise.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByStatus(Campaign.CampaignStatus status);
    List<Campaign> findByParkId(Long parkId);
    
    @Query("SELECT c FROM Campaign c WHERE c.status = 'ACTIVE' ORDER BY c.createdAt DESC")
    List<Campaign> findActiveCampaigns();
    
    @Query("SELECT SUM(c.currentAmount) FROM Campaign c")
    Double getTotalFundsRaised();
}