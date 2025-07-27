package com.sillador.strecs.brokerservice.controller;

import com.sillador.strecs.brokerservice.service.BrokerService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/admin/api")
public class AdminBrokerRestController {

    private final BrokerService brokerService;

    public AdminBrokerRestController(BrokerService brokerService){
        this.brokerService = brokerService;
    }


    @PreAuthorize("hasRole('Admin')")
    @RequestMapping(value = "/{path}")
    public Object redirect(@PathVariable String path, HttpServletRequest request) throws IOException {
        String method = request.getMethod();  // <-- GET, POST, etc.
        System.out.println("HTTP method: " + method);
        System.out.println("HTTP URI: " + request.getRequestURI());
        System.out.println("HTTP Query String: " + request.getQueryString());

        return brokerService.forward(request);

    }

    @PreAuthorize("hasRole('Admin')")
    @RequestMapping(value = "/{path}/{path2}")
    public Object singlePathRedirect(@PathVariable String path, @PathVariable String path2,HttpServletRequest request) throws IOException {
        String method = request.getMethod();  // <-- GET, POST, etc.
        System.out.println("HTTP method: " + method);
        System.out.println("HTTP URI: " + request.getRequestURI());
        System.out.println("HTTP Query String: " + request.getQueryString());

        return brokerService.forward(request);

    }

    @PreAuthorize("hasRole('Admin')")
    @RequestMapping(value = "/{path}/{path2}/{path3}")
    public Object doublePathRedirect(@PathVariable String path, @PathVariable String path2,@PathVariable String path3,HttpServletRequest request) throws IOException {
        String method = request.getMethod();  // <-- GET, POST, etc.
        System.out.println("HTTP method: " + method);
        System.out.println("HTTP URI: " + request.getRequestURI());
        System.out.println("HTTP Query String: " + request.getQueryString());

        return brokerService.forward(request);

    }

    @PreAuthorize("hasRole('Admin')")
    @RequestMapping(value = "/{path}/{path2}/{path3}/{path4}")
    public Object doublePathRedirect(@PathVariable String path, @PathVariable String path2,@PathVariable String path3, @PathVariable String path4,HttpServletRequest request) throws IOException {
        String method = request.getMethod();  // <-- GET, POST, etc.
        System.out.println("HTTP method: " + method);
        System.out.println("HTTP URI: " + request.getRequestURI());
        System.out.println("HTTP Query String: " + request.getQueryString());

        return brokerService.forward(request);

    }

    @PreAuthorize("hasRole('Admin')")
    @RequestMapping(value = "/{path}/{path2}/{path3}/{path4}/{path5}")
    public Object doublePathRedirect(@PathVariable String path, @PathVariable String path2,@PathVariable String path3, @PathVariable String path4,@PathVariable String path5,HttpServletRequest request) throws IOException {
        String method = request.getMethod();  // <-- GET, POST, etc.
        System.out.println("HTTP method: " + method);
        System.out.println("HTTP URI: " + request.getRequestURI());
        System.out.println("HTTP Query String: " + request.getQueryString());

        return brokerService.forward(request);

    }
}
