package com.parkwise.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "🚀 ParkWise Backend is running!\n\n" +
               "Available Endpoints:\n" +
               "• GET /api/parks - Get all national parks\n" +
               "• GET /api/species - Get all species\n" +
               "• GET /api/campaigns - Get all campaigns\n" +
               "• GET /h2-console - H2 Database Console\n\n" +
               "Frontend: http://localhost:3000";
    }
}