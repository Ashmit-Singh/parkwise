package com.parkwise.controller;

import com.parkwise.entity.Park;
import com.parkwise.repository.ParkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/parks")
@CrossOrigin(origins = "*")
public class ParkController {
    
    @Autowired
    private ParkRepository parkRepository;
    
    @GetMapping
    public List<Park> getAllParks() {
        return parkRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Park> getParkById(@PathVariable Long id) {
        Optional<Park> park = parkRepository.findById(id);
        return park.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/state/{state}")
    public List<Park> getParksByState(@PathVariable String state) {
        return parkRepository.findByState(state);
    }
    
    @GetMapping("/states")
    public List<String> getAvailableStates() {
        return parkRepository.findDistinctStates();
    }
    
    @GetMapping("/search")
    public List<Park> searchParks(@RequestParam String query) {
        return parkRepository.findByNameContainingIgnoreCase(query);
    }
}