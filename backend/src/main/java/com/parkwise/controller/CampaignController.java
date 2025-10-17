package com.parkwise.controller;

import com.parkwise.entity.Campaign;
import com.parkwise.repository.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "*")
public class CampaignController {
    
    @Autowired
    private CampaignRepository campaignRepository;
    
    @GetMapping
    public ResponseEntity<?> getAllCampaigns() {
        try {
            List<Campaign> campaigns = campaignRepository.findAll();
            
            // Convert to simple maps to avoid JSON serialization issues
            List<Map<String, Object>> response = campaigns.stream()
                .map(this::convertCampaignToMap)
                .toList();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch campaigns: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    private Map<String, Object> convertCampaignToMap(Campaign campaign) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", campaign.getId());
        map.put("title", campaign.getTitle());
        map.put("description", campaign.getDescription());
        map.put("targetAmount", campaign.getTargetAmount());
        map.put("currentAmount", campaign.getCurrentAmount());
        map.put("startDate", campaign.getStartDate() != null ? campaign.getStartDate().toString() : null);
        map.put("endDate", campaign.getEndDate() != null ? campaign.getEndDate().toString() : null);
        map.put("status", campaign.getStatus() != null ? campaign.getStatus().toString() : null);
        map.put("supporters", campaign.getSupporters());
        map.put("progressPercentage", campaign.getProgressPercentage());
        
        // Handle park relationship safely
        if (campaign.getPark() != null) {
            map.put("parkName", campaign.getPark().getName());
            map.put("parkId", campaign.getPark().getId());
        } else {
            map.put("parkName", null);
            map.put("parkId", null);
        }
        
        return map;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCampaignById(@PathVariable Long id) {
        try {
            Optional<Campaign> campaign = campaignRepository.findById(id);
            if (campaign.isPresent()) {
                return ResponseEntity.ok(convertCampaignToMap(campaign.get()));
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Campaign not found with id: " + id);
                return ResponseEntity.status(404).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch campaign: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<?> getActiveCampaigns() {
        try {
            List<Campaign> campaigns = campaignRepository.findActiveCampaigns();
            List<Map<String, Object>> response = campaigns.stream()
                .map(this::convertCampaignToMap)
                .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch active campaigns: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/stats/total-raised")
    public ResponseEntity<?> getTotalFundsRaised() {
        try {
            Double total = campaignRepository.getTotalFundsRaised();
            Map<String, Object> response = new HashMap<>();
            response.put("totalRaised", total != null ? total : 0.0);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch total funds: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}