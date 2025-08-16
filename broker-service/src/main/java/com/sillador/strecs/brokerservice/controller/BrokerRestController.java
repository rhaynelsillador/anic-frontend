package com.sillador.strecs.brokerservice.controller;

import com.sillador.strecs.brokerservice.service.BrokerService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1")
@Order(2) // Lower priority than FileUploadController
public class BrokerRestController {

    private static final Logger logger = LoggerFactory.getLogger(BrokerRestController.class);
    private final BrokerService brokerService;

    public BrokerRestController(BrokerService brokerService){
        this.brokerService = brokerService;
    }

    /**
     * Universal handler for all API paths with unlimited depth.
     * Handles any path pattern under /api/v1/.
     * 
     * Examples:
     * - /api/v1/students
     * - /api/v1/students/123
     * - /api/v1/enrollment/students/create
     * - /api/v1/reports/academic/year/2023
     * 
     * Note: /api/v1/files paths are handled by FileUploadController with higher priority.
     */
    @RequestMapping(value = "/**", 
                   method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
                            RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS})
    public Object handleAllPaths(HttpServletRequest request) throws IOException {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        
        logger.debug("Broking request - Method: {}, URI: {}, Query: {}", 
                    method, uri, queryString);
        
        return brokerService.forward(request);
    }
}
