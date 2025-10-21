package com.parkwise.geo.repository;

import com.parkwise.geo.entity.GeoProject;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeoProjectRepository extends JpaRepository<GeoProject, Long> {

    /**
     * Find projects within a certain distance from a point
     * Uses PostGIS ST_DWithin function
     */
    @Query("SELECT p FROM GeoProject p WHERE ST_DWithin(p.location, :point, :distance) = true")
    List<GeoProject> findProjectsWithinDistance(
        @Param("point") Point point,
        @Param("distance") double distanceMeters
    );

    /**
     * Find projects by category
     */
    List<GeoProject> findByCategory(String category);

    /**
     * Find projects whose geofence contains a point
     */
    @Query("SELECT p FROM GeoProject p WHERE ST_Contains(p.geofence, :point) = true")
    List<GeoProject> findProjectsContainingPoint(@Param("point") Point point);
}
