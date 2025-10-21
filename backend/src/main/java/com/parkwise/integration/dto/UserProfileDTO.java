package com.parkwise.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {
    private Long userId;
    private String name;
    private String email;
    private String bio;
    private String profileImageUrl;
    private Integer totalPoints;
    private String overallRank;
    private LocalDateTime createdAt;
}
