package com.sillador.strecs.brokerservice.controller;

import com.sillador.strecs.brokerservice.service.BrokerService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * Admin REST controller that handles all API requests and forwards them to the broker service.
 * Uses a universal path handler to support any depth of path segments.
 * Requires Admin role authorization for all endpoints.
 */
@RestController
@RequestMapping("/admin/api")
@Order(3) // Lower priority than FileUploadController and BrokerRestController
public class AdminBrokerRestController {

    private static final Logger logger = LoggerFactory.getLogger(AdminBrokerRestController.class);
    private final BrokerService brokerService;

    public AdminBrokerRestController(BrokerService brokerService) {
        this.brokerService = brokerService;
    }

    /**
     * Universal handler for all admin API paths with unlimited depth.
     * Handles any path pattern under /admin/api/.
     * 
     * Examples:
     * - /admin/api/students
     * - /admin/api/students/123
     * - /admin/api/enrollment/students/create
     * - /admin/api/reports/academic/year/2023
     * 
     * Note: Requires Admin role authorization for all endpoints.
     */
    @PreAuthorize("hasRole('Admin')")
    @RequestMapping(value = "/**", 
                   method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
                            RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS})
    public Object handleAllPaths(HttpServletRequest request) throws IOException {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        
        logger.debug("Admin API request - Method: {}, URI: {}, Query: {}", 
                    method, uri, queryString);
        
        return brokerService.forward(request);
    }
}
