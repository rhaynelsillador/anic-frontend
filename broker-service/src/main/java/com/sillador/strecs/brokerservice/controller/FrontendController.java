package com.sillador.strecs.brokerservice.controller;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * Frontend controller for handling SPA (Single Page Application) routing.
 * This controller should have the lowest priority to avoid catching API calls.
 */
@Controller
@Order(100) // Lowest priority - should be the last to handle requests
public class FrontendController {

    /**
     * Handle root path and SPA routes
     * This will forward all non-API requests to index.html in resources/static
     */
    @RequestMapping({"/", "/{path:^(?!api|assets|static|uploads|actuator).*$}/**"})
    public String forwardToIndex() {
        System.out.println("Forwarding to index.html");
        // Always forward to static index.html for SPA routes
        return "forward:/index.html";
    }
    // ...existing code...
}
