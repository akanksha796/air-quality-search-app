package com.akan.aqi.controller;

import com.akan.aqi.service.AqiService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AqiController {

    private final AqiService aqiService;

    public AqiController(AqiService aqiService) {
        this.aqiService = aqiService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchCity(@RequestParam("city") String city) {
        try {
            JsonNode resp = aqiService.getAqiForCity(city);
            // return the provider response directly — frontend can pick needed fields
            return ResponseEntity.ok(resp);
        } catch (IllegalStateException ise) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", ise.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(502).body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
