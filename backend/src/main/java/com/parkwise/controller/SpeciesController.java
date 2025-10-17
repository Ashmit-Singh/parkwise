package com.parkwise.controller;

import com.parkwise.entity.Species;
import com.parkwise.repository.SpeciesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/species")
@CrossOrigin(origins = "*")
public class SpeciesController {
    
    @Autowired
    private SpeciesRepository speciesRepository;
    
    @GetMapping
    public ResponseEntity<?> getAllSpecies() {
        try {
            List<Species> speciesList = speciesRepository.findAll();
            
            // Convert to simple maps to avoid JSON serialization issues
            List<Map<String, Object>> response = speciesList.stream()
                .map(this::convertSpeciesToMap)
                .toList();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch species: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    private Map<String, Object> convertSpeciesToMap(Species species) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", species.getId());
        map.put("name", species.getName());
        map.put("scientificName", species.getScientificName());
        map.put("type", species.getType() != null ? species.getType().toString() : null);
        map.put("conservationStatus", species.getConservationStatus());
        map.put("description", species.getDescription());
        map.put("habitat", species.getHabitat());
        map.put("diet", species.getDiet());
        map.put("lifespan", species.getLifespan());
        
        // Handle park relationship safely
        if (species.getPark() != null) {
            map.put("parkName", species.getPark().getName());
            map.put("parkId", species.getPark().getId());
        } else {
            map.put("parkName", null);
            map.put("parkId", null);
        }
        
        return map;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getSpeciesById(@PathVariable Long id) {
        try {
            Optional<Species> species = speciesRepository.findById(id);
            if (species.isPresent()) {
                return ResponseEntity.ok(convertSpeciesToMap(species.get()));
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Species not found with id: " + id);
                return ResponseEntity.status(404).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch species: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/park/{parkId}")
    public ResponseEntity<?> getSpeciesByPark(@PathVariable Long parkId) {
        try {
            List<Species> speciesList = speciesRepository.findByParkId(parkId);
            List<Map<String, Object>> response = speciesList.stream()
                .map(this::convertSpeciesToMap)
                .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch species for park: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<?> getSpeciesByType(@PathVariable String type) {
        try {
            Species.SpeciesType speciesType = Species.SpeciesType.valueOf(type.toUpperCase());
            List<Species> speciesList = speciesRepository.findByType(speciesType);
            List<Map<String, Object>> response = speciesList.stream()
                .map(this::convertSpeciesToMap)
                .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch species by type: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/threatened")
    public ResponseEntity<?> getThreatenedSpecies() {
        try {
            List<Species> speciesList = speciesRepository.findThreatenedSpecies();
            List<Map<String, Object>> response = speciesList.stream()
                .map(this::convertSpeciesToMap)
                .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch threatened species: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}