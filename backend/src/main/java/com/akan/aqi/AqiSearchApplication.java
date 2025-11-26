package com.akan.aqi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AqiSearchApplication {
    public static void main(String[] args) {
        SpringApplication.run(AqiSearchApplication.class, args);
    }
}
