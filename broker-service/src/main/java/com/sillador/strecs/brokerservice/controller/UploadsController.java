package com.sillador.strecs.brokerservice.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Controller specifically for serving uploaded files without authentication
 */
@RestController
@RequestMapping("/uploads")
@Order(1) // Highest priority to handle uploads before other controllers
public class UploadsController {

    @Value("${file.upload.path}")
    private String uploadPath;

    /**
     * Serve uploaded files without authentication requirement
     */
    @GetMapping("/**")
    public ResponseEntity<Resource> serveFile(jakarta.servlet.http.HttpServletRequest request) {
        try {
            // Get the full path after /uploads/
            String filePath = request.getRequestURI().substring("/uploads/".length());
            Path file = Paths.get(uploadPath).resolve(filePath);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
