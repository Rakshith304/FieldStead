package com.example.farmrental.config;
import org.springframework.context.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.*;
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Value("${app.cors.allowed-origins:http://localhost:5173}") private String[] allowedOrigins;
    public void addCorsMappings(CorsRegistry r) {
        r.addMapping("/api/**").allowedOrigins(allowedOrigins).allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS").allowedHeaders("Authorization", "Content-Type").maxAge(3600);
    }
}
