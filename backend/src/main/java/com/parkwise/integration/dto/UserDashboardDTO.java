package com.parkwise.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDashboardDTO {
    private Long userId;
    private String name;
    private String email;
    private Integer totalPoints;
    private String overallRank;
    
    // Species stats
    private Integer speciesSubmissions;
    private Integer approvedSubmissions;
    private Integer speciesIdentified;
    
    // Donation stats
    private Long totalDonations;
    private Double totalDonationAmount;
}
