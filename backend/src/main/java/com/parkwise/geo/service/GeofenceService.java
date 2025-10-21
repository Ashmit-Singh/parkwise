package com.parkwise.geo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GeofenceService {
    
    /**
     * Check if location is within geofence
     */
    public boolean isWithinGeofence(
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal centerLat,
        BigDecimal centerLon,
        Integer radiusMeters
    ) {
        log.debug("Checking geofence: ({},{}), center: ({},{}), radius: {}m",
            latitude, longitude, centerLat, centerLon, radiusMeters);
        
        double distance = calculateDistance(
            latitude.doubleValue(),
            longitude.doubleValue(),
            centerLat.doubleValue(),
            centerLon.doubleValue()
        );
        
        double radiusKm = radiusMeters / 1000.0;
        boolean within = distance <= radiusKm;
        
        log.debug("Distance: {}km, within: {}", distance, within);
        return within;
    }
    
    /**
     * Calculate distance between two points (Haversine formula)
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;
        
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
    
    /**
     * Find nearby geofences
     */
    public List<Map<String, Object>> findNearbyGeofences(
        BigDecimal latitude,
        BigDecimal longitude,
        Integer searchRadiusMeters
    ) {
        log.info("Finding geofences near ({},{})", latitude, longitude);
        
        List<Map<String, Object>> nearbyGeofences = new ArrayList<>();
        
        // In production, would query PostGIS database
        // For now, returning empty list
        
        return nearbyGeofences;
    }
    
    /**
     * Trigger nudge if user enters geofence
     */
    public Map<String, Object> checkAndTriggerNudge(
        Long userId,
        BigDecimal latitude,
        BigDecimal longitude
    ) {
        log.info("Checking nudge trigger for user {} at ({},{})", userId, latitude, longitude);
        
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("latitude", latitude);
        result.put("longitude", longitude);
        result.put("nudgeTriggered", false);
        result.put("nudgeType", null);
        
        // In production, would:
        // 1. Query active geofences
        // 2. Check if user is within any
        // 3. Trigger appropriate nudge
        // 4. Log event
        
        return result;
    }
    
    /**
     * Record user location
     */
    public Map<String, Object> recordLocation(
        Long userId,
        BigDecimal latitude,
        BigDecimal longitude,
        Integer accuracyMeters
    ) {
        log.info("Recording location for user {}: ({},{})", userId, latitude, longitude);
        
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("latitude", latitude);
        result.put("longitude", longitude);
        result.put("accuracy", accuracyMeters);
        result.put("timestamp", System.currentTimeMillis());
        result.put("recorded", true);
        
        // In production, would:
        // 1. Save to geo_events table
        // 2. Check geofences
        // 3. Trigger nudges if applicable
        // 4. Update spatial analytics
        
        return result;
    }
    
    /**
     * Get heatmap data for region
     */
    public Map<String, Object> getHeatmapData(
        BigDecimal minLat,
        BigDecimal maxLat,
        BigDecimal minLon,
        BigDecimal maxLon
    ) {
        log.info("Generating heatmap for region: ({},{}) to ({},{})",
            minLat, minLon, maxLat, maxLon);
        
        Map<String, Object> heatmap = new HashMap<>();
        heatmap.put("bounds", Map.of(
            "minLat", minLat,
            "maxLat", maxLat,
            "minLon", minLon,
            "maxLon", maxLon
        ));
        heatmap.put("points", new ArrayList<>());
        heatmap.put("intensity", "medium");
        
        // In production, would:
        // 1. Query PostGIS for density
        // 2. Generate heatmap points
        // 3. Calculate intensity
        
        return heatmap;
    }
    
    /**
     * Validate conservation activity at location
     */
    public Map<String, Object> validateConservationActivity(
        Long campaignId,
        BigDecimal latitude,
        BigDecimal longitude,
        String activityType
    ) {
        log.info("Validating conservation activity {} at ({},{})",
            activityType, latitude, longitude);
        
        Map<String, Object> result = new HashMap<>();
        result.put("campaignId", campaignId);
        result.put("latitude", latitude);
        result.put("longitude", longitude);
        result.put("activityType", activityType);
        result.put("valid", true);
        result.put("confidence", 0.85);
        result.put("timestamp", System.currentTimeMillis());
        
        // In production, would:
        // 1. Verify location is in protected area
        // 2. Validate activity type
        // 3. Check historical data
        // 4. Record on blockchain
        
        return result;
    }
}
