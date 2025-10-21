package com.parkwise.geo.controller;

import com.parkwise.geo.dto.NearbyProjectsRequest;
import com.parkwise.geo.dto.ProjectLocationRequest;
import com.parkwise.geo.dto.ProjectLocationResponse;
import com.parkwise.geo.service.GeospatialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Geospatial Controller
 * Handles geographic operations and geofencing
 */
@RestController
@RequestMapping("/api/geo")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Geospatial", description = "Geographic and geofencing APIs")
public class GeospatialController {

    private final GeospatialService geospatialService;

    @PostMapping("/projects/create")
    @PreAuthorize("hasAnyRole('NGO', 'ADMIN')")
    @Operation(summary = "Create geospatial project", description = "Create a new project with location and geofence")
    public ResponseEntity<ProjectLocationResponse> createProject(
            @Valid @RequestBody ProjectLocationRequest request
    ) {
        log.info("Creating geospatial project: {}", request.getName());
        ProjectLocationResponse response = geospatialService.createProject(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/projects/nearby")
    @Operation(summary = "Find nearby projects", description = "Find projects within radius of a location")
    public ResponseEntity<List<ProjectLocationResponse>> findNearbyProjects(
            @Valid @RequestBody NearbyProjectsRequest request
    ) {
        log.info("Finding projects near {}, {}", request.getLatitude(), request.getLongitude());
        List<ProjectLocationResponse> projects = geospatialService.findNearbyProjects(request);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/projects")
    @Operation(summary = "Get all projects", description = "Retrieve all geospatial projects")
    public ResponseEntity<List<ProjectLocationResponse>> getAllProjects() {
        List<ProjectLocationResponse> projects = geospatialService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/projects/{projectId}/check-location")
    @Operation(summary = "Check if point in geofence", description = "Verify if coordinates are within project boundary")
    public ResponseEntity<Map<String, Object>> checkLocation(
            @PathVariable Long projectId,
            @RequestParam Double latitude,
            @RequestParam Double longitude
    ) {
        boolean inGeofence = geospatialService.isPointInGeofence(projectId, latitude, longitude);
        
        return ResponseEntity.ok(Map.of(
            "projectId", projectId,
            "latitude", latitude,
            "longitude", longitude,
            "inGeofence", inGeofence
        ));
    }
}
