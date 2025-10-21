package com.parkwise.geo.service;

import com.parkwise.geo.dto.NearbyProjectsRequest;
import com.parkwise.geo.dto.ProjectLocationRequest;
import com.parkwise.geo.dto.ProjectLocationResponse;
import com.parkwise.geo.entity.GeoProject;
import com.parkwise.geo.repository.GeoProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.WKTWriter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Geospatial Service
 * Handles geographic operations with PostGIS integration
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GeospatialService {

    private final GeoProjectRepository geoProjectRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    /**
     * Create a new geospatial project
     */
    @Transactional
    public ProjectLocationResponse createProject(ProjectLocationRequest request) {
        log.info("Creating geospatial project: {}", request.getName());

        // Create point geometry
        Point location = geometryFactory.createPoint(
            new Coordinate(request.getLongitude(), request.getLatitude())
        );
        location.setSRID(4326); // WGS84 coordinate system

        // Create geofence (circular buffer or custom polygon)
        Polygon geofence = null;
        if (request.getRadiusMeters() != null) {
            // Create circular buffer
            geofence = (Polygon) location.buffer(
                request.getRadiusMeters() / 111000.0 // Convert meters to degrees (approximate)
            );
            geofence.setSRID(4326);
        }

        // Create entity
        GeoProject project = GeoProject.builder()
            .name(request.getName())
            .description(request.getDescription())
            .location(location)
            .geofence(geofence)
            .category(request.getCategory())
            .createdAt(LocalDateTime.now())
            .build();

        GeoProject saved = geoProjectRepository.save(project);
        log.info("Created project with ID: {}", saved.getId());

        return mapToResponse(saved);
    }

    /**
     * Find projects within radius of a point
     */
    @Transactional(readOnly = true)
    public List<ProjectLocationResponse> findNearbyProjects(NearbyProjectsRequest request) {
        log.info("Finding projects near {}, {} within {}km", 
            request.getLatitude(), request.getLongitude(), request.getRadiusKm());

        Point userLocation = geometryFactory.createPoint(
            new Coordinate(request.getLongitude(), request.getLatitude())
        );
        userLocation.setSRID(4326);

        // Convert km to meters
        double radiusMeters = request.getRadiusKm() * 1000;

        List<GeoProject> projects = geoProjectRepository
            .findProjectsWithinDistance(userLocation, radiusMeters);

        return projects.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    /**
     * Check if a point is inside a project's geofence
     */
    @Transactional(readOnly = true)
    public boolean isPointInGeofence(Long projectId, Double latitude, Double longitude) {
        Point point = geometryFactory.createPoint(
            new Coordinate(longitude, latitude)
        );
        point.setSRID(4326);

        return geoProjectRepository.findById(projectId)
            .map(project -> {
                if (project.getGeofence() == null) {
                    return false;
                }
                return project.getGeofence().contains(point);
            })
            .orElse(false);
    }

    /**
     * Get all projects
     */
    @Transactional(readOnly = true)
    public List<ProjectLocationResponse> getAllProjects() {
        return geoProjectRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    /**
     * Map entity to response DTO
     */
    private ProjectLocationResponse mapToResponse(GeoProject project) {
        WKTWriter wktWriter = new WKTWriter();
        
        return ProjectLocationResponse.builder()
            .id(project.getId())
            .name(project.getName())
            .description(project.getDescription())
            .latitude(project.getLocation().getY())
            .longitude(project.getLocation().getX())
            .radiusMeters(project.getGeofence() != null ? 
                calculateRadius(project.getGeofence()) : null)
            .category(project.getCategory())
            .createdAt(project.getCreatedAt())
            .geoJsonGeometry(project.getLocation() != null ? 
                wktWriter.write(project.getLocation()) : null)
            .build();
    }

    /**
     * Calculate approximate radius from polygon
     */
    private Double calculateRadius(Polygon polygon) {
        Point centroid = polygon.getCentroid();
        Coordinate[] coords = polygon.getCoordinates();
        if (coords.length > 0) {
            double distance = centroid.distance(
                geometryFactory.createPoint(coords[0])
            );
            return distance * 111000; // Convert degrees to meters
        }
        return null;
    }
}
