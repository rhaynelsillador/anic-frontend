package com.sillador.strecs.brokerservice.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthUtils {

    public static String getLoggedInUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

         // Ensure the authentication details are loaded
        System.out.println("Logged in user: " + authentication.getName());
        System.out.println("Authentication details: " + authentication.getDetails());

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername(); // or cast to your custom UserDetails
        } else {
            return principal.toString(); // Sometimes it's just a String (username)
        }
    }

    public static String generateUUIDString() {
        return java.util.UUID.randomUUID().toString();
    }
}
