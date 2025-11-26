package com.akan.aqi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class AqiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${aqi.token:}")
    private String token;

    private final String BASE = "https://api.waqi.info/feed";

    @Cacheable(value = "aqiCache", key = "#city.toLowerCase()")
    public JsonNode getAqiForCity(String city) throws Exception {
        if (token == null || token.isBlank()) {
            throw new IllegalStateException("AQI token is not configured. Set 'aqi.token' property or AQI_TOKEN env var.");
        }

        String url = UriComponentsBuilder.fromHttpUrl(BASE + "/" + city)
                .queryParam("token", token)
                .toUriString();

        ResponseEntity<String> resp = restTemplate.getForEntity(url, String.class);
        if (!resp.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to fetch data from provider: HTTP " + resp.getStatusCodeValue());
        }
        JsonNode root = mapper.readTree(resp.getBody());
        return root;
    }
}
